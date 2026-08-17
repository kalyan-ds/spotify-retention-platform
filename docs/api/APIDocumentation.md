# Enterprise REST API Specification - Version 2.0

**Base URL**: `/api/v1`
**Authentication**: HTTP Bearer Token (`Authorization: Bearer <JWT_TOKEN>`)

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user and issues JWT Access & Refresh tokens.

#### Request Body
```json
{
  "email": "executive@spotify.com",
  "password": "Password123!",
  "rememberMe": true
}
```

#### Response (`200 OK`)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": "usr-01",
    "name": "Sarah Jenkins",
    "email": "executive@spotify.com",
    "role": "Admin"
  }
}
```

---

### `POST /auth/refresh`
Refreshes an expired access token using a valid refresh token.

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (`200 OK`)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

---

## 2. Audit Telemetry Endpoints

### `GET /audit/logs`
Fetches correlation-traced audit records with search and filter capabilities.

#### Query Parameters
- `search`: Keyword string.
- `category`: `AUTH` | `RBAC` | `AI` | `SESSION` | `SECURITY`.
- `severity`: `INFO` | `WARN` | `SECURITY_ALERT` | `CRITICAL`.

#### Response (`200 OK`)
```json
{
  "total": 42,
  "events": [
    {
      "id": "evt-882",
      "timestamp": "2026-08-03T20:14:00Z",
      "category": "AUTH",
      "action": "USER_LOGIN_SUCCESS",
      "severity": "INFO",
      "userEmail": "executive@spotify.com",
      "correlationId": "CORR-9942A",
      "metadata": { "ip": "192.168.1.1" }
    }
  ]
}
```
