import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from loguru import logger

class AIRequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Structured Logging & Correlation ID middleware for AI Platform REST endpoints.
    """
    async def dispatch(self, request: Request, call_next) -> Response:
        correlation_id = request.headers.get("X-Correlation-ID", f"corr_{uuid.uuid4().hex[:8]}")
        request.state.correlation_id = correlation_id

        start_time = time.time()
        response = await call_next(request)
        duration_ms = (time.time() - start_time) * 1000

        response.headers["X-Correlation-ID"] = correlation_id
        response.headers["X-Response-Time-MS"] = f"{duration_ms:.2f}"

        logger.info(
            f"[AI_API] {request.method} {request.url.path} | Status={response.status_code} | "
            f"Latency={duration_ms:.2f}ms | CorrelationID={correlation_id}"
        )

        return response
