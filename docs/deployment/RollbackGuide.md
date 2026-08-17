# Automated & Manual Rollback Strategy Runbook - Version 2.0 Module 1

**Project**: Spotify Premium Retention Intelligence Platform
**Phase**: Version 2.0 Module 1 Phase 1.8F — Production Build & Deployment Readiness

---

## 1. Automated Rollback Triggers

An automated rollback to the previous stable release is triggered if any of the following occur during deployment:
- `/health/live` probe fails for > 60 seconds.
- Error rate exceeds 1% over a 2-minute sliding window.
- Liveness probe returns non-200 HTTP response.

---

## 2. Manual Rollback Procedure

```bash
# 1. Revert Blue/Green router traffic to previous deployment target
kubectl rollout undo deployment/spotify-retention-frontend

# 2. Verify rollback status
kubectl rollout status deployment/spotify-retention-frontend

# 3. Confirm health probes
curl -f https://retention.spotify.com/health
```
