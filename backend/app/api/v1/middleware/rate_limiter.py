import time
from typing import Dict, Tuple
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class AIRateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Per-User & Per-IP Rate Limiting middleware with burst protection.
    Returns 429 Too Many Requests when request rate threshold is exceeded.
    """
    def __init__(self, app, max_requests_per_minute: int = 120):
        super().__init__(app)
        self.max_requests = max_requests_per_minute
        # Key -> (count, window_start_timestamp)
        self._ip_buckets: Dict[str, Tuple[int, float]] = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()

        if client_ip in self._ip_buckets:
            count, window_start = self._ip_buckets[client_ip]
            if now - window_start < 60.0:
                if count >= self.max_requests:
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={
                            "detail": "Rate limit exceeded. Maximum 120 requests per minute allowed.",
                            "retry_after_seconds": round(60.0 - (now - window_start), 1)
                        }
                    )
                self._ip_buckets[client_ip] = (count + 1, window_start)
            else:
                self._ip_buckets[client_ip] = (1, now)
        else:
            self._ip_buckets[client_ip] = (1, now)

        return await call_next(request)
