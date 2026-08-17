# ADR-001: JWT Authentication & Automatic Refresh Rotation

## Context & Problem Statement
The enterprise platform requires stateless, secure authentication capable of scaling across microservices while supporting automatic access token rotation without disrupting active user sessions.

## Decision Outcome
**Chosen Strategy**: Dual-token OAuth 2.0 / JWT Architecture (15-minute Access Token, 7-day Refresh Token).
- Access tokens are attached via Axios request interceptors (`Authorization: Bearer <token>`).
- 401 response interceptors trigger automatic token refresh rotation with mutex request queueing.
