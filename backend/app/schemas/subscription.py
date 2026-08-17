from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime

class SubscriptionPlanResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    currency: str
    billing_cycle: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class SubscriptionBase(BaseModel):
    plan_id: int
    status: str
    start_date: date
    end_date: Optional[date] = None
    renewal_date: Optional[date] = None
    auto_renew: bool = True
    currency: str = "USD"
    region: Optional[str] = None

class SubscriptionCreate(BaseModel):
    plan_id: int
    idempotency_key: Optional[str] = None

class SubscriptionUpdate(BaseModel):
    status: Optional[str] = Field(None, description="Pause, Resume, Cancel, Renew")
    auto_renew: Optional[bool] = None
    cancellation_reason: Optional[str] = None
    version: int
    idempotency_key: Optional[str] = None

class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool
    version: int
    plan: Optional[SubscriptionPlanResponse] = None

    model_config = ConfigDict(from_attributes=True)

class PaymentHistoryResponse(BaseModel):
    id: int
    subscription_id: int
    amount: float
    currency: str
    status: str
    payment_date: datetime
    transaction_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
