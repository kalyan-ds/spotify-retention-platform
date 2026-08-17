from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.repositories.music_search_repository import music_search_repo
from app.schemas.catalog import ArtistSearchResponse, AlbumSearchResponse, SongSearchResponse, GenreSearchResponse

class MusicSearchService:
    @staticmethod
    async def global_search(
        db: AsyncSession,
        q: str,
        entity_type: str = "all",
        skip: int = 0,
        limit: int = 20
    ) -> Dict[str, List[Any]]:

        valid_types = ["all", "artist", "album", "song", "genre"]
        if entity_type not in valid_types:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid search type. Must be one of {valid_types}"
            )

        raw_results = await music_search_repo.global_search(
            db, query=q, entity_type=entity_type, skip=skip, limit=limit
        )

        # Map to DTOs
        dto_results = {}
        if "artists" in raw_results and raw_results["artists"]:
            dto_results["artists"] = [ArtistSearchResponse.model_validate(a) for a in raw_results["artists"]]
        else:
            dto_results["artists"] = []

        if "albums" in raw_results and raw_results["albums"]:
            dto_results["albums"] = [AlbumSearchResponse.model_validate(a) for a in raw_results["albums"]]
        else:
            dto_results["albums"] = []

        if "songs" in raw_results and raw_results["songs"]:
            dto_results["songs"] = [SongSearchResponse.model_validate(s) for s in raw_results["songs"]]
        else:
            dto_results["songs"] = []

        if "genres" in raw_results and raw_results["genres"]:
            dto_results["genres"] = [GenreSearchResponse.model_validate(g) for g in raw_results["genres"]]
        else:
            dto_results["genres"] = []

        return dto_results
