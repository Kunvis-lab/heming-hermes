"""Owner-bound encrypted controls around Hermes' native task authorities."""
import asyncio
import copy
from datetime import datetime, timedelta, timezone

from .task_store import TaskStore
from .task_catalog import cron_record, definition_for, executing, iso, owns, process_records, read_outputs, revision, runtime_timezone_name
from .task_families import detailed_record, latest_member, members
from .task_stop import request_stop, reconcile_stops
from .task_execution_history import clipped, execution_history


class ManagedTasks:
    def __init__(self, adapter):
        self.adapter, self.store, self.monitor = adapter, None, None
        self.lock = asyncio.Lock()
        self.subscribed = False
        self.last_digest = None
        self.offset = 0
        self.detail_version = 1

    def _runtime(self):
        from hermes_constants import get_hermes_home
        from cron import jobs
        from tools.process_registry import process_registry
        self.home = get_hermes_home()
        state_path = getattr(self.adapter, "state_path", None)
        self.store = self.store or TaskStore(self.home, path=state_path.with_name("tasks.json") if state_path else None)
        return jobs, process_registry

    def _session_key(self):
        from gateway.platforms.event import MessageEvent, MessageType
        a = self.adapter
        source = a.build_source(chat_id=a._session["conversationId"], chat_type="dm",
                                user_id=str(a._session["ownerIdentityId"]), user_name="和鸣用户")
        return a._event_session_key(MessageEvent(text="", source=source, message_type=MessageType.TEXT, message_id="task-catalog"))

    def _catalog(self):
        jobs, registry = self._runtime()
        native = {job["id"]: job for job in jobs.list_jobs(include_disabled=True) if owns(job, self.adapter._session)}
        if self.detail_version >= 2:
            reconcile_stops(jobs, native, self.store)
            native = {job["id"]: job for job in jobs.list_jobs(include_disabled=True) if owns(job, self.adapter._session)}
            records = [detailed_record(job, native, self.store.data["definitions"], self.store.data.get("stops", {})) for job in native.values()
                       if (job.get("origin") or {}).get("heming_task_parent") not in native]
        else:
            records = [cron_record(job, self.store.data["definitions"]) for job in native.values()]
        records += process_records(registry, self._session_key())
        for job_id, record in self.store.data["cancelled"].items():
            if job_id not in native:
                if record["state"] == "stopping":
                    from cron.executions import latest_execution
                    pending_ids = record.get("_pendingExecutions")
                    if pending_ids:
                        from cron.executions import get_execution
                    waiting = any(executing(get_execution(id)) for id in pending_ids) if pending_ids else executing(latest_execution(job_id))
                    if not waiting:
                        record["state"] = "cancelled"
                        if self.detail_version >= 2:
                            record["runState"] = "stopped"
                        record["revision"] = revision({**record, "revision": ""})
                        archived = self.store.data.get("cancelledDetails", {}).get(job_id)
                        if archived and self.detail_version >= 2:
                            archived["job"] = record
                            for entry in archived.get("executions", []):
                                if entry["id"] in (pending_ids or []):
                                    terminal = get_execution(entry["id"]) or {}
                                    entry.update(state="stopped", finishedAt=terminal.get("finished_at"), error="")
                        self.store.save()
                records.append(record)
        records.sort(key=lambda r: (r["state"] in ("running", "stopping", "scheduled", "paused"), r["createdAt"] or ""), reverse=True)
        return native, records

    async def publish(self, reply=None):
        import json
        _, records = self._catalog()
        digest = json.dumps([self.offset, records], sort_keys=True)
        if not reply and digest == self.last_digest:
            return
        self.store.data["revision"] += 1
        self.store.save()
        snapshot = {"version": 1, "kind": "snapshot", "ownerIdentityId": str(self.adapter._session["ownerIdentityId"]),
                    "revision": self.store.data["revision"], "generatedAt": iso(), "timeZone": runtime_timezone_name(),
                    "total": len(records), "offset": min(self.offset, max(0, (len(records) - 1) // 20 * 20)), "jobs": []}
        self.offset = snapshot["offset"]
        snapshot["jobs"] = records[self.offset:self.offset + 20]
        if reply:
            snapshot["reply"] = reply
        await self.adapter._bridge_send({"type": "managed-tasks", "snapshot": snapshot})
        self.last_digest = digest

    async def handle(self, request):
        a = self.adapter
        if not a._session or request.get("conversationId") != a._session["conversationId"] or str(request.get("senderIdentityId")) != str(a._session["ownerIdentityId"]):
            return
        async with self.lock:
            self.subscribed = True
            self.detail_version = 2 if request.get("detailVersion") == 2 else 1
            self.monitor = self.monitor or asyncio.create_task(self._monitor())
            reply = {"requestId": request["requestId"], "ok": False}
            try:
                jobs, registry = self._runtime()
                fingerprint = revision({key: value for key, value in request.items() if key not in ("requestId",)})
                old = self.store.data["operations"].get(request["requestId"])
                if old:
                    if old.get("fingerprint") and old["fingerprint"] != fingerprint:
                        raise ValueError("TASK_REQUEST_MISMATCH")
                    reply = old if old.get("ok") is not None else {**reply, "error": "TASK_OUTCOME_UNKNOWN"}
                    if old.get("ok") is None and request["action"] in ("create", "run", "retry"):
                        native, _ = self._catalog()
                        recovered = next((job for job in native.values() if job.get("origin", {}).get("heming_request_id") == request["requestId"]), None)
                        if recovered:
                            if request["action"] == "create":
                                self.store.data["definitions"][recovered["id"]] = request["definition"]
                            parent = (recovered.get("origin") or {}).get("heming_task_parent")
                            reply = {"requestId": request["requestId"], "ok": True, "jobId": "cron:" + (parent if parent in native else recovered["id"])}
                            self.store.remember(request["requestId"], {**reply, "fingerprint": fingerprint})
                else:
                    native, records = self._catalog()
                    record = next((r for r in records if r["id"] == request.get("jobId")), None)
                    action = request["action"]
                    if action not in ("list", "create") and not record:
                        raise ValueError("TASK_NOT_FOUND")
                    if action not in ("list", "create", "detail"):
                        if request.get("revision") != record["revision"]:
                            raise ValueError("TASK_CHANGED")
                        if not (action == "stop" and record.get("canStopCurrent")) and action not in record["actions"]:
                            raise ValueError("TASK_ACTION_UNAVAILABLE")
                    if action not in ("list", "detail"):
                        self.store.remember(request["requestId"], {"ok": None, "fingerprint": fingerprint})
                    reply.update(self._perform(request, record, native, jobs, registry), ok=True)
                    if action not in ("list", "detail"):
                        self.store.remember(request["requestId"], {**copy.deepcopy(reply), "fingerprint": fingerprint})
            except ValueError as error:
                code = str(error)
                reply["error"] = code if code.startswith("TASK_") else "TASK_INVALID_INPUT"
            except Exception:
                reply["error"] = "TASK_RUNTIME_ERROR"
            await self.publish(reply)

    def _perform(self, request, record, native, jobs, registry):
        action = request["action"]
        if action == "list":
            self.offset = request.get("offset", self.offset)
            return {}
        if action in ("run", "retry") and self.detail_version >= 2:
            job = native[record["id"].split(":", 1)[1]]
            definition = definition_for(job, self.store.data["definitions"])
            if not definition or len(native) >= 80:
                raise ValueError("TASK_ACTION_UNAVAILABLE" if not definition else "TASK_LIMIT")
            if definition["kind"] == "once" and action == "run" and not job.get("latest_execution"):
                jobs.trigger_job(job["id"])
                return {"jobId": record["id"]}
            origin = {"platform": "heming", "chat_id": self.adapter._session["conversationId"],
                      "user_id": str(self.adapter._session["ownerIdentityId"]), "heming_request_id": request["requestId"], "heming_task_parent": job["id"]}
            existing = next((j for j in native.values() if (j.get("origin") or {}).get("heming_request_id") == request["requestId"]), None)
            occurrence = existing or jobs.create_job(prompt=definition["prompt"], name=definition["title"],
                schedule=self._schedule({"kind": "background"}), origin=origin, deliver="origin")
            self.store.data["definitions"][occurrence["id"]] = {**definition, "kind": "background"}
            self.store.save()
            return {"jobId": record["id"]}
        if action in ("create", "retry"):
            if len(native) >= 80:
                raise ValueError("TASK_LIMIT")
            definition = request["definition"] if action == "create" else definition_for(native[record["id"].split(":", 1)[1]], self.store.data["definitions"])
            if action == "retry":
                definition = {**definition, "kind": "background"}  # Explicit new occurrence; old history is never overwritten.
            origin = {"platform": "heming", "chat_id": self.adapter._session["conversationId"],
                      "user_id": str(self.adapter._session["ownerIdentityId"]), "heming_request_id": request["requestId"]}
            # A crashed create can be recovered by its durable native origin marker.
            existing = next((j for j in native.values() if j.get("origin", {}).get("heming_request_id") == request["requestId"]), None)
            job = existing or jobs.create_job(prompt=definition["prompt"], name=definition["title"],
                    schedule=self._schedule(definition), origin=origin, deliver="origin")
            self.store.data["definitions"][job["id"]] = definition
            self.store.save()
            self.offset = 0
            return {"jobId": "cron:" + job["id"]}
        native_id = record["id"].split(":", 1)[1]
        if record["id"].startswith("process:"):
            process = registry.get(native_id)
            if process is None or process.session_key != self._session_key():
                raise ValueError("TASK_NOT_FOUND")
            if action == "cancel":
                registry.kill_process(native_id, source="heming.owner.cancel", consume_output=False)
                return {"jobId": record["id"]}
            if action != "detail":
                raise ValueError("TASK_ACTION_UNAVAILABLE")
            output = process.output_buffer or ""
            if self.detail_version >= 2:
                body = output.encode("utf-16-le")[-32000:].decode("utf-16-le", errors="ignore")
                state = {"cancelled": "stopped", "scheduled": "queued"}.get(record["state"], record["state"])
                return {"detail": {"jobId": record["id"], "job": record, "prompt": str(process.command)[:8000], "result": body,
                    "truncated": body != output, "history": [], "executions": [{"id": record["id"], "at": record["lastRunAt"], "state": state, "result": body}]}}
            return {"detail": {"jobId": record["id"], "prompt": str(process.command)[:8000], "result": output[-32000:],
                    "truncated": len(output) > 32000, "history": []}}
        job = native.get(native_id)
        if action == "stop":
            request_stop(jobs, latest_member(members(native, native_id)), self.store, request["requestId"])
            return {"jobId": record["id"]}
        if action == "detail":
            archived = self.store.data.get("cancelledDetails", {}).get(native_id)
            if archived:
                return {"detail": archived}
            if self.detail_version >= 2 and job:
                entries, truncated = execution_history(self.home, members(native, native_id), self.store.data.get("stops", {}), self.store.data.get("stoppedExecutions", {}))
                latest_result = next((entry for entry in entries if entry.get("result")), {})
                return {"detail": {"jobId": record["id"], "job": record, "prompt": str(job.get("prompt") or "")[:8000],
                    "definition": definition_for(job, self.store.data["definitions"]), "result": latest_result.get("result", ""),
                    "resultAt": latest_result.get("at"), "truncated": truncated, "history": [], "executions": entries}}
            outputs, truncated = read_outputs(self.home, native_id)
            return {"detail": {"jobId": record["id"], "prompt": str((job or {}).get("prompt") or "")[:8000],
                    "definition": definition_for(job, self.store.data["definitions"]) if job else None, "result": outputs[0]["result"] if outputs else "",
                    "truncated": truncated, "history": outputs[1:]}}
        if job is None or not owns(job, self.adapter._session):
            raise ValueError("TASK_NOT_FOUND")
        if action == "pause":
            jobs.pause_job(native_id, reason="Paused by its paired owner in 和鸣")
        elif action == "resume":
            jobs.resume_job(native_id)
        elif action == "run":
            jobs.trigger_job(native_id)
        elif action == "update":
            definition = request["definition"]
            jobs.update_job(native_id, {"name": definition["title"], "prompt": definition["prompt"], "schedule": self._schedule(definition)})
            self.store.data["definitions"][native_id] = definition
            self.store.save()
        elif action == "cancel":
            # Removing the native definition revokes its fire claim; Hermes' own
            # worker cancellation/fencing prevents a late successful delivery.
            family = members(native, native_id) if self.detail_version >= 2 else [job]
            pending_ids = [(j.get("latest_execution") or {}).get("id") for j in family if executing(j.get("latest_execution"))]
            cancelled = {**record, "state": "stopping" if pending_ids or record["state"] == "running" else "cancelled", "nextRunAt": None, "actions": ["detail"]}
            if self.detail_version >= 2:
                cancelled.update(planState="ended", runState="stopping" if pending_ids else "stopped", canStopCurrent=False, _pendingExecutions=pending_ids)
            self.store.data["cancelled"][native_id] = cancelled
            # Native removal deletes its output folder. Retain only the bounded
            # owner-visible result snapshot, never any credential or other chat.
            self.store.data.setdefault("cancelledDetails", {})[native_id] = self._perform({"action": "detail"}, record, native, jobs, registry)["detail"]
            if self.detail_version >= 2:
                self.store.data["cancelledDetails"][native_id]["job"] = cancelled
            self.store.save()
            for member in family:
                jobs.remove_job(member["id"])
        else:
            raise ValueError("TASK_ACTION_UNAVAILABLE")
        return {"jobId": record["id"]}

    @staticmethod
    def _schedule(definition):
        kind = definition.get("kind")
        if kind == "background":
            return iso(datetime.now(timezone.utc) + timedelta(seconds=3))
        if kind == "once":
            at = datetime.fromisoformat(definition["at"].replace("Z", "+00:00"))
            if at <= datetime.now(timezone.utc):
                raise ValueError("TASK_TIME_IN_PAST")
            return at.isoformat()
        if definition["repeat"] == "interval":
            return str(definition["minutes"]) + "m"
        hour, minute = definition["time"].split(":")
        weekday = str(definition["weekday"]) if definition["repeat"] == "weekly" else "*"
        return f"{int(minute)} {int(hour)} * * {weekday}"

    async def _monitor(self):
        try:
            while True:
                await asyncio.sleep(10)
                if self.subscribed and self.adapter._session:
                    async with self.lock:
                        try:
                            await self.publish()
                        except Exception:
                            pass  # The next explicit refresh reports failure; never fabricate success.
        finally:
            self.monitor = None

    def stop(self):
        if self.monitor:
            self.monitor.cancel()
        self.subscribed = False
