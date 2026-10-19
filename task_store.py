"""Small private ledger for operation deduplication, not a second scheduler."""
import json
import os
import tempfile
from pathlib import Path
from .accounts import safe_path


class TaskStore:
    def __init__(self, home, *, path=None):
        self.home = home
        self.path = Path(path) if path else Path(home) / "heming" / "tasks.json"
        if not safe_path(home, self.path):
            raise RuntimeError("TASK_STORE_UNSAFE")
        self.data = json.loads(self.path.read_text()) if self.path.exists() else {"revision": 0, "operations": {}, "definitions": {}, "cancelled": {}}

    def save(self):
        self.path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
        if not safe_path(self.home, self.path):
            raise RuntimeError("TASK_STORE_UNSAFE")
        fd, name = tempfile.mkstemp(prefix=".tasks-", dir=self.path.parent)
        try:
            with os.fdopen(fd, "w") as handle:
                json.dump(self.data, handle, ensure_ascii=False)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(name, self.path)
        finally:
            if os.path.exists(name):
                os.unlink(name)

    def remember(self, key, value):
        operations = self.data["operations"]
        operations[key] = value
        while len(operations) > 256:
            operations.pop(next(iter(operations)))
        self.save()
