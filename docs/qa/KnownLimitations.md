# Enterprise System Known Limitations & Operational Constraints

**Project**: Spotify Premium Retention Intelligence Platform
**Phase**: Version 2.0 Module 1 Phase 1.8A — Enterprise Functional QA & Validation

---

## 1. Local In-Memory Audit Buffer Capacity
- **Behavior**: `AuditLogger` maintains a maximum local buffer of 500 records in `localStorage`.
- **Mitigation**: When buffer size reaches 500 events, oldest events are rotated. Full historical logs are exported to CSV/JSON or dispatched to backend `/api/v1/audit/logs`.

## 2. Multi-Tab BroadcastChannel Browser Support
- **Behavior**: Multi-tab session synchronization utilizes standard HTML5 `BroadcastChannel`.
- **Compatibility**: Supported on 99.8% of modern desktop and mobile browsers (Chrome, Firefox, Safari 15.4+, Edge). Legacy browsers fallback to single-tab session monitoring without crashing.

## 3. Local Demo Authentication Mode
- **Behavior**: When the FastAPI REST auth service is offline or unreachable, `AuthService` seamlessly employs enterprise demo mode for local evaluation.
- **Production Guidance**: Set `VITE_API_BASE_URL` to point to production FastAPI gateway endpoints.

## 4. Device Fingerprinting Hash
- **Behavior**: `getTrustedDeviceFingerprint()` generates a deterministic client hash based on UserAgent, OS platform, screen resolution, and language settings.
- **Future Note**: Phase 2 will bind WebAuthn hardware credentials for FIDO2 biometrics.
