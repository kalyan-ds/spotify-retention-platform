from typing import List
from fastapi import APIRouter, Depends, Path, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user, get_request_id, get_processing_time_ms
from app.models.auth import User
from app.schemas.responses import StandardResponse, Pagination, ErrorResponse
from app.schemas.subscription import PaymentHistoryResponse
from app.schemas.common import PaginationParams
from app.services.payment import PaymentService

router = APIRouter()

common_responses = {
    status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse, "description": "Unauthorized"},
    status.HTTP_403_FORBIDDEN: {"model": ErrorResponse, "description": "Forbidden"},
    status.HTTP_404_NOT_FOUND: {"model": ErrorResponse, "description": "Not Found"},
    status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Validation Error"},
    status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse, "description": "Internal Server Error"},
}

@router.get(
    "/",
    response_model=StandardResponse[List[PaymentHistoryResponse]],
    summary="List payments",
    description="Retrieve a paginated list of payment history for the authenticated user.",
    operation_id="list_payments",
    responses=common_responses
)
async def list_payments(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    pagination: PaginationParams = Depends(),
    req_id: str = Depends(get_request_id)
):
    skip = (pagination.page - 1) * pagination.page_size

    payments, total = await PaymentService.get_payments(
        db, user_id=current_user.id, skip=skip, limit=pagination.page_size
    )

    total_pages = (total + pagination.page_size - 1) // pagination.page_size

    return StandardResponse(
        success=True,
        data=payments,
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
    "/{payment_id}",
    response_model=StandardResponse[PaymentHistoryResponse],
    summary="Get payment details",
    description="Retrieve a specific payment receipt by ID. Must belong to the authenticated user.",
    operation_id="get_payment_by_id",
    responses=common_responses
)
async def get_payment(
    request: Request,
    payment_id: int = Path(..., description="ID of the payment"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    payment = await PaymentService.get_payment_by_id(db, payment_id, current_user.id)
    return StandardResponse(
        success=True,
        data=payment,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )
