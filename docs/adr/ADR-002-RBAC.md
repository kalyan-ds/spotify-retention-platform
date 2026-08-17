# ADR-002: Role-Based Access Control Guards

## Context & Problem Statement
Different enterprise user roles (`Admin`, `Analyst`, `Viewer`) require distinct permission boundaries across executive, AI model, audit, and security dashboards.

## Decision Outcome
**Chosen Strategy**: Route-level `ProtectedRoute` wrappers that evaluate role permissions against target route requirements, displaying a styled 403 Forbidden screen when access is denied.
