"""Allowlisted controls for exactly one authenticated, active Heming turn."""
from contextvars import ContextVar

from gateway.platforms.event import MessageEvent, MessageType


side_reply = ContextVar("heming_side_reply", default=None)


def permitted_commands(adapter, original):
    runner = getattr(adapter, "gateway_runner", None)
    authorize = getattr(runner, "_is_user_authorized_for_source", None)
    gate = getattr(runner, "_check_slash_access", None)
    if not callable(authorize) or not callable(gate) or not authorize(original.source):
        return []
    available = {"btw": callable(getattr(runner, "_handle_btw_command", None)),
                 "steer": all(callable(getattr(runner, name, None)) for name in
                              ("_peek_session_state", "_steer_running_agent", "_fold_into_running_turn", "_steer_text_with_origin")),
                 "queue": True}
    return [name for name, supported in available.items() if supported and gate(original.source, name) is None]


async def deliver_side_reply(adapter, scope, content):
    from agent.redact import redact_for_egress

    session, failure_marker, reply_id = scope
    if adapter._session is not session:
        raise RuntimeError("HEMING_SIDE_SESSION_CLOSED")
    text = "顺便问未能完成，请稍后重试。" if content.startswith(failure_marker) else redact_for_egress(content, urls=True)
    return await adapter._bridge_send({"type": "send", "conversationId": session["conversationId"],
        "sideReplyId": reply_id, "text": f"顺便问 · 独立回答\n\n{text[:7500]}"})


async def dispatch_task_command(adapter, action):
    original, request, session = adapter._request_event, adapter._request, adapter._session
    if not original or not request or not session or request["requestId"] != action.get("requestMessageId"):
        return False
    name = action["action"]
    command = "queue" if name.startswith("queue-") else name
    if command not in permitted_commands(adapter, original):
        return False
    if command == "queue":
        # The connector's durable encrypted inbox owns the boundary between
        # turns, including the IDs for later replies, attachments and approvals.
        return True
    if any(row["card"]["status"] == "pending" for row in adapter._work.records.values()) or any(
            row["card"]["status"] == "pending" for row in adapter._approvals.records.values()):
        return False
    runner = adapter.gateway_runner
    event = MessageEvent(text=f"/{command} {action['text']}", message_type=MessageType.TEXT,
        source=original.source, message_id=action["commandId"])
    if command == "steer":
        key = adapter._event_session_key(original)
        state = runner._peek_session_state(key)
        turn = state.turn if state else None
        actor = turn.agent if turn else None
        running = turn.running_event() if turn else None
        if not callable(getattr(actor, "steer", None)) or getattr(running, "message_id", None) != request["requestId"]:
            return False  # Never use Hermes' fallback that can start a different turn.
        if not runner._steer_running_agent(actor, runner._steer_text_with_origin(action["text"], event)):
            return False
        runner._fold_into_running_turn(actor, key, event)
        return True

    from agent.i18n import t
    from gateway.slash_commands import _preview
    preview = _preview(action["text"])
    marker = "__HEMING_PRIVATE_ERROR__"
    failure_prefix = t("gateway.btw.failed", preview=preview, error=marker).split(marker, 1)[0]
    scope = (session, failure_prefix, action["commandId"])
    token = side_reply.set((adapter, scope))
    try:
        reply = await runner._handle_btw_command(event)
        if reply != t("gateway.btw.started", preview=preview):
            return False
        return True
    finally:
        side_reply.reset(token)
