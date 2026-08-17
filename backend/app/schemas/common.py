from typing import Optional
from pydantic import BaseModel, Field

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(50, ge=1, le=100, description="Items per page")

class SortingParams(BaseModel):
    sort_by: Optional[str] = Field(None, description="Field to sort by")
    sort_order: str = Field("asc", description="Sort order: asc or desc")

class SearchParams(BaseModel):
    q: Optional[str] = Field(None, description="Search query string")
