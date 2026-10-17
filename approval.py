"""Native approval cards; decisions only resolve an exact Hermes pending ID."""
import asyncio
import inspect
from datetime import datetime, timedelta, timezone


class ApprovalCards:
    def __init__(self, adapter):
        self.adapter = adapter
        self.records = {}
        self.monitors = set()
        self.lock = asyncio.Lock()

    async def send(self, chat_id, command, session_key, description=None,
                   allow_permanent=True, allow_session=True, smart_denied=False):
        adapter = self.adapter
        if not adapter._request or not adapter._session or str(chat_id) != adapter._session["conversationId"]:
            raise RuntimeError("HEMING_APPROVAL_TASK_CLOSED")
        from tools.approval import list_gateway_approvals, resolve_gateway_approval
        from tools.approval_context import _get_approval_timeout
        from agent.redact import redact_sensitive_text
        # No FIFO fallback: older runtimes without exact-ID resolution fail closed.
        if "request_id" not in inspect.signature(resolve_gateway_approval).parameters:
            raise RuntimeError("HEMING_APPROVAL_RUNTIME_UNSUPPORTED")
        redacted = redact_sensitive_text(str(command), force=True)
        if not redacted.strip() or len(redacted) > 6000:
            raise RuntimeError("HEMING_APPROVAL_COMMAND_LIMIT")
        candidates = [entry for entry in list_gateway_approvals(session_key)
                      if entry.get("request_id") not in self.records
                      and redact_sensitive_text(str(entry.get("command", "")), force=True) == redacted
                      and (description is None or str(entry.get("description", "")) == str(description))]
        if len(candidates) != 1:
            raise RuntimeError("HEMING_APPROVAL_ID_AMBIGUOUS")
        entry = candidates[0]
        request_id = str(entry["request_id"])
        actions = ["once"]
        restricted = smart_denied or entry.get("smart_denied", False)
        if not restricted and allow_session and entry.get("allow_session", True):
            actions.append("session")
            if allow_permanent and entry.get("allow_permanent", True):
                actions.append("always")
        actions.append("deny")
        timeout = max(1, min(float(_get_approval_timeout()), 86_400))
        card = {"version": 1, "kind": "approval", "id": request_id,
                "requestMessageId": adapter._request["requestId"],
                "ownerIdentityId": str(adapter._session["ownerIdentityId"]),
                "command": redacted[:6000],
                "reason": redact_sensitive_text(str(description or entry.get("description") or "此操作需要你的批准"), force=True)[:2000],
                "actions": actions, "status": "pending", "revision": 0,
                "expiresAt": (datetime.now(timezone.utc) + timedelta(seconds=timeout)).isoformat()}
        record = {"card": card, "session": session_key, "chat": str(chat_id), "message": None}
        # Reserve synchronously before the first await, so concurrent prompts
        # with identical command text can never claim one approval twice.
        self.records[request_id] = record
        for key, old in list(self.records.items()):
            if len(self.records) <= 128:
                break
            if old["card"]["status"] != "pending":
                del self.records[key]
        try:
            result = await adapter._bridge_send({"type": "interaction", "conversationId": str(chat_id), "interaction": card})
            record["message"] = result["messageId"]
        except BaseException:
            self._withdraw(record, "notification_failed")
            card["status"] = "failed"
            raise
        task = asyncio.create_task(self._watch(record))
        self.monitors.add(task)
        task.add_done_callback(self.monitors.discard)
        return record["message"]

    def _withdraw(self, record, cause):
        from tools import approval
        withdraw = getattr(approval, "withdraw_gateway_approval", None)
        if withdraw:
            withdraw(record["session"], record["card"]["id"], cause)

    async def _settle(self, record, status, choice=None):
        if record["card"]["status"] != "pending":
            return
        record["card"] = {**record["card"], "status": status, "revision": 1}
        if choice:
            record["card"]["choice"] = choice
        if record["message"]:
            try:
                await self.adapter._bridge_send({"type": "interaction", "conversationId": record["chat"],
                    "targetMessageId": record["message"], "interaction": record["card"]})
            except (RuntimeError, asyncio.TimeoutError):
                pass  # The UI independently disables expired cards. Never retry a decision.

    async def handle(self, event):
        from tools.approval import list_gateway_approvals, resolve_gateway_approval
        async with self.lock:
            record = self.records.get(str(event.get("interactionId", "")))
            session, request = self.adapter._session, self.adapter._request
            if not record or not session or not request:
                return
            card = record["card"]
            if (card["status"] != "pending" or str(event.get("senderIdentityId")) != card["ownerIdentityId"]
                    or str(session["ownerIdentityId"]) != card["ownerIdentityId"]
                    or event.get("conversationId") != record["chat"]
                    or event.get("requestMessageId") != card["requestMessageId"]
                    or request["requestId"] != card["requestMessageId"]
                    or event.get("targetMessageId") != record["message"]
                    or event.get("action") not in card["actions"]):
                return
            if datetime.now(timezone.utc) >= datetime.fromisoformat(card["expiresAt"]):
                self._withdraw(record, "timeout")
                await self._settle(record, "expired")
                return
            if not any(entry.get("request_id") == card["id"] for entry in list_gateway_approvals(record["session"])):
                await self._settle(record, "closed")
                return
            choice = event["action"]
            count = resolve_gateway_approval(record["session"], choice, request_id=card["id"])
            await self._settle(record, ("denied" if choice == "deny" else "approved") if count == 1 else "closed",
                               choice if count == 1 else None)

    async def _watch(self, record):
        from tools.approval import list_gateway_approvals
        while record["card"]["status"] == "pending":
            await asyncio.sleep(1)
            async with self.lock:
                if datetime.now(timezone.utc) >= datetime.fromisoformat(record["card"]["expiresAt"]):
                    self._withdraw(record, "timeout")
                    await self._settle(record, "expired")
                elif not any(entry.get("request_id") == record["card"]["id"] for entry in list_gateway_approvals(record["session"])):
                    await self._settle(record, "closed")

    async def close_request(self, request_id):
        async with self.lock:
            for record in list(self.records.values()):
                if record["card"]["requestMessageId"] == request_id and record["card"]["status"] == "pending":
                    self._withdraw(record, "turn_finished")
                    await self._settle(record, "closed")

    def reset(self):
        for task in self.monitors:
            task.cancel()
        self.monitors.clear()
        for record in self.records.values():
            if record["card"]["status"] == "pending":
                self._withdraw(record, "disconnected")
        self.records.clear()
