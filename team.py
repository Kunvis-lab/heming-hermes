"""One Hermes platform, independent owner-bound member transports."""
import asyncio
import time

from gateway.config import Platform
from gateway.platforms.base import BasePlatformAdapter, SendResult
from hermes_constants import get_hermes_home

from .accounts import legacy_path, pairings
from .adapter import HemingAdapter
from .member_runtime import wire_member
from .setup import _pairing_in_use


class HemingTeamAdapter(BasePlatformAdapter):
    REQUIRES_EDIT_FINALIZE = True
    MAX_MESSAGE_LENGTH = 16_384

    def __init__(self, config):
        super().__init__(config, Platform("heming"))
        self._running = False
        self._members = {}
        self._watcher = None
        self._refresh_lock = asyncio.Lock()
        self._retry_at = {}

    def _state_changed(self, member):
        if member._session and member._running:
            # Duplicate recipient bindings must not introduce a first-match
            # route to someone else's transport, including during hot loading.
            if any(other is not member and other._session and other._session["conversationId"] == member._session["conversationId"]
                   for other in self._members.values()):
                raise RuntimeError("HEMING_DUPLICATE_RECIPIENT")
        connected = any(item._running for item in self._members.values())
        if connected and not self._running:
            self._mark_connected()
        elif not connected and self._running:
            self._mark_disconnected()

    async def _refresh(self):
        async with self._refresh_lock:
            home = get_hermes_home()
            found = dict(pairings(home))
            if not found:
                found[legacy_path(home)] = None  # Keep first-use Gateway QR pairing.
            for path in list(self._members):
                if path not in found:
                    member = self._members.pop(path)
                    if member._request_event:
                        await member.cancel_session_processing(member._event_session_key(member._request_event))
                    await member.disconnect()
                    self._retry_at.pop(path, None)
            for path, session in found.items():
                member = self._members.get(path)
                if member is None:
                    if _pairing_in_use(path):
                        continue  # Pair command may have saved keys but not released its lock yet.
                    member = HemingAdapter(self.config, state_path=path, state_listener=self._state_changed)
                    self._members[path] = member
                wire_member(self, member)
                member._expected_session = session
                if member._reader and not member._reader.done():
                    continue
                if time.monotonic() < self._retry_at.get(path, 0):
                    continue
                if member._reader:
                    await asyncio.gather(member._reader, return_exceptions=True)
                    await member.disconnect()
                if _pairing_in_use(path):
                    continue  # Never compete with an operator's live pairing process.
                self._retry_at[path] = time.monotonic() + 30
                try:
                    await member.connect()
                except (OSError, RuntimeError):
                    # One member's unavailable connector never tears down the
                    # rest of the team or other platforms such as Feishu.
                    continue

    async def _watch(self):
        while True:
            await asyncio.sleep(2)
            try:
                await self._refresh()
            except (OSError, RuntimeError):
                continue

    async def connect(self, *, is_reconnect=False):
        await self._refresh()
        if not self._watcher or self._watcher.done():
            self._watcher = asyncio.create_task(self._watch())
        return True

    def _recipient(self, chat_id):
        matches = [member for member in self._members.values() if member._running and member._session and str(chat_id) == member._session["conversationId"]]
        return matches[0] if len(matches) == 1 else None

    async def send(self, chat_id, content, reply_to=None, metadata=None):
        member = self._recipient(chat_id)
        if not member:
            return SendResult(success=False, error="HEMING_RECIPIENT_MISMATCH")
        return await member.send(chat_id, content, reply_to=reply_to, metadata=metadata)

    async def edit_message(self, chat_id, message_id, content, *, finalize=False, metadata=None):
        member = self._recipient(chat_id)
        if not member:
            return SendResult(success=False, error="HEMING_RECIPIENT_MISMATCH")
        return await member.edit_message(chat_id, message_id, content, finalize=finalize, metadata=metadata)

    async def delete_message(self, chat_id, message_id):
        member = self._recipient(chat_id)
        return await member.delete_message(chat_id, message_id) if member else False

    async def send_exec_approval(self, chat_id, command, session_key, description=None, metadata=None,
                                 allow_permanent=True, allow_session=True, smart_denied=False):
        member = self._recipient(chat_id)
        if not member:
            return SendResult(success=False, error="HEMING_RECIPIENT_MISMATCH")
        return await member.send_exec_approval(chat_id, command, session_key, description, metadata,
                                              allow_permanent, allow_session, smart_denied)

    async def _send_exec_approval_prompt(self, prompt):
        member = self._recipient(prompt.chat_id)
        return await member._send_exec_approval_prompt(prompt) if member else SendResult(success=False, error="HEMING_RECIPIENT_MISMATCH")

    async def send_clarify(self, chat_id, question, choices, clarify_id, session_key, metadata=None):
        member = self._recipient(chat_id)
        if not member:
            return SendResult(success=False, error="HEMING_RECIPIENT_MISMATCH")
        return await member.send_clarify(chat_id, question, choices, clarify_id, session_key, metadata)

    async def retire_clarify_card(self, clarify_id, notice):
        members = [member for member in self._members.values() if str(clarify_id) in member._work.records]
        if len(members) == 1:
            await members[0].retire_clarify_card(clarify_id, notice)

    async def get_chat_info(self, chat_id):
        member = self._recipient(chat_id)
        if not member:
            raise ValueError("HEMING_RECIPIENT_MISMATCH")
        return await member.get_chat_info(chat_id)

    async def disconnect(self):
        if self._watcher:
            self._watcher.cancel()
            await asyncio.gather(self._watcher, return_exceptions=True)
            self._watcher = None
        # Use Hermes' native cancellation before closing per-member pipes.
        cancel = getattr(self, "cancel_background_tasks", None)
        if cancel:
            await cancel()
        members, self._members = list(self._members.values()), {}
        await asyncio.gather(*(member.disconnect() for member in members), return_exceptions=True)
        self._mark_disconnected()
