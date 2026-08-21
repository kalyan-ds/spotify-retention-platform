import pytest
from unittest.mock import patch
from pydantic import TypeAdapter, AnyHttpUrl
from httpx import AsyncClient, ASGITransport
from app.core.config import settings
from main import create_app

@pytest.mark.asyncio
async def test_production_cors_preflight_normalization():
    """
    Verify that browser Origin headers without trailing slash (e.g. https://spotify-retention-platform.vercel.app)
    are correctly matched and permitted by CORSMiddleware when BACKEND_CORS_ORIGINS contains AnyHttpUrl instances.
    """
    url_adapter = TypeAdapter(list[AnyHttpUrl])
    mock_origins = url_adapter.validate_python([
        "http://localhost:5173",
        "https://spotify-retention-platform.vercel.app"
    ])

    with patch.object(settings, "BACKEND_CORS_ORIGINS", mock_origins):
        # Verify cors_origins strips trailing slashes
        assert "https://spotify-retention-platform.vercel.app" in settings.cors_origins
        assert "http://localhost:5173" in settings.cors_origins
        assert not any(o.endswith("/") for o in settings.cors_origins)

        app = create_app()

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # 1. Preflight OPTIONS request for production Vercel frontend origin
            prod_origin = "https://spotify-retention-platform.vercel.app"
            response = await client.options(
                "/api/v1/dashboard/summary",
                headers={
                    "Origin": prod_origin,
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "authorization,content-type",
                }
            )

            assert response.status_code == 200, f"Expected 200 on preflight, got {response.status_code}: {response.text}"
            assert response.headers.get("access-control-allow-origin") == prod_origin
            assert response.headers.get("access-control-allow-credentials") == "true"
            assert "authorization" in response.headers.get("access-control-allow-headers", "").lower()

            # 2. Preflight OPTIONS request for local development origin
            local_origin = "http://localhost:5173"
            local_response = await client.options(
                "/api/v1/dashboard/summary",
                headers={
                    "Origin": local_origin,
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "authorization,content-type",
                }
            )

            assert local_response.status_code == 200
            assert local_response.headers.get("access-control-allow-origin") == local_origin
            assert local_response.headers.get("access-control-allow-credentials") == "true"
