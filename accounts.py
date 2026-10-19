"""Profile-local pairing registry. Existing keys and ratchets are never migrated."""
import json
import re
import uuid
from pathlib import Path

MAX_ACCOUNTS = 128


def legacy_path(home):
    return Path(home) / "heming" / "identity.json"


def safe_path(home, path):
    root, path = Path(home) / "heming", Path(path)
    try:
        parts = path.relative_to(root).parts
    except ValueError:
        return False
    if not parts or any(part in (".", "..") for part in parts) or root.is_symlink():
        return False
    current = root
    for part in parts:
        current /= part
        if current.is_symlink():
            return False
    return path.resolve().is_relative_to(root.resolve())


def read_pairing(home, path):
    """Structural validation only; the connector authenticates the actual session."""
    path = Path(path)
    if not safe_path(home, path):
        return None
    try:
        if path.stat().st_size > 16 * 1024 * 1024:
            return None
        state = json.loads(path.read_text(encoding="utf-8"))
        session = state.get("session") if isinstance(state, dict) else None
        if not isinstance(session, dict):
            return None
        identity = session.get("identity")
        if not isinstance(identity, dict):
            return None
        private, public = session.get("privateKey"), identity.get("publicKey")
        valid = (all(_text(session.get(field)) for field in ("token", "deviceId", "conversationId"))
            and all(type(value) is int and value > 0 for value in (session.get("ownerIdentityId"), identity.get("identityId")))
            and _key(private, "OKP", "X25519", ("x", "d"))
            and _key(public, "OKP", "X25519", ("x",)) and private["x"] == public["x"]
            and _key(state.get("proofPrivateKey"), "EC", "P-256", ("x", "y", "d"))
            and _text(state.get("devicePublicKey")))
        return session if valid else None
    except (OSError, ValueError, UnicodeError):
        return None


def _text(value):
    return isinstance(value, str) and bool(value.strip())


def _key(value, kind, curve, fields):
    return isinstance(value, dict) and value.get("kty") == kind and value.get("crv") == curve and all(_text(value.get(field)) for field in fields)


def pairings(home):
    paths = [legacy_path(home)]
    directory = Path(home) / "heming" / "accounts"
    if safe_path(home, directory) and directory.is_dir():
        folders = sorted(path for path in directory.iterdir() if re.fullmatch(r"[a-f0-9]{32}", path.name))
        if len(folders) > 4096:
            raise RuntimeError("HEMING_ACCOUNT_LIMIT")
        paths.extend(folder / "identity.json" for folder in folders)
    result, chats, bots = [], set(), set()
    for path in paths:
        session = read_pairing(home, path)
        if session and session["conversationId"] not in chats and session["identity"]["identityId"] not in bots:
            result.append((path, session))
            chats.add(session["conversationId"])
            bots.add(session["identity"]["identityId"])
            if len(result) > MAX_ACCOUNTS:
                raise RuntimeError("HEMING_ACCOUNT_LIMIT")
    return result


def new_pairing_path(home):
    folder = Path(home) / "heming" / "accounts" / uuid.uuid4().hex
    if not safe_path(home, folder) or len(pairings(home)) >= MAX_ACCOUNTS:
        raise RuntimeError("HEMING_ACCOUNT_PATH_UNAVAILABLE")
    for directory in (folder.parent.parent, folder.parent, folder):
        directory.mkdir(mode=0o700, exist_ok=directory != folder)
    return folder / "identity.json"
