from datetime import date, datetime
from sqlalchemy import String, Integer, Float, JSON, Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from typing import Optional

from app.database.base import Base
from app.database.mixins import BaseEntityMixin


class DailyMetric(BaseEntityMixin, Base):
    __tablename__ = "daily_metrics"

    date: Mapped[date] = mapped_column(Date, unique=True, index=True)
    retention_rate: Mapped[float] = mapped_column(Float)
    churn_rate: Mapped[float] = mapped_column(Float)
    premium_conversion: Mapped[float] = mapped_column(Float)
    total_listening_time_ms: Mapped[int] = mapped_column(Integer)
    average_session_ms: Mapped[int] = mapped_column(Integer)
    daily_active_users: Mapped[int] = mapped_column(Integer)

    # Additional aggregations can be stored as JSON
    segmented_data: Mapped[Optional[dict]] = mapped_column(JSON)


class WeeklyMetric(BaseEntityMixin, Base):
    __tablename__ = "weekly_metrics"

    start_date: Mapped[date] = mapped_column(Date, unique=True, index=True)
    end_date: Mapped[date] = mapped_column(Date, index=True)
    retention_rate: Mapped[float] = mapped_column(Float)
    churn_rate: Mapped[float] = mapped_column(Float)
    premium_conversion: Mapped[float] = mapped_column(Float)
    total_listening_time_ms: Mapped[int] = mapped_column(Integer)
    average_session_ms: Mapped[int] = mapped_column(Integer)
    weekly_active_users: Mapped[int] = mapped_column(Integer)

    segmented_data: Mapped[Optional[dict]] = mapped_column(JSON)


class MonthlyMetric(BaseEntityMixin, Base):
    __tablename__ = "monthly_metrics"

    month: Mapped[date] = mapped_column(Date, unique=True, index=True) # Usually 1st day of month
    retention_rate: Mapped[float] = mapped_column(Float)
    churn_rate: Mapped[float] = mapped_column(Float)
    premium_conversion: Mapped[float] = mapped_column(Float)
    total_listening_time_ms: Mapped[int] = mapped_column(Integer)
    average_session_ms: Mapped[int] = mapped_column(Integer)
    monthly_active_users: Mapped[int] = mapped_column(Integer)

    segmented_data: Mapped[Optional[dict]] = mapped_column(JSON)


class DashboardCache(BaseEntityMixin, Base):
    __tablename__ = "dashboard_cache"

    cache_key: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    cache_data: Mapped[dict] = mapped_column(JSON)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class RetentionCohort(BaseEntityMixin, Base):
    __tablename__ = "retention_cohorts"

    cohort_month: Mapped[date] = mapped_column(Date, index=True)
    acquisition_source: Mapped[str] = mapped_column(String(100))
    retention_day: Mapped[Optional[int]] = mapped_column(Integer)
    retention_week: Mapped[Optional[int]] = mapped_column(Integer)
    retention_month: Mapped[Optional[int]] = mapped_column(Integer)

    active_users: Mapped[int] = mapped_column(Integer)
    retention_rate: Mapped[float] = mapped_column(Float)
