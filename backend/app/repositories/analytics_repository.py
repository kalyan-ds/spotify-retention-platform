from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, text
from typing import Dict, Any

from app.models.auth import User
from app.models.catalog import Song, Artist, Album
from app.models.listening import ListeningSession, ListeningHistory, Device
from app.models.subscription import Subscription
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class AnalyticsRepository(BaseAnalyticsRepository):

    async def get_total_users(self, db: AsyncSession, filters: AnalyticsFilter = None) -> int:
        query = select(func.count(User.id)).where(User.is_active == True)
        if filters:
            query = self.apply_filters(query, User, filters, date_column_name="created_at")
        result = await db.execute(query)
        return result.scalar() or 0

    async def get_premium_users(self, db: AsyncSession, filters: AnalyticsFilter = None) -> int:
        query = select(func.count(User.id)).join(Subscription).where(
            and_(User.is_active == True, Subscription.status == "active")
        )
        if filters:
            query = self.apply_filters(query, User, filters, date_column_name="created_at")
        result = await db.execute(query)
        return result.scalar() or 0

    async def get_catalog_totals(self, db: AsyncSession) -> Dict[str, int]:
        song_query = select(func.count(Song.id)).where(getattr(Song, "is_deleted", False) == False)
        artist_query = select(func.count(Artist.id)).where(getattr(Artist, "is_deleted", False) == False)
        album_query = select(func.count(Album.id)).where(getattr(Album, "is_deleted", False) == False)

        songs = (await db.execute(song_query)).scalar() or 0
        artists = (await db.execute(artist_query)).scalar() or 0
        albums = (await db.execute(album_query)).scalar() or 0

        return {
            "total_songs": songs,
            "total_artists": artists,
            "total_albums": albums
        }

    async def get_device_distribution(self, db: AsyncSession, filters: AnalyticsFilter = None) -> list:
        # returns list of tuples (platform, count)
        query = select(
            Device.platform,
            func.count(Device.id)
        ).group_by(Device.platform)

        if filters:
            query = self.apply_filters(query, Device, filters)

        result = await db.execute(query)
        return result.all()

    async def get_geographic_distribution(self, db: AsyncSession, filters: AnalyticsFilter = None) -> list:
        query = select(
            ListeningHistory.country,
            func.count(ListeningHistory.id)
        ).where(ListeningHistory.country.is_not(None)).group_by(ListeningHistory.country)

        if filters:
            query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")

        result = await db.execute(query)
        return result.all()

    async def get_churn_metrics(self, db: AsyncSession, filters: AnalyticsFilter) -> Dict[str, int]:
        """Calculates total active and canceled subscriptions in the period to compute churn."""
        active_query = select(func.count(Subscription.id)).where(Subscription.status == 'active')
        canceled_query = select(func.count(Subscription.id)).where(Subscription.status == 'canceled')

        active_query = self.apply_filters(active_query, Subscription, filters, date_column_name="start_date")
        # For canceled, we filter by end_date falling within the period
        canceled_query = self.apply_filters(canceled_query, Subscription, filters, date_column_name="end_date")

        active_count = (await db.execute(active_query)).scalar() or 0
        canceled_count = (await db.execute(canceled_query)).scalar() or 0

        return {
            "active_subscriptions": active_count,
            "canceled_subscriptions": canceled_count
        }

    async def get_conversion_funnel(self, db: AsyncSession, filters: AnalyticsFilter) -> Dict[str, int]:
        """Returns step counts for the generic signup -> free -> premium funnel."""
        # Step 1: All active users in the date range
        total_users = await self.get_total_users(db, filters)

        # Step 2: Users who played at least one song
        active_listeners_query = select(func.count(func.distinct(ListeningHistory.user_id)))
        active_listeners_query = self.apply_filters(active_listeners_query, ListeningHistory, filters, date_column_name="timestamp")
        active_listeners = (await db.execute(active_listeners_query)).scalar() or 0

        # Step 3: Premium Users
        premium_users = await self.get_premium_users(db, filters)

        return {
            "signups": total_users,
            "active_listeners": active_listeners,
            "premium_subscribers": premium_users
        }

analytics_repo = AnalyticsRepository()
