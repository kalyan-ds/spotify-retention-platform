# ADR-006: Session Lifecycle & Multi-Tab Synchronization

## Context & Problem Statement
Sessions must auto-terminate after 15 minutes of inactivity while keeping open browser tabs synchronized across login, token refresh, and logout events.

## Decision Outcome
**Chosen Strategy**: Centralized `SessionManager` class utilizing 5 DOM activity event listeners, 60s background heartbeat, and HTML5 `BroadcastChannel` for cross-tab event messaging.
