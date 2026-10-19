"""Wire member transports into Hermes' existing authorized session lifecycle."""

# Hermes' runner inspects these native session-keyed maps on the registered
# adapter (shutdown, /stop, resume, debounce). Members share those *indexes*, not
# reply buffers, approval records, credentials, ratchets or task ledgers.
SESSION_INDEXES = (
    "_active_sessions", "_pending_messages", "_requeue_counts", "_pending_text_batches",
    "_pending_text_batch_tasks", "_session_tasks", "_text_debounce", "_background_tasks",
    "_post_delivery_callbacks", "_expected_cancelled_tasks", "_typing_paused", "_status_text",
    "_streaming_tts_completed_turns", "_auto_tts_enabled_chats", "_auto_tts_disabled_chats",
)
RUNNER_SETTINGS = (
    "_message_handler", "_reaction_handler", "_platform_event_handler", "_topic_recovery_fn",
    "_busy_session_handler", "_authorization_check", "_session_store", "_owner_profile",
    "_busy_text_mode", "_busy_text_debounce_seconds", "_busy_text_hard_cap_seconds",
    "_human_delay_range_ms", "_auto_tts_default", "gateway_runner",
)


def wire_member(router, member):
    # Called before connect and on registry refresh; reflects runner reconfiguration
    # without ever approving an unknown user or manufacturing an internal event.
    for name in SESSION_INDEXES + RUNNER_SETTINGS:
        if hasattr(router, name):
            setattr(member, name, getattr(router, name))
