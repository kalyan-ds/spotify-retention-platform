from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user, RequireRole, get_request_id, get_processing_time_ms
from app.models.auth import User
from app.schemas.responses import StandardResponse, Pagination, ErrorResponse
from app.schemas.subscription import SubscriptionResponse, SubscriptionCreate, SubscriptionUpdate
from app.schemas.common import PaginationParams
from app.services.subscription import SubscriptionService

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
    response_model=StandardResponse[List[SubscriptionResponse]],
    summary="List subscriptions",
    description="Retrieve a paginated list of subscriptions. Filter by user_id or status. Requires Admin role.",
    operation_id="list_subscriptions",
    responses=common_responses,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def list_subscriptions(
    request: Request,
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    sub_status: Optional[str] = Query(None, alias="status", description="Filter by subscription status"),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    req_id: str = Depends(get_request_id)
):
    skip = (pagination.page - 1) * pagination.page_size

    subs, total = await SubscriptionService.get_subscriptions(
        db, skip=skip, limit=pagination.page_size, user_id=user_id, status_filter=sub_status
    )

    total_pages = (total + pagination.page_size - 1) // pagination.page_size

    return StandardResponse(
        success=True,
        data=subs,
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
    "/{subscription_id}",
    response_model=StandardResponse[SubscriptionResponse],
    summary="Get subscription by ID",
    description="Retrieve a specific subscription. Accessible by the owner or Admin.",
    operation_id="get_subscription_by_id",
    responses=common_responses
)
async def get_subscription(
    request: Request,
    subscription_id: int = Path(..., description="ID of the subscription"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    sub = await SubscriptionService.get_subscription_by_id(db, subscription_id)
    return StandardResponse(
        success=True,
        data=sub,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.post(
    "/",
    response_model=StandardResponse[SubscriptionResponse],
    summary="Create subscription",
    description="Create a new subscription for the authenticated user.",
    operation_id="create_subscription",
    responses=conflict_response
)
async def create_subscription(
    request: Request,
    sub_in: SubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    sub = await SubscriptionService.create_subscription(db, current_user.id, sub_in)
    return StandardResponse(
        success=True,
        data=sub,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.patch(
    "/{subscription_id}",
    response_model=StandardResponse[SubscriptionResponse],
    summary="Update subscription",
    description="Update subscription status or auto-renew. Requires Optimistic Concurrency Control version match. Requires Admin role.",
    operation_id="update_subscription",
    responses=conflict_response,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def update_subscription(
    request: Request,
    sub_in: SubscriptionUpdate,
    subscription_id: int = Path(..., description="ID of the subscription to update"),
    db: AsyncSession = Depends(get_db),
    req_id: str = Depends(get_request_id)
):
    sub = await SubscriptionService.update_subscription(db, subscription_id, sub_in)
    return StandardResponse(
        success=True,
        data=sub,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.delete(
    "/{subscription_id}",
    response_model=StandardResponse[SubscriptionResponse],
    summary="Delete subscription",
    description="Soft delete a subscription record. Requires Admin role.",
    operation_id="delete_subscription",
    responses=common_responses,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def delete_subscription(
    request: Request,
    subscription_id: int = Path(..., description="ID of the subscription to delete"),
    db: AsyncSession = Depends(get_db),
    req_id: str = Depends(get_request_id)
):
    sub = await SubscriptionService.delete_subscription(db, subscription_id)
    return StandardResponse(
        success=True,
        data=sub,
        message="Subscription deleted successfully",
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )
