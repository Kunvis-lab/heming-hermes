"""Exact-task controls using Hermes' normal owner /stop and clarify resolver."""
import asyncio
import json
import uuid
from datetime import datetime, timedelta, timezone
from gateway.platforms.event import MessageEvent, MessageType


class WorkCards:
    def __init__(self, adapter):
        self.adapter = adapter
        self.records = {}
        self.stopping = set()
        self.lock = asyncio.Lock()

    async def status(self, status, can_stop=False):
        request = self.adapter._request
        if request:
            await self.adapter._bridge_send({"type": "task", "requestId": request["requestId"],
                "update": {"status": status, "canStop": can_stop}})

    async def question(self, chat_id, question, choices, clarify_id, session_key):
        from tools import clarify_gateway as cg
        a = self.adapter
        if not a._request or not a._session or str(chat_id) != a._session["conversationId"]:
            raise RuntimeError("HEMING_TASK_CLOSED")
        with cg._lock:
            entry = cg._entries.get(clarify_id)
            if not entry or entry.session_key != session_key or entry.question != question or entry.event.is_set():
                raise RuntimeError("HEMING_QUESTION_CLOSED")
            multi = bool(entry.multi_select)
        timeout_fn = getattr(cg, "get_clarify_timeout", lambda: 300)
        timeout = float(timeout_fn())
        # The connector itself bounds a task to ten minutes; never offer an
        # indefinitely actionable card after the actual task deadline.
        timeout = min(600, timeout) if timeout > 0 else 600
        card = {"version": 1, "kind": "question", "id": str(clarify_id),
            "requestMessageId": a._request["requestId"], "ownerIdentityId": str(a._session["ownerIdentityId"]),
            "question": str(question), "choices": list(choices or []), "multiSelect": multi,
            "status": "pending", "revision": 0,
            "expiresAt": (datetime.now(timezone.utc) + timedelta(seconds=timeout)).isoformat()}
        if clarify_id in self.records:
            raise RuntimeError("HEMING_QUESTION_DUPLICATE")
        record = self.records[clarify_id] = {"card": card, "session": session_key, "message": None}
        result = await a._bridge_send({"type": "question", "requestId": card["requestMessageId"], "card": card})
        record["message"] = result["messageId"]
        await self.status("waiting", True)
        return record["message"]

    async def retire(self, clarify_id, answer=None):
        record = self.records.get(str(clarify_id))
        if not record or record["card"]["status"] != "pending":
            return
        record["card"] = {**record["card"], "status": "answered" if answer is not None else "closed", "revision": 1}
        if answer is not None:
            record["card"]["answer"] = answer
        await self.adapter._bridge_send({"type": "question", "requestId": record["card"]["requestMessageId"],
            "card": record["card"], "targetMessageId": record["message"]})

    async def handle(self, event):
        async with self.lock:
            a = self.adapter
            request, session = a._request, a._session
            if not request or not session or event.get("requestMessageId") != request["requestId"] or (
                    event.get("conversationId") != session["conversationId"] or
                    str(event.get("senderIdentityId")) != str(session["ownerIdentityId"])):
                return
            if event.get("kind") == "task" and event.get("action") == "stop":
                await self.stop(request["requestId"])
                return
            if event.get("kind") != "question" or event.get("action") != "answer":
                return
            record = self.records.get(str(event.get("interactionId")))
            if not record or record["card"]["status"] != "pending" or record["message"] != event.get("targetMessageId"):
                return
            card = record["card"]
            if card["requestMessageId"] != request["requestId"] or datetime.now(timezone.utc) >= datetime.fromisoformat(card["expiresAt"]):
                await self.retire(card["id"])
                return
            answer = event.get("answer", "")
            if not isinstance(answer, str) or not answer.strip() or len(answer) > 2000:
                return
            if card["multiSelect"] and answer.startswith("["):
                try:
                    values = json.loads(answer)
                    if not isinstance(values, list) or not values or len(set(values)) != len(values) or any(value not in card["choices"] for value in values):
                        return
                except (ValueError, TypeError):
                    return
            from tools import clarify_gateway as cg
            with cg._lock:
                entry = cg._entries.get(card["id"])
                valid = entry and entry.session_key == record["session"] and not entry.event.is_set()
            if not valid:
                await self.retire(card["id"])
                return
            if cg.resolve_gateway_clarify(card["id"], answer):
                # Completion takes this same lock: the resolver wins before the
                # UI says answered, and its ACK precedes the final output.
                await self.retire(card["id"], answer)
                await self.status("working", True)
            else:
                await self.retire(card["id"])

    async def stop(self, request_id, notify=True):
        a = self.adapter
        original = a._request_event
        if not a._request or a._request["requestId"] != request_id:
            return
        if not original:
            await a._approvals.close_request(request_id)
            a._clear_request()
            return
        key = a._event_session_key(original)
        task = a._session_tasks.get(key)
        if not task or task.done():
            if not notify:
                await a._approvals.close_request(request_id)
                a._clear_request()
            return
        self.stopping.add(request_id)
        try:
            if notify:
                await self.status("stopping")
            # This goes through the same authorized command path as a real
            # owner's /stop. Never impersonate an internal/trust-all message.
            event = MessageEvent(text="/stop", message_type=MessageType.TEXT,
                source=original.source, message_id=str(uuid.uuid4()))
            await a.handle_message(event)
            if not task.done():
                await asyncio.wait_for(asyncio.shield(task), 5)
            if notify:
                await a._write({"type": "stopped", "requestId": request_id})
        except asyncio.CancelledError:
            if notify and task.done():
                await a._write({"type": "stopped", "requestId": request_id})
            else:
                raise
        except Exception:
            if notify:
                await a._write({"type": "failed", "requestId": request_id})
        finally:
            self.stopping.discard(request_id)
            await a._approvals.close_request(request_id)
            if a._request and a._request["requestId"] == request_id:
                a._clear_request()

    def reset(self):
        self.records.clear()
        self.stopping.clear()
