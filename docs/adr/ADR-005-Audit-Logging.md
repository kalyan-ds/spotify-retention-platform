# ADR-005: Audit Telemetry Logging Pipeline

## Context & Problem Statement
Compliance standards require immutable, correlation-traced audit logging for security events, authentication events, and administrative actions.

## Decision Outcome
**Chosen Strategy**: Standardized `AuditLogger` service recording structured JSON event schemas with auto-generated correlation IDs (`CORR-...`), in-memory rotation buffer, and CSV/JSON export capability.
