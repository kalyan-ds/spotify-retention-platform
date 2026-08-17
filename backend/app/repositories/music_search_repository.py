from typing import List, Dict, Any, Tuple
from sqlalchemy import select, func, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.catalog import Artist, Album, Song, Genre

class MusicSearchRepository:
    """Handles cross-entity music search operations."""

    async def global_search(
        self,
        db: AsyncSession,
        query: str,
        entity_type: str = "all",
        skip: int = 0,
        limit: int = 20
    ) -> Dict[str, Any]:
        """
        Performs a global search across all music catalog entities.
        Search Rank strategy: Exact Match > Prefix > Contains.
        (For simplicity in raw SQL, we use ilike `%query%` and sort results in memory,
        or rely on basic alphabetical ordering for now as instructed).
        """
        results = {
            "artists": [],
            "albums": [],
            "songs": [],
            "genres": []
        }

        search_pattern = f"%{query}%"

        # 1. Search Artists
        if entity_type in ["all", "artist"]:
            q_artist = select(Artist).where(Artist.name.ilike(search_pattern), Artist.is_deleted == False).order_by(asc(Artist.name)).limit(limit)
            artist_res = await db.execute(q_artist)
            results["artists"] = artist_res.scalars().all()

        # 2. Search Albums
        if entity_type in ["all", "album"]:
            q_album = select(Album).where(Album.title.ilike(search_pattern), Album.is_deleted == False).order_by(asc(Album.title)).limit(limit)
            album_res = await db.execute(q_album)
            results["albums"] = album_res.scalars().all()

        # 3. Search Songs
        if entity_type in ["all", "song"]:
            q_song = select(Song).where(Song.title.ilike(search_pattern), Song.is_deleted == False).order_by(asc(Song.title)).limit(limit)
            song_res = await db.execute(q_song)
            results["songs"] = song_res.scalars().all()

        # 4. Search Genres
        if entity_type in ["all", "genre"]:
            q_genre = select(Genre).where(Genre.name.ilike(search_pattern), Genre.is_deleted == False).order_by(asc(Genre.name)).limit(limit)
            genre_res = await db.execute(q_genre)
            results["genres"] = genre_res.scalars().all()

        return results

music_search_repo = MusicSearchRepository()
