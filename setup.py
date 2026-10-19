"""Interactive QR pairing and passive, profile-local configuration checks."""
import json
import inspect
import os
import shutil
import subprocess
from pathlib import Path

from hermes_constants import get_hermes_home
from .accounts import legacy_path, new_pairing_path, pairings, read_pairing


def identity_path():
    return legacy_path(get_hermes_home())


def _paired_session():
    sessions = pairings(get_hermes_home())
    return sessions[0][1] if sessions else None


def is_configured(_config=None):
    """Passive local configuration check, not a network connection assertion."""
    return _paired_session() is not None


def _explicit_platform_config():
    """Use Hermes' profile-aware reader without recursively loading the gateway."""
    from hermes_cli.config import load_config_readonly
    from gateway.config_loader import merge_platform_sections

    config = load_config_readonly()
    if not isinstance(config, dict):
        raise ValueError("Invalid Hermes configuration")
    legacy = Path(get_hermes_home()) / "gateway.json"
    try:
        with legacy.open(encoding="utf-8-sig") as handle:
            data = json.load(handle)
    except FileNotFoundError:
        data = {}
    if not isinstance(data, dict):
        raise ValueError("Invalid legacy gateway configuration")
    # Match Hermes' precedence; do not invent a competing config schema or write
    # the derived target into config.yaml. In-memory seed values are sufficient.
    merge_options = {"also": frozenset({"heming"})} if "also" in inspect.signature(merge_platform_sections).parameters else {}
    # 0.21.1 has the three-argument merger; the registered dynamic platform is
    # already discoverable there. 0.22.2 additionally accepts explicit names.
    platforms = merge_platform_sections(config, config.get("gateway"), data, **merge_options)
    return platforms.get("heming") or {}


def environment_defaults():
    """Seed the already bound private chat, preserving explicit operator settings."""
    session = _paired_session()
    if session is None:
        return None
    try:
        configured = _explicit_platform_config()
        if "home_channel" in configured:
            return None
        if "enabled" in configured and str(configured["enabled"]).strip().lower() not in {"true", "yes", "on", "1"}:
            return None
    except (ImportError, OSError, ValueError, TypeError, AttributeError):
        # A missing/unsupported config reader must not overwrite an operator's
        # target, and a malformed config must not turn into default enablement.
        return None
    return {"home_channel": {"chat_id": session["conversationId"], "name": "和鸣个人助手"}}


def _pairing_in_use(path):
    """Do not disturb a live connector; stale locks remain the store's concern."""
    try:
        pid = int(path.with_name(path.name + ".lock").read_text(encoding="utf-8").strip())
        if pid <= 0:
            return True
        os.kill(pid, 0)
        return True
    except FileNotFoundError:
        return False
    except ProcessLookupError:
        return False
    except (OSError, ValueError, UnicodeError):
        return True


def interactive_setup():
    """Hermes setup_fn contract: synchronous, no arguments, terminal IO inherited."""
    print("\n和鸣 · 扫码连接")
    node = shutil.which("node")
    connector = Path(__file__).with_name("connector.mjs")
    if not node or not connector.is_file():
        print("未找到 Node.js 或和鸣连接器，请检查插件安装及 Gateway 的 PATH。")
        return
    state = identity_path()
    if is_configured():
        # Selecting this platform again adds a member, never overwrites a live
        # identity or requires every team member to stop the shared Gateway.
        state = new_pairing_path(get_hermes_home())
        print("新增独立连接；已有机器人的身份、聊天和任务保持不变。")
    if _pairing_in_use(state):
        print("当前 profile 的和鸣连接器正在使用配对文件，请先停止对应 Gateway 后重试。")
        return
    print("请用和鸣“消息 → ＋ → 扫一扫”扫描二维码，输入机器人名字并创建。")
    try:
        result = subprocess.run(
            [node, str(connector), "pair", "--provider", "Hermes", "--state", str(state)],
            check=False, timeout=660,
        )
    except KeyboardInterrupt:
        print("\n已取消配对，未删除已有身份。")
        return
    except subprocess.TimeoutExpired:
        print("配对等待已超时，请重新选择和鸣后扫码。")
        return
    except OSError:
        print("连接器未能启动，请检查 Node.js 和插件文件。")
        return
    if result.returncode != 0 or read_pairing(get_hermes_home(), state) is None:
        print("本次配对未完成，请检查网络或 Gateway 是否正在使用当前 profile 后重试。")
        return
    print("和鸣扫码配对完成。运行中的 Gateway 会自动加载新连接；尚未启动时请启动 Gateway。")
