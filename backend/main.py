from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.logging import setup_logging
from app.middleware.logging import RequestLoggingMiddleware
from app.core.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    sqlalchemy_exception_handler,
    global_exception_handler
)

from app.api.v1.health import router as health_router
from app.api.v1.endpoints.auth import router as real_auth_router
from app.api.middleware import SecurityHeadersMiddleware, RequestIDMiddleware
from app.api.v1.stubs import (
    students_router, predictions_router, admin_router, settings_router
)
from app.api.v1.endpoints.analytics import router as analytics_router
from app.api.v1.endpoints.retention import router as retention_router
from app.api.v1.endpoints.engagement import router as engagement_router
from app.api.v1.endpoints.ai import router as ai_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.users import router as users_router
from app.api.v1.endpoints.subscriptions import router as subscriptions_router
from app.api.v1.endpoints.payments import router as payments_router
from app.api.v1.endpoints.roles import router as roles_router
from app.api.v1.endpoints.sessions import router as sessions_router
from app.api.v1.endpoints.artists import router as artists_router
from app.api.v1.endpoints.albums import router as albums_router
from app.api.v1.endpoints.songs import router as songs_router
from app.api.v1.endpoints.genres import router as genres_router
from app.api.v1.endpoints.search import router as search_router
from app.api.v1.endpoints.listening import router as listening_router
from app.api.v1.endpoints.playback import router as playback_router
from app.api.v1.endpoints.playlists import router as playlists_router
from app.api.v1.endpoints.favorites import router as favorites_router
from app.api.v1.endpoints.devices import router as devices_router
from app.api.v1.endpoints.search_history import router as search_history_router

def create_app() -> FastAPI:
    setup_logging()

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Middleware
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestIDMiddleware)

    # Exception Handlers
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # Routers
    app.include_router(health_router, tags=["Health"])

    api_router = APIRouter()

    app.include_router(dashboard_router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard"])
    app.include_router(students_router, prefix=f"{settings.API_V1_STR}/students", tags=["Students"])
    app.include_router(analytics_router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics"])
    app.include_router(retention_router, prefix=f"{settings.API_V1_STR}/retention", tags=["Retention"])
    app.include_router(engagement_router, prefix=f"{settings.API_V1_STR}/engagement", tags=["Engagement"])
    app.include_router(ai_router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Intelligence Engine"])
    app.include_router(predictions_router, prefix=f"{settings.API_V1_STR}/predictions", tags=["Predictions"])
    app.include_router(real_auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
    app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
    app.include_router(subscriptions_router, prefix=f"{settings.API_V1_STR}/subscriptions", tags=["Subscriptions"])
    app.include_router(payments_router, prefix=f"{settings.API_V1_STR}/payments", tags=["Payments"])
    app.include_router(roles_router, prefix=f"{settings.API_V1_STR}/roles", tags=["Roles"])
    app.include_router(sessions_router, prefix=f"{settings.API_V1_STR}/sessions", tags=["Sessions"])
    app.include_router(artists_router, prefix=f"{settings.API_V1_STR}/artists", tags=["Artists"])
    app.include_router(albums_router, prefix=f"{settings.API_V1_STR}/albums", tags=["Albums"])
    app.include_router(songs_router, prefix=f"{settings.API_V1_STR}/songs", tags=["Songs"])
    app.include_router(genres_router, prefix=f"{settings.API_V1_STR}/genres", tags=["Genres"])
    app.include_router(search_router, prefix=f"{settings.API_V1_STR}/search", tags=["Music Search"])
    app.include_router(listening_router, prefix=f"{settings.API_V1_STR}/listening", tags=["Listening Activity"])
    app.include_router(playback_router, prefix=f"{settings.API_V1_STR}/playback", tags=["Playback Events"])
    app.include_router(playlists_router, prefix=f"{settings.API_V1_STR}/playlists", tags=["Playlists"])
    app.include_router(favorites_router, prefix=f"{settings.API_V1_STR}/favorites", tags=["Favorites"])
    app.include_router(devices_router, prefix=f"{settings.API_V1_STR}/devices", tags=["Devices"])
    app.include_router(search_history_router, prefix=f"{settings.API_V1_STR}/search/history", tags=["Search History"])
    app.include_router(admin_router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])
    app.include_router(settings_router, prefix=f"{settings.API_V1_STR}/settings", tags=["Settings"])

    return app

app = create_app()
