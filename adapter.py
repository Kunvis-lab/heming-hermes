"""Hermes platform adapter. Plaintext stays in the local process pair."""
import asyncio
import dataclasses
import json
import os
import re
import shutil
import uuid
from pathlib import Path

from gateway.config import Platform
from gateway.pairing import PairingStore
from gateway.platforms.base import BasePlatformAdapter, SendResult
from gateway.platforms.event import MessageEvent, MessageType
from hermes_constants import get_hermes_home

from .setup import environment_defaults, interactive_setup, is_configured
from .approval import ApprovalCards
from .work import WorkCards
from .managed_tasks import ManagedTasks


def extract_file_media(content):
    """Keep native masking, and accept explicit standalone local files of any suffix."""
    native = getattr(BasePlatformAdapter, "extract_media", None)
    media, cleaned = native(content) if native else ([], content)
    lines, fence = [], None
    for line in cleaned.splitlines(keepends=True):
        marker = re.match(r"^ {0,3}(`{3,}|~{3,})", line)
        if marker:
            value = marker.group(1)
            if fence is None:
                fence = (value[0], len(value))
            elif value[0] == fence[0] and len(value) >= fence[1]:
                fence = None
            lines.append(line)
            continue
        match = None if fence else re.fullmatch(
            r''' {0,3}MEDIA:[ \t]*(?:"([^"\r\n]+)"|'([^'\r\n]+)'|([^\s]+))[ \t]*''', line.rstrip("\r\n"))
        if match:
            path = os.path.expanduser(next(value for value in match.groups() if value is not None))
            if Path(path).is_absolute() and "\0" not in path:
                media.append((path, False))
                continue
        lines.append(line)
    unique = dict.fromkeys(os.path.normpath(path) for path, _ in media)
    return [(path, False) for path in unique], "".join(lines).strip()


async def deliver_file_media(adapter, event, media_files, local_files, *, metadata, record_delivery, **_options):
    # No image/audio/video dispatch, transcoding, parsing or opening on this channel.
    paths = dict.fromkeys([path for path, _ in media_files] + list(local_files))
    for path in paths:
        result = await adapter.send_document(event.source.chat_id, path, metadata=metadata)
        record_delivery(result)
        if not result.success:
            await adapter._notify_media_delivery_failure(event.source.chat_id, path, metadata=metadata)


class HemingAdapter(BasePlatformAdapter):
    REQUIRES_EDIT_FINALIZE = True
    MAX_MESSAGE_LENGTH = 16_384

    extract_media = staticmethod(extract_file_media)

    async def _deliver_media_attachments(self, event, media_files, local_files, **options):
        return await deliver_file_media(self, event, media_files, local_files, **options)

    def __init__(self, config, *, state_path=None, state_listener=None):
        super().__init__(config, Platform("heming"))
        self.state_path = Path(state_path) if state_path else Path(get_hermes_home()) / "heming" / "identity.json"
        self._state_listener = state_listener
        self._process = None
        self._reader = None
        self._session = None
        self._request = None
        self._parts = {}
        self._suppressed_parts = set()
        self._sends = {}
        self._file_deliveries = {}
        self._approvals = ApprovalCards(self)
        self._actions = set()
        self._work = WorkCards(self)
        self._request_event = None
        self._managed = ManagedTasks(self)

    def _mark_connected(self, **kwargs):
        if self._state_listener:
            self._running = True
            self._state_listener(self)
        else:
            super()._mark_connected(**kwargs)

    def _mark_disconnected(self):
        if self._state_listener:
            self._running = False
            self._state_listener(self)
        else:
            super()._mark_disconnected()

    def _clear_request(self):
        self._request, self._parts = None, {}
        self._suppressed_parts.clear()
        self._request_event = None
        self._work.records.clear()
        self._file_deliveries.clear()

    async def connect(self, *, is_reconnect=False):
        if self._process and self._process.returncode is None:
            return True
        self._session = None
        self._clear_request()
        args = ["bridge", "--provider", "Hermes", "--state", str(self.state_path)]
        args.extend(["--protected-root", str(Path(get_hermes_home()) / "heming")])
        # Developer-only loopback override for isolated integration tests. The
        # connector validates the origin; ordinary users keep the pinned default.
        origin = (getattr(self.config, "extra", None) or {}).get("origin")
        if origin:
            args.extend(["--origin", origin])
        self._process = await asyncio.create_subprocess_exec(
            shutil.which("node"), str(Path(__file__).with_name("connector.mjs")),
            *args,
            stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE,
            limit=300_000,
        )
        self._reader = asyncio.create_task(self._read_bridge())
        # Pairing must not block all other Hermes channels' startup deadlines.
        return True

    async def _write(self, event):
        if not self._process or self._process.returncode is not None:
            raise RuntimeError("HEMING_BRIDGE_OFFLINE")
        self._process.stdin.write((json.dumps(event, ensure_ascii=False) + "\n").encode())
        await self._process.stdin.drain()

    async def _read_bridge(self):
        try:
            while line := await self._process.stdout.readline():
                event = json.loads(line)
                if event["type"] == "ready":
                    expected = getattr(self, "_expected_session", None)
                    if expected and (event.get("conversationId") != expected["conversationId"] or
                            str(event.get("ownerIdentityId")) != str(expected["ownerIdentityId"])):
                        raise RuntimeError("HEMING_OWNER_MISMATCH")
                    self._session = event
                    # The QR approval already proves this exact owner. Use Hermes'
                    # normal pairing store, never trust-all or synthetic internal events.
                    pairing = PairingStore(profile=getattr(self, "_owner_profile", None))
                    owner = str(event["ownerIdentityId"])
                    if not pairing.is_approved("heming", owner):
                        code = pairing.generate_code("heming", owner, "和鸣用户")
                        if not code or not pairing.approve_code("heming", code):
                            raise RuntimeError("HEMING_OWNER_APPROVAL_FAILED")
                    self._mark_connected()
                elif event["type"] == "message":
                    if not self._session or event["conversationId"] != self._session["conversationId"] or str(event["senderIdentityId"]) != str(self._session["ownerIdentityId"]):
                        raise RuntimeError("HEMING_OWNER_MISMATCH")
                    self._clear_request()
                    self._request = event
                    source = self.build_source(chat_id=event["conversationId"], chat_type="dm",
                        user_id=str(event["senderIdentityId"]), user_name="和鸣用户")
                    self._request_event = MessageEvent(text=event["text"], message_type=MessageType.TEXT,
                        source=source, message_id=event["requestId"])
                    await self.handle_message(self._request_event)
                elif event["type"] == "managed-task-request":
                    task = asyncio.create_task(self._managed.handle(event))
                    self._actions.add(task)
                    task.add_done_callback(self._action_finished)
                elif event["type"] in ("sent", "send-failed"):
                    future = self._sends.pop(event.get("nonce"), None)
                    if future and not future.done():
                        future.set_result(event)
                elif event["type"] == "action":
                    # The reader must stay free to receive the card-update ACK.
                    task = asyncio.create_task(self._work.handle(event) if event.get("kind") else self._approvals.handle(event))
                    self._actions.add(task)
                    task.add_done_callback(self._action_finished)
                elif event["type"] == "cancel":
                    if self._request and self._request["requestId"] == event["requestId"]:
                        task = asyncio.create_task(self._work.stop(event["requestId"], notify=False))
                        self._actions.add(task)
                        task.add_done_callback(self._action_finished)
        finally:
            self._managed.stop()
            self._work.reset()
            self._approvals.reset()
            for task in self._actions:
                task.cancel()
            self._session = None
            self._clear_request()
            self._mark_disconnected()
            for future in self._sends.values():
                if not future.done():
                    future.set_exception(RuntimeError("HEMING_BRIDGE_CLOSED"))
            self._sends.clear()

    def _action_finished(self, task):
        self._actions.discard(task)
        if not task.cancelled():
            task.exception()  # Retrieve failures without logging message contents.

    async def _bridge_send(self, event, timeout=20):
        nonce = str(uuid.uuid4())
        future = asyncio.get_running_loop().create_future()
        self._sends[nonce] = future
        try:
            await self._write({**event, "nonce": nonce})
            result = await asyncio.wait_for(future, timeout)
            if result["type"] != "sent":
                raise RuntimeError("HEMING_DELIVERY_FAILED")
            return result
        finally:
            self._sends.pop(nonce, None)

    async def send_exec_approval(self, chat_id, command, session_key, description=None,
                                 metadata=None, allow_permanent=True, allow_session=True, smart_denied=False):
        try:
            message_id = await self._approvals.send(chat_id, command, session_key, description,
                allow_permanent, allow_session, smart_denied)
            return SendResult(success=True, message_id=message_id)
        except (ImportError, RuntimeError, ValueError, asyncio.TimeoutError):
            return SendResult(success=False, error="HEMING_APPROVAL_UNAVAILABLE")

    async def _send_exec_approval_prompt(self, prompt):
        # New Hermes native-card capability hook; the legacy entry point above
        # remains compatible with older runners. Never change Hermes policy.
        choices = {choice for _, choice, _ in prompt.actions}
        return await self.send_exec_approval(prompt.chat_id, prompt.command, prompt.session_key,
            prompt.description, prompt.metadata, "always" in choices, "session" in choices, prompt.smart_denied)

    async def send(self, chat_id, content, reply_to=None, metadata=None):
        if not self._session or str(chat_id) != self._session["conversationId"]:
            return SendResult(success=False, error="HEMING_RECIPIENT_MISMATCH")
        if reply_to and (not self._request or str(reply_to) != self._request["requestId"]):
            return SendResult(success=False, error="HEMING_REPLY_CLOSED")
        if (metadata or {}).get("is_approval_prompt"):
            return SendResult(success=False, error="HEMING_APPROVAL_REQUIRES_NATIVE_CARD")
        if (metadata or {}).get("job_id"):
            # Cron delivery can happen while a normal chat answer is buffered.
            # It must never be appended to that unrelated answer.
            try:
                result = await self._bridge_send({"type": "send", "conversationId": chat_id, "text": content})
                return SendResult(success=True, message_id=result.get("messageId"))
            except (RuntimeError, asyncio.TimeoutError):
                return SendResult(success=False, error="HEMING_DELIVERY_FAILED")
        if (metadata or {}).get("_interim_send"):
            message_id = str(uuid.uuid4())
            if self._request:
                self._suppressed_parts.add(message_id)
            return SendResult(success=True, message_id=message_id)
        if self._request:
            message_id = str(uuid.uuid4())
            self._parts[message_id] = content
            return SendResult(success=True, message_id=message_id)
        try:
            result = await self._bridge_send({"type": "send", "conversationId": chat_id, "text": content})
            return SendResult(success=True, message_id=result.get("messageId"))
        except (RuntimeError, asyncio.TimeoutError):
            return SendResult(success=False, error="HEMING_DELIVERY_FAILED")

    async def _snapshot(self):
        await self._write({"type": "snapshot", "requestId": self._request["requestId"],
            "text": "\n\n".join(self._parts.values())})

    async def send_document(self, chat_id, file_path, caption=None, file_name=None,
                            reply_to=None, metadata=None, **kwargs):
        if not self._session or str(chat_id) != self._session["conversationId"]:
            return SendResult(success=False, error="HEMING_RECIPIENT_MISMATCH")
        if reply_to and (not self._request or str(reply_to) != self._request["requestId"]):
            return SendResult(success=False, error="HEMING_REPLY_CLOSED")
        if (metadata or {}).get("_interim_send"):
            return SendResult(success=False, error="HEMING_FILE_FINAL_ONLY")
        receipt = None
        try:
            path = Path(file_path).expanduser().absolute()
            request_id = "" if (metadata or {}).get("job_id") else (self._request or {}).get("requestId", "")
            key = (str(chat_id), request_id, str((metadata or {}).get("job_id", "")),
                   str(path), str(file_name or ""), str(caption or ""), path.stat().st_mtime_ns)
            if key not in self._file_deliveries and len(self._file_deliveries) >= 128:
                completed = next((old for old, value in self._file_deliveries.items() if value["settled"]), None)
                if completed is None:
                    return SendResult(success=False, error="HEMING_FILE_QUEUE_FULL")
                del self._file_deliveries[completed]
            receipt = self._file_deliveries.setdefault(key, {"id": str(uuid.uuid4()), "settled": False})
            receipt["settled"] = False
            delivery_id = receipt["id"]
            result = await self._bridge_send({"type": "send-file", "conversationId": str(chat_id),
                "filePath": str(path), "fileName": file_name or kwargs.get("filename"),
                "caption": caption or "", "requestId": request_id, "deliveryId": delivery_id}, timeout=300)
            return SendResult(success=True, message_id=result.get("messageId"))
        except (OSError, RuntimeError, ValueError, TypeError, asyncio.TimeoutError):
            # Never echo an internal absolute path, file contents or provider exception.
            return SendResult(success=False, error="HEMING_FILE_DELIVERY_FAILED")
        finally:
            if receipt is not None:
                receipt["settled"] = True

    async def edit_message(self, chat_id, message_id, content, *, finalize=False, metadata=None):
        if not self._session or not self._request or str(chat_id) != self._session["conversationId"]:
            return SendResult(success=False, error="HEMING_REPLY_CLOSED")
        if message_id not in self._parts and message_id not in self._suppressed_parts:
            return SendResult(success=False, error="HEMING_MESSAGE_NOT_EDITABLE")
        if message_id in self._suppressed_parts:
            return SendResult(success=True, message_id=message_id)
        if (metadata or {}).get("_interim_send"):
            self._suppressed_parts.add(message_id)
            del self._parts[message_id]
            return SendResult(success=True, message_id=message_id)
        self._parts[message_id] = content
        return SendResult(success=True, message_id=message_id)

    async def on_processing_complete(self, event, outcome):
        if event.message_id in self._work.stopping:
            return
        async with self._work.lock:
            await self._finish_request(event, outcome)

    async def _finish_request(self, event, outcome):
        if self._request and event.message_id == self._request["requestId"]:
            request = self._request
            try:
                await self._approvals.close_request(request["requestId"])
                if outcome.value == "success":
                    await self._snapshot()
                await self._write({"type": "complete" if outcome.value == "success" else "failed",
                    "requestId": request["requestId"]})
            finally:
                if self._request is request:
                    self._clear_request()

    async def on_processing_start(self, event):
        if self._request and event.message_id == self._request["requestId"]:
            await self._work.status("working", hasattr(self, "cancel_session_processing"))

    async def send_clarify(self, chat_id, question, choices, clarify_id, session_key, metadata=None):
        try:
            message_id = await self._work.question(chat_id, question, choices, clarify_id, session_key)
            return SendResult(success=True, message_id=message_id)
        except (ImportError, RuntimeError, ValueError, asyncio.TimeoutError):
            return SendResult(success=False, error="HEMING_QUESTION_UNAVAILABLE")

    async def retire_clarify_card(self, clarify_id, notice):
        try:
            await self._work.retire(clarify_id)
        except (RuntimeError, asyncio.TimeoutError):
            pass

    async def get_chat_info(self, chat_id):
        return {"name": "和鸣个人助手", "type": "dm"}

    async def delete_message(self, chat_id, message_id):
        # Hermes may replace a stream preview with a clean final send. Those
        # previews are local buffers here, not already-visible chat messages.
        if not self._session or str(chat_id) != self._session["conversationId"]:
            return False
        removed = self._parts.pop(message_id, None) is not None
        self._suppressed_parts.discard(message_id)
        return removed

    async def disconnect(self):
        self._managed.stop()
        self._work.reset()
        self._approvals.reset()
        for task in self._actions:
            task.cancel()
        if self._process and self._process.returncode is None:
            self._process.terminate()
            try:
                await asyncio.wait_for(self._process.wait(), 5)
            except asyncio.TimeoutError:
                self._process.kill()
                await self._process.wait()
        if self._reader:
            await asyncio.gather(self._reader, return_exceptions=True)
        self._session = None
        self._clear_request()
        self._mark_disconnected()


def register(ctx):
    from .team import HemingTeamAdapter
    options = dict(name="heming", label="和鸣 · 扫码连接", adapter_factory=HemingTeamAdapter,
        check_fn=lambda: bool(shutil.which("node")), validate_config=lambda _: True,
        setup_fn=interactive_setup, is_connected=is_configured,
        env_enablement_fn=environment_defaults,
        required_env=[], max_message_length=16_384,
        allowed_users_env="HEMING_ALLOWED_USERS", allow_all_env="HEMING_ALLOW_ALL_USERS",
        platform_hint="和鸣支持文字和通用文件回传，不限定文件后缀，不负责打开、预览、解析或转换文件。需要发送文件时先生成本地文件，然后在单独一行输出 MEDIA:绝对路径；路径含空格时用引号包住路径。不要只回复服务器路径、Markdown 链接或代码块。文件保持原样作为普通附件发送。")
    try:
        from gateway.platform_registry import PlatformEntry
        if "display_tier" in {field.name for field in dataclasses.fields(PlatformEntry)}:
            options["display_tier"] = "high"
    except ImportError:
        pass
    ctx.register_platform(**options)
