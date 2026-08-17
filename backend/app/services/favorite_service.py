from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.models.catalog import Song, Artist
from app.repositories.favorite_repository import favorite_repo
from app.schemas.activity import FavoriteSongResponse, FavoriteArtistResponse
from app.schemas.catalog import SongSummaryResponse, ArtistSummaryResponse

class FavoriteService:
    async def get_favorite_songs(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> List[FavoriteSongResponse]:
        favs = await favorite_repo.get_favorite_songs(db, user_id, skip, limit)
        results = []
        for fav in favs:
            # We must eager load or fetch the song.
            # Since FavoriteSong model doesn't have a configured relationship to Song in listening.py, we will manually query it for now.
            # In a true prod env, we'd add the relationship mapping or join.
            query = select(Song).where(Song.id == fav.song_id)
            result = await db.execute(query)
            song = result.scalar_one_or_none()
            if song:
                song_data = SongSummaryResponse(
                    id=song.id,
                    title=song.title,
                    duration_ms=song.duration_ms,
                    is_explicit=song.is_explicit
                )
                results.append(FavoriteSongResponse(song=song_data, added_at=fav.added_at))
        return results

    async def add_favorite_song(self, db: AsyncSession, user_id: int, song_id: int) -> dict:
        existing = await favorite_repo.get_favorite_song(db, user_id, song_id)
        if existing:
            raise HTTPException(status_code=422, detail="Validation Error: Duplicate favorites are prohibited")
        await favorite_repo.add_favorite_song(db, user_id, song_id)
        return {"success": True}

    async def remove_favorite_song(self, db: AsyncSession, user_id: int, song_id: int):
        removed = await favorite_repo.remove_favorite_song(db, user_id, song_id)
        if not removed:
            raise HTTPException(status_code=404, detail="Favorite Not Found")

    async def get_favorite_artists(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> List[FavoriteArtistResponse]:
        favs = await favorite_repo.get_favorite_artists(db, user_id, skip, limit)
        results = []
        for fav in favs:
            query = select(Artist).where(Artist.id == fav.artist_id)
            result = await db.execute(query)
            artist = result.scalar_one_or_none()
            if artist:
                artist_data = ArtistSummaryResponse(
                    id=artist.id,
                    name=artist.name,
                    country=artist.country
                )
                results.append(FavoriteArtistResponse(artist=artist_data, added_at=fav.added_at))
        return results

    async def add_favorite_artist(self, db: AsyncSession, user_id: int, artist_id: int) -> dict:
        existing = await favorite_repo.get_favorite_artist(db, user_id, artist_id)
        if existing:
            raise HTTPException(status_code=422, detail="Validation Error: Duplicate favorites are prohibited")
        await favorite_repo.add_favorite_artist(db, user_id, artist_id)
        return {"success": True}

    async def remove_favorite_artist(self, db: AsyncSession, user_id: int, artist_id: int):
        removed = await favorite_repo.remove_favorite_artist(db, user_id, artist_id)
        if not removed:
            raise HTTPException(status_code=404, detail="Favorite Not Found")

favorite_service = FavoriteService()
