from datetime import datetime, date
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Date, Numeric, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional

from app.database.base import Base
from app.database.mixins import BaseEntityMixin


class SubscriptionPlan(BaseEntityMixin, Base):
    __tablename__ = "subscription_plans"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True) # Premium, Duo, Family
    description: Mapped[Optional[str]] = mapped_column(String(255))
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    billing_cycle: Mapped[str] = mapped_column(String(20)) # monthly, yearly
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    subscriptions: Mapped[List["Subscription"]] = relationship("Subscription", back_populates="plan")


class Subscription(BaseEntityMixin, Base):
    __tablename__ = "subscriptions"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("subscription_plans.id"), index=True)

    status: Mapped[str] = mapped_column(String(50), index=True) # active, canceled, past-due
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[Optional[date]] = mapped_column(Date, index=True)
    renewal_date: Mapped[Optional[date]] = mapped_column(Date, index=True)

    # Expansion fields
    auto_renew: Mapped[bool] = mapped_column(Boolean, default=True)
    trial_start: Mapped[Optional[date]] = mapped_column(Date)
    trial_end: Mapped[Optional[date]] = mapped_column(Date)
    cancellation_channel: Mapped[Optional[str]] = mapped_column(String(100))
    cancellation_reason: Mapped[Optional[str]] = mapped_column(String(255))
    renewal_attempts: Mapped[int] = mapped_column(Integer, default=0)
    payment_method: Mapped[Optional[str]] = mapped_column(String(50))
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    region: Mapped[Optional[str]] = mapped_column(String(50))

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="subscriptions")
    plan: Mapped["SubscriptionPlan"] = relationship("SubscriptionPlan", back_populates="subscriptions")
    payments: Mapped[List["PaymentHistory"]] = relationship("PaymentHistory", back_populates="subscription")


class PaymentHistory(BaseEntityMixin, Base):
    __tablename__ = "payment_history"

    subscription_id: Mapped[int] = mapped_column(ForeignKey("subscriptions.id"), index=True)
    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    status: Mapped[str] = mapped_column(String(50)) # success, failed, refunded
    payment_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    transaction_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True)

    # Relationships
    subscription: Mapped["Subscription"] = relationship("Subscription", back_populates="payments")
