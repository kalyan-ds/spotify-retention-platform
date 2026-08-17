from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_

from app.models.listening import ListeningHistory
from app.models.catalog import Song, Artist, Album, Genre, song_artists, song_genres, playlist_songs
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class MusicAnalyticsRepository(BaseAnalyticsRepository):

    async def get_top_songs(self, db: AsyncSession, filters: AnalyticsFilter, limit: int = 10) -> list:
        query = select(
            Song.id,
            Song.title,
            func.count(ListeningHistory.id).label("play_count")
        ).join(
            ListeningHistory, ListeningHistory.song_id == Song.id
        ).where(
            getattr(Song, "is_deleted", False) == False
        )
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")
        query = query.group_by(Song.id, Song.title).order_by(desc("play_count"), Song.title).limit(limit)

        result = await db.execute(query)
        return result.all()

    async def get_top_artists(self, db: AsyncSession, filters: AnalyticsFilter, limit: int = 10) -> list:
        query = select(
            Artist.id,
            Artist.name,
            func.count(ListeningHistory.id).label("play_count")
        ).select_from(ListeningHistory).join(
            Song, ListeningHistory.song_id == Song.id
        ).join(
            song_artists, song_artists.c.song_id == Song.id
        ).join(
            Artist, Artist.id == song_artists.c.artist_id
        ).where(
            getattr(Artist, "is_deleted", False) == False
        )
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")
        query = query.group_by(Artist.id, Artist.name).order_by(desc("play_count"), Artist.name).limit(limit)

        result = await db.execute(query)
        return result.all()

    async def get_top_albums(self, db: AsyncSession, filters: AnalyticsFilter, limit: int = 10) -> list:
        query = select(
            Album.id,
            Album.title,
            func.count(ListeningHistory.id).label("play_count")
        ).select_from(ListeningHistory).join(
            Song, ListeningHistory.song_id == Song.id
        ).join(
            Album, Album.id == Song.album_id
        ).where(
            getattr(Album, "is_deleted", False) == False
        )
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")
        query = query.group_by(Album.id, Album.title).order_by(desc("play_count"), Album.title).limit(limit)

        result = await db.execute(query)
        return result.all()

    async def get_genre_distribution(self, db: AsyncSession, filters: AnalyticsFilter) -> list:
        query = select(
            Genre.name,
            func.count(ListeningHistory.id).label("play_count")
        ).select_from(ListeningHistory).join(
            Song, ListeningHistory.song_id == Song.id
        ).join(
            song_genres, song_genres.c.song_id == Song.id
        ).join(
            Genre, Genre.id == song_genres.c.genre_id
        )
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")
        query = query.group_by(Genre.name).order_by(desc("play_count"))

        result = await db.execute(query)
        return result.all()

music_analytics_repo = MusicAnalyticsRepository()
