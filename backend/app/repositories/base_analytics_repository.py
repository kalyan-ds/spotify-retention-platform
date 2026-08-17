from typing import TypeVar, Optional, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import Select, and_
from pydantic import BaseModel

from app.schemas.analytics import AnalyticsFilter
from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseAnalyticsRepository:
    """
    Base repository providing utilities to apply common analytics filters
    to SQLAlchemy queries dynamically.
    """

    def apply_filters(
        self,
        query: Select,
        model: Type[ModelType],
        filters: AnalyticsFilter,
        date_column_name: str = "created_at"
    ) -> Select:
        """
        Dynamically applies where clauses to a Select statement based on the
        provided AnalyticsFilter.
        """

        # Apply Date Range filtering if date_column_name exists on the model
        if hasattr(model, date_column_name):
            date_col = getattr(model, date_column_name)
            if filters.start_date:
                query = query.where(date_col >= filters.start_date)
            if filters.end_date:
                query = query.where(date_col <= filters.end_date)

        # Apply standard categorical filters
        if filters.country and hasattr(model, "country"):
            query = query.where(getattr(model, "country") == filters.country)

        if filters.device and hasattr(model, "platform"):
            query = query.where(getattr(model, "platform") == filters.device)

        if filters.subscription_plan and hasattr(model, "tier"):
            query = query.where(getattr(model, "tier") == filters.subscription_plan)

        if filters.premium_status is not None and hasattr(model, "is_premium"):
            query = query.where(getattr(model, "is_premium") == filters.premium_status)

        if filters.gender and hasattr(model, "gender"):
            query = query.where(getattr(model, "gender") == filters.gender)

        # Catalog specific filters
        if filters.artist_id and hasattr(model, "artist_id"):
            query = query.where(getattr(model, "artist_id") == filters.artist_id)

        if filters.album_id and hasattr(model, "album_id"):
            query = query.where(getattr(model, "album_id") == filters.album_id)

        if filters.playlist_id and hasattr(model, "playlist_id"):
            query = query.where(getattr(model, "playlist_id") == filters.playlist_id)

        if filters.song_id and hasattr(model, "song_id"):
            query = query.where(getattr(model, "song_id") == filters.song_id)

        return query
