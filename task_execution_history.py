"""Bounded native execution history, never guessed from ordinary chat messages."""
from datetime import datetime
from .task_catalog import read_outputs


def output_time(value):
    from hermes_time import get_timezone
    try:
        parsed, zone = datetime.strptime(value, "%Y-%m-%d_%H-%M-%S"), get_timezone()
        return (parsed.replace(tzinfo=zone) if zone is not None else parsed.astimezone()).isoformat()
    except (TypeError, ValueError):
        return None


def clipped(text, limit=16000):
    return text.encode("utf-16-le")[:limit * 2].decode("utf-16-le", errors="ignore")


def belongs_to_attempt(record, output):
    if record["_jobId"] != output["_jobId"] or record["state"] not in ("completed", "failed") or record["result"]:
        return False
    try:
        saved = datetime.fromisoformat(output["at"])
        started = datetime.fromisoformat(record["at"])
        finished = datetime.fromisoformat(record["finishedAt"])
        return -1 <= (saved - started).total_seconds() and (saved - finished).total_seconds() <= 1
    except (TypeError, ValueError):
        return False


def execution_history(home, family, stops, stopped_executions=None):
    from cron.executions import list_executions
    records, outputs, truncated = [], [], False
    for job in family:
        rows = list_executions(job_id=job["id"], limit=15)
        results, cut = read_outputs(home, job["id"])
        truncated |= cut
        for item in results:
            body = clipped(item["result"])
            truncated |= body != item["result"]
            outputs.append({"id": "output:" + job["id"] + ":" + item["at"], "at": output_time(item["at"]), "state": "unknown", "result": body, "_jobId": job["id"]})
        stop = stops.get(job["id"], {})
        for run in rows:
            state = run.get("status", run.get("state"))
            state = {"claimed": "running", "running": "running", "completed": "completed", "failed": "failed", "unknown": "interrupted"}.get(state, "unknown")
            if stop.get("executionId") == run["id"] and stop.get("state") in ("stopping", "stopped"):
                state = stop["state"]
            if (stopped_executions or {}).get(run["id"]):
                state = "stopped"
            record = {"id": run["id"], "at": run.get("started_at") or run.get("claimed_at"), "finishedAt": run.get("finished_at"), "state": state, "result": "", "error": str(run.get("error") or "")[:1000], "_jobId": job["id"]}
            if record["at"] and record["finishedAt"]:
                try:
                    record["durationMs"] = max(0, round((datetime.fromisoformat(record["finishedAt"]) - datetime.fromisoformat(record["at"])).total_seconds() * 1000))
                except (TypeError, ValueError):
                    pass
            records.append(record)
    # Output is saved before network delivery, so the terminal ledger timestamp
    # may be much later. Match within one unambiguous terminal execution window,
    # never by a nearest timestamp or against a still-running attempt.
    remaining = []
    for output in outputs:
        matches = []
        if output["at"]:
            matches = [record for record in records if belongs_to_attempt(record, output)]
        if len(matches) == 1:
            matches[0]["result"] = output["result"]
        else:
            remaining.append(output)
    records = sorted(records + remaining, key=lambda r: r.get("at") or "", reverse=True)[:15]
    # Three bounded bodies fit together with the legacy result and prompt inside
    # the encrypted control payload's existing limit.
    body_count = 0
    for record in records:
        record.pop("_jobId", None)
        if record["result"]:
            body_count += 1
            if body_count > 3:
                record["result"] = ""
                record["error"] = "较早的正文未随本次同步返回，完整输出保留在智能体主机。"
                truncated = True
    return records, truncated
