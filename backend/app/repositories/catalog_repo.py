from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.repositories.base import BaseRepository
from app.models.catalog import Artist, Album, Song, Genre

class ArtistRepository(BaseRepository[Artist, dict, dict]):
    def __init__(self):
        super().__init__(Artist)

    async def get_with_albums(self, db: AsyncSession, artist_id: int) -> Optional[Artist]:
        query = select(Artist).options(selectinload(Artist.albums)).where(Artist.id == artist_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

class AlbumRepository(BaseRepository[Album, dict, dict]):
    def __init__(self):
        super().__init__(Album)

    async def get_with_songs(self, db: AsyncSession, album_id: int) -> Optional[Album]:
        query = select(Album).options(selectinload(Album.songs)).where(Album.id == album_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

class SongRepository(BaseRepository[Song, dict, dict]):
    def __init__(self):
        super().__init__(Song)

    async def get_full_details(self, db: AsyncSession, song_id: int) -> Optional[Song]:
        query = (
            select(Song)
            .options(
                selectinload(Song.song_artists).selectinload("artist"),
                selectinload(Song.song_genres).selectinload("genre"),
                selectinload(Song.album)
            )
            .where(Song.id == song_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

class GenreRepository(BaseRepository[Genre, dict, dict]):
    def __init__(self):
        super().__init__(Genre)

artist_repo = ArtistRepository()
album_repo = AlbumRepository()
song_repo = SongRepository()
genre_repo = GenreRepository()
