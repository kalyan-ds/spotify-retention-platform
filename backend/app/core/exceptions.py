from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError
from loguru import logger
from app.schemas.responses import ErrorResponse

async def http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    status_code = getattr(exc, "status_code", 500)
    detail = getattr(exc, "detail", str(exc))
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(
            error_code=f"HTTP_{status_code}",
            message=str(detail),
            request_id=request_id
        ).model_dump()
    )

async def validation_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    raw_errors = getattr(exc, "errors", lambda: [])()
    errors = [
        {"loc": [str(l) for l in err["loc"]], "msg": err["msg"], "type": err["type"]}
        for err in raw_errors
    ] if callable(getattr(exc, "errors", None)) else []
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error_code="VALIDATION_ERROR",
            message="Request validation failed",
            details=errors,
            request_id=request_id
        ).model_dump()
    )

async def sqlalchemy_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    logger.error(f"Database Error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error_code="DATABASE_ERROR",
            message="An internal database error occurred.",
            request_id=request_id
        ).model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    logger.exception("Unhandled Server Exception")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error_code="INTERNAL_SERVER_ERROR",
            message="An unexpected error occurred.",
            request_id=request_id
        ).model_dump()
    )
