from fastapi import APIRouter
from app.schemas.responses import StandardResponse

def create_stub_router(name: str) -> APIRouter:
    router = APIRouter()
    @router.get("", response_model=StandardResponse[dict])
    async def get_stub():
        return StandardResponse(data={"endpoint": name, "status": "Not Implemented"})
    return router

dashboard_router = create_stub_router("dashboard")
students_router = create_stub_router("students")
analytics_router = create_stub_router("analytics")
predictions_router = create_stub_router("predictions")
auth_router = create_stub_router("auth")
users_router = create_stub_router("users")
admin_router = create_stub_router("admin")
settings_router = create_stub_router("settings")
