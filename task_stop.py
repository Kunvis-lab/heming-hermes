"""Stop one native fire with an owner fence, preserving the automatic plan."""
from .task_catalog import executing, iso


def request_stop(jobs, job, store, request_id):
    from cron.executions import get_execution
    execution = job.get("latest_execution") or {}
    claim = job.get("fire_claim") or {}
    if not execution.get("id") or not claim.get("by") or not executing(execution) or not hasattr(jobs, "fire_claim_fence"):
        raise ValueError("TASK_STOP_UNSUPPORTED")
    # A live replacement lease blocks another fire while the original worker is
    # observing its lost ownership. It does not pause/resume or alter the schedule.
    lease = {"at": iso(), "by": "heming-stop:" + request_id}
    marker = {"executionId": execution["id"], "claim": lease["by"], "state": "stopping"}
    with jobs.fire_claim_fence(job["id"], expected_owner=claim["by"]) as acquired:
        if not acquired or not executing(get_execution(execution["id"])):
            raise ValueError("TASK_CHANGED")
        store.data.setdefault("stops", {})[job["id"]] = marker
        store.save()  # Recoverable intent is durable before native mutation.
        jobs.update_job(job["id"], {"fire_claim": lease})


def reconcile_stops(jobs, native, store):
    from cron.executions import get_execution
    changed = False
    for job_id, marker in store.data.get("stops", {}).items():
        if marker.get("state") != "stopping" or job_id not in native:
            continue
        job = native[job_id]
        if (job.get("fire_claim") or {}).get("by") != marker["claim"]:
            marker["state"] = "superseded"  # Never overwrite a different native owner.
            changed = True
            continue
        execution = get_execution(marker["executionId"])
        if execution is None or executing(execution):
            jobs.heartbeat_fire_claim(job_id, expected_owner=marker["claim"])
            continue  # Missing ledger data is not proof that execution stopped.
        with jobs.fire_claim_fence(job_id, expected_owner=marker["claim"]) as acquired:
            if not acquired:
                continue
            update = {"fire_claim": None, "run_claim": None, "last_run_at": execution.get("finished_at") or iso(), "last_status": "interrupted", "last_error": None}
            if job.get("schedule", {}).get("kind") == "once":
                update.update(enabled=False, state="paused", paused_reason="Stopped by its paired owner")
            native[job_id] = jobs.update_job(job_id, update)
            marker["state"] = "stopped"
            stopped = store.data.setdefault("stoppedExecutions", {})
            stopped[marker["executionId"]] = True
            while len(stopped) > 256:
                stopped.pop(next(iter(stopped)))
            changed = True
    if changed:
        store.save()
