import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Generate Request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        start_time = time.perf_counter()

        logger.info(f"Incoming request: {request.method} {request.url.path} (Request ID: {request_id})")

        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(f"Request failed: {str(e)} (Request ID: {request_id})")
            raise e

        process_time = time.perf_counter() - start_time
        execution_time_ms = f"{process_time * 1000:.2f}ms"

        # Add headers for observability
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Execution-Time"] = execution_time_ms

        logger.info(f"Request completed: {request.method} {request.url.path} - Status: {response.status_code} - Time: {execution_time_ms} (Request ID: {request_id})")

        return response
