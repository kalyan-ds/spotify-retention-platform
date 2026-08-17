from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user, RequireRole, get_request_id, get_processing_time_ms
from app.models.auth import User
from app.schemas.responses import StandardResponse, Pagination, ErrorResponse
from app.schemas.user import UserResponse, UserProfileResponse, UserUpdate
from app.schemas.common import PaginationParams, SortingParams, SearchParams
from app.services.user import UserService

router = APIRouter()

common_responses = {
    status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse, "description": "Unauthorized"},
    status.HTTP_403_FORBIDDEN: {"model": ErrorResponse, "description": "Forbidden"},
    status.HTTP_404_NOT_FOUND: {"model": ErrorResponse, "description": "Not Found"},
    status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Validation Error"},
    status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse, "description": "Internal Server Error"},
}
conflict_response = {**common_responses, status.HTTP_409_CONFLICT: {"model": ErrorResponse, "description": "Conflict"}}

@router.get(
    "/",
    response_model=StandardResponse[List[UserResponse]],
    summary="List users",
    description="Retrieve a paginated list of users. Requires Admin role.",
    operation_id="list_users",
    responses=common_responses,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def list_users(
    request: Request,
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    sorting: SortingParams = Depends(),
    search: SearchParams = Depends(),
    req_id: str = Depends(get_request_id)
):
    skip = (pagination.page - 1) * pagination.page_size

    users, total = await UserService.get_users(
        db, skip=skip, limit=pagination.page_size,
        search=search.q, sort_by=sorting.sort_by, sort_order=sorting.sort_order
    )

    total_pages = (total + pagination.page_size - 1) // pagination.page_size

    return StandardResponse(
        success=True,
        data=users,
        pagination=Pagination(
            page=pagination.page,
            page_size=pagination.page_size,
            total_items=total,
            total_pages=total_pages,
            has_next=pagination.page < total_pages,
            has_previous=pagination.page > 1
        ),
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.get(
    "/search",
    response_model=StandardResponse[List[UserResponse]],
    summary="Search users",
    description="Search users by email or name. Requires Admin role.",
    operation_id="search_users",
    responses=common_responses,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def search_users(
    request: Request,
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    req_id: str = Depends(get_request_id)
):
    skip = (pagination.page - 1) * pagination.page_size

    users, total = await UserService.get_users(
        db, skip=skip, limit=pagination.page_size, search=q, sort_by=None, sort_order="asc"
    )

    total_pages = (total + pagination.page_size - 1) // pagination.page_size

    return StandardResponse(
        success=True,
        data=users,
        pagination=Pagination(
            page=pagination.page,
            page_size=pagination.page_size,
            total_items=total,
            total_pages=total_pages,
            has_next=pagination.page < total_pages,
            has_previous=pagination.page > 1
        ),
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.get(
    "/me",
    response_model=StandardResponse[UserProfileResponse],
    summary="Get current user profile",
    description="Retrieve the detailed profile of the authenticated user, including preferences and active sessions.",
    operation_id="get_current_user_profile",
    responses=common_responses
)
async def get_current_user_profile(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    req_id: str = Depends(get_request_id)
):
    user = await UserService.get_user_profile(db, current_user.id)
    return StandardResponse(
        success=True,
        data=user,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.get(
    "/{user_id}",
    response_model=StandardResponse[UserProfileResponse],
    summary="Get user by ID",
    description="Retrieve a specific user profile by ID. Requires Admin role.",
    operation_id="get_user_by_id",
    responses=common_responses,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def get_user(
    request: Request,
    user_id: int = Path(...),
    db: AsyncSession = Depends(get_db),
    req_id: str = Depends(get_request_id)
):
    user = await UserService.get_user_profile(db, user_id)
    return StandardResponse(
        success=True,
        data=user,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.patch(
    "/{user_id}",
    response_model=StandardResponse[UserResponse],
    summary="Update user",
    description="Update user information using Optimistic Concurrency Control. Requires version match.",
    operation_id="update_user",
    responses=conflict_response,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def update_user(
    request: Request,
    user_in: UserUpdate,
    user_id: int = Path(...),
    db: AsyncSession = Depends(get_db),
    req_id: str = Depends(get_request_id)
):
    user = await UserService.update_user(db, user_id, user_in)
    return StandardResponse(
        success=True,
        data=user,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.delete(
    "/{user_id}",
    response_model=StandardResponse[UserResponse],
    summary="Delete user (Soft delete)",
    description="Soft delete a user. Requires Admin role.",
    operation_id="delete_user",
    responses=common_responses,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def delete_user(
    request: Request,
    user_id: int = Path(...),
    db: AsyncSession = Depends(get_db),
    req_id: str = Depends(get_request_id)
):
    user = await UserService.delete_user(db, user_id)
    return StandardResponse(
        success=True,
        data=user,
        message="User deleted successfully",
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )
