from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.repositories.song_repository import song_repo
from app.schemas.catalog import SongSummaryResponse, SongDetailResponse, SongArtistSummary, GenreSummaryResponse
from app.models.catalog import Song

class SongService:
    @staticmethod
    async def get_songs(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        album_id: Optional[int] = None,
        is_explicit: Optional[bool] = None,
        sort_by: str = "title",
        sort_order: str = "asc"
    ) -> Tuple[List[SongSummaryResponse], int]:

        songs, total = await song_repo.search_and_filter(
            db, skip=skip, limit=limit, q=q, album_id=album_id, is_explicit=is_explicit,
            sort_by=sort_by, sort_order=sort_order
        )

        responses = [SongSummaryResponse.model_validate(s) for s in songs]
        return responses, total

    @staticmethod
    async def get_song_by_id(db: AsyncSession, song_id: int) -> SongDetailResponse:
        song = await song_repo.get_song_detail(db, song_id)
        if not song:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Song not found"
            )

        dto = SongDetailResponse.model_validate(song)

        # Manually assemble nested relations that Pydantic might not natively map from Association Objects
        dto.artists = [
            SongArtistSummary(
                artist_id=sa.artist_id,
                artist_name=sa.artist.name if hasattr(sa, 'artist') and sa.artist else "Unknown",
                artist_role=sa.artist_role
            )
            for sa in song.song_artists
        ]

        dto.genres = [
            GenreSummaryResponse(
                id=sg.genre_id,
                name=sg.genre.name if hasattr(sg, 'genre') and sg.genre else "Unknown"
            )
            for sg in song.song_genres
        ]

        return dto
