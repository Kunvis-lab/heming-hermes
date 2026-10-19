"""Read only this paired chat's native Hermes cron and background processes."""
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path


def iso(value=None):
    return (value or datetime.now(timezone.utc)).isoformat()


def runtime_timezone_name():
    from hermes_time import get_timezone
    configured = get_timezone()
    if configured is not None:
        return str(configured)
    # Hermes explicitly uses server-local time when no profile zone is set.
    # Recover the system IANA name without changing any configuration.
    local = str(Path("/etc/localtime").resolve())
    if "/zoneinfo/" in local:
        return local.split("/zoneinfo/", 1)[1]
    return str(datetime.now().astimezone().tzinfo)


def revision(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, default=str).encode()).hexdigest()


def owns(job, session):
    origin = job.get("origin") or {}
    return (origin.get("platform") == "heming" and str(origin.get("chat_id")) == str(session["conversationId"])
            and str(origin.get("user_id") or session["ownerIdentityId"]) == str(session["ownerIdentityId"]))


def executing(execution):
    return (execution or {}).get("status", (execution or {}).get("state")) in ("claimed", "handoff_pending", "running")


def definition_for(job, definitions):
    if job["id"] in definitions:
        return definitions[job["id"]]
    base = {"title": str(job.get("name") or "未命名任务")[:80], "prompt": str(job.get("prompt") or "")[:8000]}
    if not base["prompt"] or job.get("script") or job.get("no_agent"):
        return None  # Never turn a native script into a model prompt when editing.
    schedule = job.get("schedule") or {}
    if schedule.get("kind") == "once" and schedule.get("run_at"):
        return {**base, "kind": "once", "at": schedule["run_at"]}
    if schedule.get("kind") == "interval" and schedule.get("minutes"):
        return {**base, "kind": "recurring", "repeat": "interval", "minutes": int(schedule["minutes"])}
    parts = str(schedule.get("expr") or schedule.get("expression") or "").split()
    if len(parts) == 5 and parts[0].isdigit() and parts[1].isdigit() and parts[2:4] == ["*", "*"]:
        if parts[4] == "*" or parts[4] in list("0123456"):
            return {**base, "kind": "recurring", "repeat": "daily" if parts[4] == "*" else "weekly",
                    "time": f"{int(parts[1]):02}:{int(parts[0]):02}", **({"weekday": int(parts[4])} if parts[4] != "*" else {})}
    return None


def cron_record(job, definitions):
    execution = job.get("latest_execution") or {}
    running = executing(execution) or bool(job.get("run_claim") or job.get("fire_claim"))
    raw = job.get("state", "scheduled")
    status = ("running" if running else "completed" if raw == "completed" else "paused" if raw == "paused" else
              "failed" if raw == "error" or job.get("last_status") in ("error", "failed") else
              "paused" if not job.get("enabled", True) else "scheduled")
    if job.get("last_status") == "interrupted" and not running:
        status = "interrupted"
    definition = definition_for(job, definitions) or {}
    kind = definition.get("kind") or ("once" if job.get("schedule", {}).get("kind") == "once" else "recurring")
    operations = ["detail", "cancel"]
    if not running:
        if definition and status not in ("completed", "failed", "interrupted"):
            operations.append("update")
        if status == "paused":
            operations.append("resume")
        elif status == "scheduled":
            operations += ["pause", "run"]
        elif status in ("failed", "interrupted", "completed") and definition:
            operations.append("retry")
    elif kind == "recurring" and job.get("enabled", True):
        operations.append("pause")
    label = str(job.get("schedule_display") or "")[:200]
    if definition:
        if kind == "background":
            label = "立即后台处理"
        elif kind == "once":
            label = "指定时间执行一次"
        elif definition.get("repeat") == "interval":
            label = f"每 {definition['minutes']} 分钟"
        elif definition.get("repeat") == "daily":
            label = "每天 " + definition["time"]
        elif definition.get("repeat") == "weekly":
            label = "每周" + "日一二三四五六"[definition["weekday"]] + " " + definition["time"]
    return {"id": "cron:" + job["id"], "title": str(job.get("name") or "未命名任务")[:200],
            "kind": kind, "state": status, "revision": revision({key: job.get(key) for key in
                ("id", "name", "prompt", "schedule", "enabled", "state", "next_run_at", "last_run_at", "fire_claim", "run_claim")}),
            "scheduleLabel": label, "nextRunAt": None if status in ("paused", "completed", "cancelled") or running and kind != "recurring" else job.get("next_run_at"),
            "lastRunAt": job.get("last_run_at"), "createdAt": job.get("created_at"), "actions": operations,
            "error": str(job.get("last_error") or job.get("last_delivery_error") or "")[:1000]}


def process_records(registry, session_key):
    if not session_key:
        return []
    result = []
    for entry in registry.list_sessions(session_key=session_key, include_retained=True):
        native = registry.get(entry["session_id"])
        if native is None or native.session_key != session_key:
            continue
        status = "running" if not native.exited else "cancelled" if native.completion_reason == "killed" else "interrupted" if native.completion_reason == "lost" else "completed" if native.exit_code == 0 else "failed"
        record = {"id": "process:" + native.id, "title": str(entry.get("command") or "后台任务")[:200],
                  "kind": "background", "state": status, "revision": revision([native.id, native.exited, native.exit_code, native.completion_reason]),
                  "scheduleLabel": "后台持续运行", "nextRunAt": None, "lastRunAt": iso(datetime.fromtimestamp(native.started_at, timezone.utc)),
                  "createdAt": iso(datetime.fromtimestamp(native.started_at, timezone.utc)),
                  "actions": ["detail"] + (["cancel"] if not native.exited else []), "error": ""}
        result.append(record)
    return result


def read_outputs(home, job_id):
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,80}", job_id):
        raise ValueError("TASK_NOT_FOUND")
    root = Path(home) / "cron" / "output"
    folder = root / job_id
    if folder.is_symlink() or folder.resolve().parent != root.resolve():
        raise ValueError("TASK_RESULT_UNSAFE")
    if not folder.exists():
        return [], False
    files = [p for p in sorted(folder.glob("*.md"), reverse=True) if p.is_file() and not p.is_symlink()][:3]
    entries, truncated = [], False
    for file in files:
        with file.open() as handle:
            text = handle.read(65537)
        clipped = len(text) > 65536
        # Hermes persists an operational document, not just the answer. Never
        # expose its prepended system instructions, prompt or runtime headers.
        if text.startswith("# Cron Job:"):
            if f"**Job ID:** {job_id}\n" not in text:
                text = ""
            elif "\n## Response\n\n" in text:
                text = text.split("\n## Response\n\n", 1)[1]
            elif "**Mode:** no_agent" in text and "**Status:**" in text:
                text = text.split("**Status:**", 1)[1].partition("\n\n")[2]
            else:
                text = ""  # Unknown native format is not permission to show internals.
        raw = text.encode("utf-16-le")
        clipped |= len(raw) > 48000
        text = raw[:48000].decode("utf-16-le", errors="ignore")
        truncated |= clipped
        entries.append({"at": file.stem, "result": text.strip()})
    return entries, truncated
