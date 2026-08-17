from fastapi import Request, Response
from typing import Optional

class APIVersionManager:
    """
    Manages API Versioning headers, deprecation notices, and route version compatibility.
    """
    API_VERSION_HEADER = "X-API-Version"
    DEPRECATION_HEADER = "X-API-Deprecated"

    @classmethod
    def apply_version_headers(cls, response: Response, version: str = "v1", is_deprecated: bool = False):
        response.headers[cls.API_VERSION_HEADER] = version
        if is_deprecated:
            response.headers[cls.DEPRECATION_HEADER] = "true"

api_version_manager = APIVersionManager()
