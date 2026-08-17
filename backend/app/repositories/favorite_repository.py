from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, asc
from sqlalchemy.orm import selectinload

from app.models.listening import FavoriteSong, FavoriteArtist
from app.models.catalog import Song, Artist

class FavoriteRepository:

    # Songs
    async def get_favorite_songs(
        self,
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[FavoriteSong]:
        query = select(FavoriteSong).where(FavoriteSong.user_id == user_id).order_by(desc(FavoriteSong.added_at))
        # Note: In a real app we might want to eager load the song relationship.
        # But FavoriteSong in models doesn't have a direct relationship property defined back to song.
        # We'd have to load them manually or join.
        # For simplicity, assuming the model can load it, or we join with Song.
        # Let's join and return Song if we need to. But the repository returns FavoriteSong.
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_favorite_song(self, db: AsyncSession, user_id: int, song_id: int) -> Optional[FavoriteSong]:
        query = select(FavoriteSong).where(
            and_(FavoriteSong.user_id == user_id, FavoriteSong.song_id == song_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def add_favorite_song(self, db: AsyncSession, user_id: int, song_id: int) -> FavoriteSong:
        fav = FavoriteSong(user_id=user_id, song_id=song_id)
        db.add(fav)
        await db.commit()
        await db.refresh(fav)
        return fav

    async def remove_favorite_song(self, db: AsyncSession, user_id: int, song_id: int) -> bool:
        fav = await self.get_favorite_song(db, user_id, song_id)
        if fav:
            await db.delete(fav)
            await db.commit()
            return True
        return False

    # Artists
    async def get_favorite_artists(
        self,
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[FavoriteArtist]:
        query = select(FavoriteArtist).where(FavoriteArtist.user_id == user_id).order_by(desc(FavoriteArtist.added_at))
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_favorite_artist(self, db: AsyncSession, user_id: int, artist_id: int) -> Optional[FavoriteArtist]:
        query = select(FavoriteArtist).where(
            and_(FavoriteArtist.user_id == user_id, FavoriteArtist.artist_id == artist_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def add_favorite_artist(self, db: AsyncSession, user_id: int, artist_id: int) -> FavoriteArtist:
        fav = FavoriteArtist(user_id=user_id, artist_id=artist_id)
        db.add(fav)
        await db.commit()
        await db.refresh(fav)
        return fav

    async def remove_favorite_artist(self, db: AsyncSession, user_id: int, artist_id: int) -> bool:
        fav = await self.get_favorite_artist(db, user_id, artist_id)
        if fav:
            await db.delete(fav)
            await db.commit()
            return True
        return False

favorite_repo = FavoriteRepository()
