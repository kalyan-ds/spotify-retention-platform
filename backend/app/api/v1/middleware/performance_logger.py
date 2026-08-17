import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class AIPerformanceLoggerMiddleware(BaseHTTPMiddleware):
    """
    Performance SLA tracking middleware. Measures endpoint execution against performance targets (<100ms).
    """
    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.time()
        response = await call_next(request)
        elapsed_ms = (time.time() - start) * 1000

        # Inject performance metric headers
        response.headers["X-Performance-Target-MS"] = "100.0"
        response.headers["X-Performance-Status"] = "PASSED" if elapsed_ms < 100.0 else "EXCEEDED"
        return response
