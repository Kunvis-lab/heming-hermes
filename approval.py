"""Native approval cards; decisions only resolve an exact Hermes pending ID."""
import asyncio
import inspect
from datetime import datetime, timedelta, timezone


class ApprovalAlreadyPending(RuntimeError):
    """A duplicate notification must not end the original approval."""


def find_pending_approval(entries, request_id, command, description, redact):
    if request_id is not None:
        if not isinstance(request_id, str) or not request_id.strip() or len(request_id) > 128:
            raise RuntimeError("HEMING_APPROVAL_INVALID_ID")
        candidates = [entry for entry in entries if entry.get("request_id") == request_id]
    else:
        # Older Hermes omitted the ID. Retain compatibility only for an unambiguous exact match.
        candidates = [entry for entry in entries if redact(str(entry.get("command", ""))) == command
                      and (description is None or str(entry.get("description", "")) == str(description))]
    if len(candidates) != 1:
        raise RuntimeError("HEMING_APPROVAL_ID_UNRESOLVED")
    entry = candidates[0]
    if redact(str(entry.get("command", ""))) != command:
        raise RuntimeError("HEMING_APPROVAL_COMMAND_MISMATCH")
    if not isinstance(entry.get("request_id"), str) or not entry["request_id"].strip() or len(entry["request_id"]) > 128:
        raise RuntimeError("HEMING_APPROVAL_INVALID_ID")
    return entry


class ApprovalCards:
    def __init__(self, adapter):
        self.adapter = adapter
        self.records = {}
        self.monitors = set()
        self.lock = asyncio.Lock()

    async def send(self, chat_id, command, session_key, description=None,
                   allow_permanent=True, allow_session=True, smart_denied=False, *, request_id=None, offered_actions=None):
        adapter = self.adapter
        request, session = adapter._request, adapter._session
        if not request or not session or str(chat_id) != session["conversationId"]:
            raise RuntimeError("HEMING_APPROVAL_TASK_CLOSED")
        from tools import approval as gateway_approval
        from tools.approval_context import _get_approval_timeout
        from agent import redact as redaction
        # No FIFO fallback: older runtimes without exact-ID resolution fail closed.
        if "request_id" not in inspect.signature(gateway_approval.resolve_gateway_approval).parameters:
            raise RuntimeError("HEMING_APPROVAL_RUNTIME_UNSUPPORTED")
        # New Hermes also escapes hidden characters in the command it presents.
        redact_command = getattr(redaction, "redact_approval_display", redaction.redact_sensitive_text)
        def redact(value):
            return redact_command(value, force=True)
        redacted = redact(str(command))
        entry = find_pending_approval(gateway_approval.list_gateway_approvals(session_key), request_id,
                                      redacted, description, redact)
        request_id = entry["request_id"]
        previous = self.records.get(request_id)
        if previous:
            if (previous["session"] == session_key and previous["chat"] == str(chat_id) and
                    previous["card"]["requestMessageId"] == request["requestId"] and
                    previous["card"]["status"] == "pending" and previous["message"]):
                return previous["message"]
            raise ApprovalAlreadyPending("HEMING_APPROVAL_ALREADY_PENDING")
        if not redacted.strip() or len(redacted.encode("utf-16-le")) > 12_000:
            self._withdraw_id(session_key, request_id, "notification_failed")
            raise RuntimeError("HEMING_APPROVAL_COMMAND_LIMIT")
        actions = ["once"]
        restricted = smart_denied or entry.get("smart_denied", False)
        if not restricted and allow_session and entry.get("allow_session", True):
            actions.append("session")
            if allow_permanent and entry.get("allow_permanent", True):
                actions.append("always")
        actions.append("deny")
        if offered_actions is not None:
            actions = [action for action in actions if action == "deny" or action in offered_actions]
        timeout = max(1, min(float(entry.get("timeout_s") or _get_approval_timeout()), 86_400))
        card = {"version": 1, "kind": "approval", "id": request_id,
                "requestMessageId": request["requestId"],
                "ownerIdentityId": str(session["ownerIdentityId"]),
                "command": redacted,
                "reason": redaction.redact_sensitive_text(str(description or entry.get("description") or "此操作需要你的批准"), force=True)[:2000],
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
            if adapter._request is not request or adapter._session is not session or record["card"]["status"] != "pending":
                raise RuntimeError("HEMING_APPROVAL_TASK_CLOSED")
            if not isinstance(result.get("messageId"), str) or not result["messageId"]:
                raise RuntimeError("HEMING_APPROVAL_DELIVERY_UNCONFIRMED")
            # New Hermes keeps a native card deny-only until its whole command was delivered.
            restrict = getattr(gateway_approval, "restrict_gateway_approval_card_to_deny", None)
            if restrict and actions != ["deny"]:
                restrict(session_key, request_id, restricted=False)
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
        self._withdraw_id(record["session"], record["card"]["id"], cause)

    @staticmethod
    def _withdraw_id(session_key, request_id, cause):
        from tools import approval
        withdraw = getattr(approval, "withdraw_gateway_approval", None)
        if withdraw:
            withdraw(session_key, request_id, cause)

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
        from tools import approval as gateway_approval
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
                    or not record["message"] or event.get("targetMessageId") != record["message"]
                    or event.get("action") not in card["actions"]):
                return
            if datetime.now(timezone.utc) >= datetime.fromisoformat(card["expiresAt"]):
                self._withdraw(record, "timeout")
                await self._settle(record, "expired")
                return
            def still_pending():
                return any(entry.get("request_id") == card["id"]
                           for entry in gateway_approval.list_gateway_approvals(record["session"]))
            if not still_pending():
                await self._settle(record, "closed")
                return
            choice = event["action"]
            resolve_card = getattr(gateway_approval, "resolve_gateway_approval_card", None)
            if resolve_card:
                parameters = inspect.signature(resolve_card).parameters
                options = {}
                if "actor_id" in parameters:
                    options["actor_id"] = str(event["senderIdentityId"])
                if "extra" in parameters:
                    options["extra"] = getattr(self.adapter.config, "extra", None)
                count = resolve_card(record["session"], choice, request_id=card["id"], **options)
            else:
                count = gateway_approval.resolve_gateway_approval(record["session"], choice, request_id=card["id"])
            if count == 1:
                await self._settle(record, "denied" if choice == "deny" else "approved", choice)
            elif not still_pending():
                await self._settle(record, "closed")

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
