"""Expose the native command catalog and forward text under the paired user's authority."""
import re
from contextvars import ContextVar

from gateway.platforms.event import MessageEvent, MessageType


slash_reply = ContextVar("heming_slash_reply", default=None)
_NAME = re.compile(r"[a-z0-9][a-z0-9_-]{0,63}")
_CARD_ONLY = {"approve", "deny", "approvals", "yolo"}
_HOST_ONLY = {"autoprune", "codex-runtime", "curator", "debug", "diff", "egress", "init", "kanban", "login",
              "memory", "pause", "platform", "profile", "reload-mcp", "reload-skills", "restart", "rollback",
              "sethome", "skills", "topup", "update", "verbose"}
_SAFE_DURING_CARD = {"help", "whoami", "status", "context", "version", "usage", "commands", "stop"}


def _role(adapter, source):
    from gateway.slash_access import policy_for_runner_source

    runner = getattr(adapter, "gateway_runner", None)
    authorize = getattr(runner, "_is_user_authorized_for_source", None)
    gate = getattr(runner, "_check_slash_access", None)
    if not callable(authorize) or not callable(gate) or not authorize(source):
        return None, False, False
    policy = policy_for_runner_source(runner, source)
    return gate, policy.enabled, policy.enabled and policy.is_admin(source.user_id)


def _command_entries(adapter, source):
    from hermes_cli.commands import COMMAND_REGISTRY, _is_gateway_available, _resolve_config_gates, _iter_plugin_command_entries

    gate, scoped, admin = _role(adapter, source)
    if not gate:
        return {}, False
    overrides = _resolve_config_gates()
    rows, reserved = {}, set()
    quick = getattr(adapter.gateway_runner, "_hm_quick_commands", lambda: {})()
    for item in COMMAND_REGISTRY:
        reserved.update((item.name, *item.aliases))
        if (not _is_gateway_available(item, overrides) or item.name in _CARD_ONLY or item.name in {"topic", "start"} or
                item.name in _HOST_ONLY and not admin or item.name in quick or gate(source, item.name) is not None):
            continue
        rows[item.name] = (item.describe(), tuple(alias for alias in item.aliases if alias not in quick), item)

    # Arbitrary installed slash handlers can be privileged. Require an explicit
    # Hermes command scope before exposing them; raw shell quick commands stay out.
    if scoped:
        from hermes_cli.commands_platforms import _iter_gateway_skills, _gateway_bundles

        plugin = [(name, desc) for name, desc, _ in _iter_plugin_command_entries()]
        skills = [(key.lstrip("/"), data.get("description", "")) for key, data, *_ in _iter_gateway_skills("heming")]
        bundles = [(key.lstrip("/"), data.get("description", "")) for key, data in _gateway_bundles()]
        for name, description in (*plugin, *bundles, *skills):
            if _NAME.fullmatch(name) and name not in reserved and name not in quick and gate(source, name) is None:
                rows.setdefault(name, (description, (), None))
    return rows, admin


def command_catalog(adapter, source):
    entries, _ = _command_entries(adapter, source)
    return [{"name": name, "hint": " ".join(str(hint or "").split())[:72],
             "aliases": [alias for alias in aliases if _NAME.fullmatch(alias)][:8]}
            for name, (hint, aliases, _) in list(entries.items())[:160]]


def _bound(adapter, event):
    session = adapter._session
    return session and event.get("conversationId") == session["conversationId"] and str(event.get("senderIdentityId")) == str(session["ownerIdentityId"])


def slash_source(adapter, event):
    source = adapter.build_source(chat_id=event["conversationId"], chat_type="dm",
                                  user_id=str(event["senderIdentityId"]), user_name="和鸣用户")
    adapter._canonicalize(source)
    return source


def authorized_command(adapter, message):
    name = message.get_command()
    if not name or not _NAME.fullmatch(name):
        return None
    entries, admin = _command_entries(adapter, message.source)
    if name not in entries:
        name = next((key for key, (_, aliases, _) in entries.items() if name in aliases), "")
    if not name:
        return None
    argument = message.get_command_args().strip()
    args = argument.lower().split()
    if not admin and (any(arg.startswith("--global") for arg in args) or name == "sessions" and args[:1] == ["all"]):
        return None
    if name not in _SAFE_DURING_CARD and any(row["card"]["status"] == "pending"
            for records in (adapter._work.records, adapter._approvals.records) for row in records.values()):
        return None
    if name in {"queue", "steer"} and argument.startswith(("/", "／")):
        return None  # A queued or rewritten prompt must not become a second control command.
    if name in {"new", "undo"} and any(arg in {"now", "--yes", "-y"} for arg in args):
        return None
    # Relies on the same Gateway half of the adapter for busy policy and dispatch.
    return name, entries[name][2]


async def forward_slash_confirmation(adapter, message):
    # Hermes has two separate confirmation registries. Only let the same
    # sender answer a native slash-confirm prompt here, never an exec approval.
    if message.text.strip().lower() not in {"/approve", "/cancel"}:
        return None
    from tools import slash_confirm
    from tools.approval import has_blocking_approval

    gate, _, _ = _role(adapter, message.source)
    if not gate:
        return None
    runner = adapter.gateway_runner
    key = runner._session_key_for_source(message.source)
    if (has_blocking_approval(key) or not slash_confirm.get_pending(key) or
            any(row["card"]["status"] == "pending" for row in adapter._approvals.records.values())):
        return None
    result = await runner._hm_slash_confirm_reply(message, key)
    return getattr(result, "text", result) or "未收到 Hermes 的确认结果，请核对当前会话。"


def publish_catalog(adapter, event):
    if _bound(adapter, event):
        return {"type": "command-catalog", "requestId": event["requestId"],
                "conversationId": event["conversationId"], "commands": command_catalog(adapter, slash_source(adapter, event))}
    return None


async def send_slash_reply(adapter, scope, content):
    owner, session, request_id, parts = scope
    if owner is not adapter or session is not adapter._session:
        raise RuntimeError("HEMING_SLASH_SESSION_CLOSED")
    part = next(parts)
    return await adapter._bridge_send({"type": "send", "conversationId": session["conversationId"],
                                       "slashReplyId": request_id, "part": part, "text": str(content)[:16_384]})


async def forward_running_command(adapter, event):
    from itertools import count

    if not _bound(adapter, event):
        return
    request, session = adapter._request, adapter._session
    message = MessageEvent(text=event["text"], message_type=MessageType.TEXT, source=slash_source(adapter, event),
                           message_id=event["requestId"])
    scope = (adapter, session, event["requestId"], count())
    # No text delivered during a previous task may accidentally target a new one.
    if not request or event["targetRequestId"] != request["requestId"]:
        await send_slash_reply(adapter, scope, "原任务已结束或已变化，指令未执行。请核对后重新发送。")
        return
    confirmation = await forward_slash_confirmation(adapter, message)
    if confirmation is not None:
        await send_slash_reply(adapter, scope, confirmation)
        return
    command = authorized_command(adapter, message)
    if not command:
        await send_slash_reply(adapter, scope, "当前会话无权使用这条指令，或需先完成追问／审批。指令未执行。")
        return
    if command[1] is None or adapter._event_session_key(message) not in adapter._active_sessions:
        await send_slash_reply(adapter, scope, "Hermes 当前无法处理这条指令。指令未排队，请稍后重发。")
        return
    # Hermes can schedule a follow-up (notably /queue). Its producer lifecycle
    # adopts these validated IDs for answer, clarification and approval delivery.
    adapter._native_slash_ids[event["requestId"]] = True
    if len(adapter._native_slash_ids) > 160:
        del adapter._native_slash_ids[next(iter(adapter._native_slash_ids))]
    if command[0] in {"stop", "new"}:
        # Hermes sets accept_interrupt only after admission. The original turn
        # can unwind before the command call returns to this bridge.
        request.setdefault("nativeInterrupts", []).append(message)
    guard = slash_reply.set(scope)
    try:
        await adapter.handle_message(message)
    finally:
        slash_reply.reset(guard)
        if command[0] in {"stop", "new"} and not getattr(message, "_interrupt_accepted", False):
            request["nativeInterrupts"].remove(message)
