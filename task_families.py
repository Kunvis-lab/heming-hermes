"""Group explicit manual occurrences under their owner-bound original task."""
from .task_catalog import cron_record, definition_for, executing, revision


def members(native, root_id):
    if root_id not in native:
        return []
    return [job for job in native.values() if job["id"] == root_id or
            (job.get("origin") or {}).get("heming_task_parent") == root_id]


def latest_member(family):
    def rank(job):
        execution = job.get("latest_execution") or {}
        active = executing(execution) or bool(job.get("fire_claim") or job.get("run_claim"))
        pending_child = bool((job.get("origin") or {}).get("heming_task_parent")) and job.get("enabled", True) and not execution and job.get("state") == "scheduled"
        return (active or pending_child, str(execution.get("claimed_at") or job.get("last_run_at") or job.get("created_at") or ""))
    return max(family, key=rank)


def root_id(job):
    return (job.get("origin") or {}).get("heming_task_parent") or job["id"]


def detailed_record(root, native, definitions, stops):
    record = cron_record(root, definitions)
    family = members(native, root["id"])
    source = latest_member(family)
    source_record = cron_record(source, definitions)
    execution = source.get("latest_execution") or {}
    stop = stops.get(source["id"], {})
    same_stop = stop.get("executionId") == execution.get("id") and bool(execution.get("id"))
    running = executing(execution) or bool(source.get("fire_claim") or source.get("run_claim"))
    queued = bool(source["id"] != root["id"] or source.get("manual_run_at")) and source.get("state") == "scheduled" and not running and not execution
    raw_state = execution.get("status", execution.get("state"))
    run_state = ("stopping" if same_stop and stop.get("state") == "stopping" else
                 "stopped" if same_stop and stop.get("state") == "stopped" else
                 "running" if running else "queued" if queued else
                 {"completed": "completed", "failed": "failed", "unknown": "interrupted"}.get(raw_state))
    if run_state is None and source_record["state"] in ("completed", "failed", "interrupted"):
        run_state = source_record["state"]
    plan = ("none" if record["kind"] == "background" else
            "finished" if record["kind"] == "once" and (execution or record["state"] in ("completed", "failed", "interrupted")) else
            "paused" if not root.get("enabled", True) or root.get("state") == "paused" else "enabled")
    record.update(planState=plan, canStopCurrent=bool(running and run_state == "running" and source.get("fire_claim")),
                  startedAt=execution.get("started_at") or execution.get("claimed_at"))
    if run_state:
        record["runState"] = run_state
    if execution.get("id"):
        record["executionId"] = execution["id"]
    if run_state in ("running", "stopping"):
        record["state"] = run_state
    elif record["kind"] == "recurring":
        record["state"] = "paused" if plan == "paused" else "failed" if run_state in ("failed", "interrupted") else "scheduled"
    elif run_state in ("completed", "failed", "interrupted"):
        record["state"] = run_state
    if run_state in ("failed", "interrupted"):
        record["error"] = str(execution.get("error") or source_record.get("error") or "本次执行未完成。")[:1000]
    if plan == "paused" or plan == "finished":
        record["nextRunAt"] = None
    else:
        record["nextRunAt"] = root.get("next_run_at") if record["kind"] == "recurring" else record["nextRunAt"]
    operations = ["detail"]
    busy = running or queued
    if not (record["kind"] == "once" and run_state == "completed" and not busy):
        operations.append("cancel")
    if record["kind"] == "recurring" and run_state != "stopping":
        operations.append("pause" if plan == "enabled" else "resume")
    if not busy and definition_for(root, definitions):
        if plan in ("enabled", "paused"):
            operations.append("update")
        if not (record["kind"] == "once" and run_state == "completed"):
            operations.append("retry" if run_state in ("failed", "interrupted", "stopped") else "run")
    record["actions"] = operations
    record["revision"] = revision({"root": record["revision"], "members": [(job["id"], cron_record(job, definitions)["revision"], job.get("latest_execution")) for job in family], "stop": stop})
    return record
