from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.playlist import Playlist
from app.repositories.playlist_repository import playlist_repo
from app.schemas.playlist import (
    PlaylistSummaryResponse,
    PlaylistDetailResponse,
    PlaylistTrackResponse,
    PlaylistCreateRequest,
    PlaylistUpdateRequest
)
from app.schemas.catalog import SongSummaryResponse
from app.schemas.auth import UserResponse

class PlaylistService:
    async def get_playlists(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "created_at",
        sort_desc: bool = True
    ) -> List[PlaylistSummaryResponse]:

        playlists = await playlist_repo.get_playlists(
            db,
            user_id=user_id,
            skip=skip,
            limit=limit,
            sort_by=sort_by,
            sort_desc=sort_desc
        )

        results = []
        for p in playlists:
            results.append(PlaylistSummaryResponse(
                id=p.id,
                name=p.name,
                visibility=p.visibility,
                follower_count=p.follower_count,
                total_tracks=p.total_tracks,
                total_duration_ms=p.total_duration_ms
            ))

        return results

    async def get_playlist_detail(
        self,
        db: AsyncSession,
        playlist_id: int,
        user_id: int
    ) -> PlaylistDetailResponse:

        p = await playlist_repo.get_with_details(db, id=playlist_id)
        if not p:
            raise HTTPException(status_code=404, detail="Playlist Not Found")

        # Optional RBAC / Visibility checks can be added here
        if p.visibility == "Private" and p.created_by_id != user_id:
            raise HTTPException(status_code=403, detail="Permission Denied")

        creator = UserResponse(
            id=p.creator.id,
            email=p.creator.email,
            first_name=p.creator.first_name,
            last_name=p.creator.last_name,
            role=p.creator.role
        )

        tracks = []
        for t in p.tracks:
            song_data = SongSummaryResponse(
                id=t.song.id,
                title=t.song.title,
                duration_ms=t.song.duration_ms,
                is_explicit=t.song.is_explicit
            )
            added_by = UserResponse(
                id=t.added_by.id,
                email=t.added_by.email,
                first_name=t.added_by.first_name,
                last_name=t.added_by.last_name,
                role=t.added_by.role
            )
            tracks.append(PlaylistTrackResponse(
                song=song_data,
                position=t.position,
                added_by=added_by,
                added_at=t.added_at
            ))

        return PlaylistDetailResponse(
            id=p.id,
            name=p.name,
            visibility=p.visibility,
            follower_count=p.follower_count,
            total_tracks=p.total_tracks,
            total_duration_ms=p.total_duration_ms,
            description=p.description,
            creator=creator,
            tracks=tracks,
            created_at=p.created_at,
            updated_at=p.updated_at
        )

    async def create_playlist(
        self,
        db: AsyncSession,
        user_id: int,
        req: PlaylistCreateRequest
    ) -> PlaylistSummaryResponse:

        # Check for unique name
        existing = await playlist_repo.get_by_name(db, name=req.name, user_id=user_id)
        if existing:
            raise HTTPException(status_code=422, detail="Validation Error: Playlist name must be unique")

        # Use simple dict logic instead of full Pydantic mapping for this internal step
        new_playlist = Playlist(
            name=req.name,
            description=req.description,
            visibility=req.visibility,
            created_by_id=user_id
        )
        db.add(new_playlist)
        await db.commit()
        await db.refresh(new_playlist)

        return PlaylistSummaryResponse(
            id=new_playlist.id,
            name=new_playlist.name,
            visibility=new_playlist.visibility,
            follower_count=new_playlist.follower_count,
            total_tracks=new_playlist.total_tracks,
            total_duration_ms=new_playlist.total_duration_ms
        )

    async def update_playlist(
        self,
        db: AsyncSession,
        playlist_id: int,
        user_id: int,
        req: PlaylistUpdateRequest
    ) -> PlaylistSummaryResponse:

        p = await playlist_repo.get(db, id=playlist_id)
        if not p or getattr(p, "is_deleted", False):
            raise HTTPException(status_code=404, detail="Playlist Not Found")

        if p.created_by_id != user_id:
            raise HTTPException(status_code=403, detail="Permission Denied")

        if req.name and req.name != p.name:
            existing = await playlist_repo.get_by_name(db, name=req.name, user_id=user_id)
            if existing:
                raise HTTPException(status_code=422, detail="Validation Error: Playlist name must be unique")
            p.name = req.name

        if req.description is not None:
            p.description = req.description
        if req.visibility is not None:
            p.visibility = req.visibility

        db.add(p)
        await db.commit()
        await db.refresh(p)

        return PlaylistSummaryResponse(
            id=p.id,
            name=p.name,
            visibility=p.visibility,
            follower_count=p.follower_count,
            total_tracks=p.total_tracks,
            total_duration_ms=p.total_duration_ms
        )

    async def delete_playlist(
        self,
        db: AsyncSession,
        playlist_id: int,
        user_id: int
    ):
        p = await playlist_repo.get(db, id=playlist_id)
        if not p or getattr(p, "is_deleted", False):
            raise HTTPException(status_code=404, detail="Playlist Not Found")

        if p.created_by_id != user_id:
            raise HTTPException(status_code=403, detail="Permission Denied")

        await playlist_repo.soft_remove(db, id=playlist_id)

    async def add_song(self, db: AsyncSession, playlist_id: int, song_id: int, user_id: int, position: int = 0):
        p = await playlist_repo.get(db, id=playlist_id)
        if not p or getattr(p, "is_deleted", False):
            raise HTTPException(status_code=404, detail="Playlist Not Found")

        if p.created_by_id != user_id and p.visibility != "Collaborative":
            raise HTTPException(status_code=403, detail="Permission Denied")

        existing_track = await playlist_repo.get_track(db, playlist_id, song_id)
        if existing_track:
            raise HTTPException(status_code=422, detail="Validation Error: Duplicate songs are not allowed")

        await playlist_repo.add_track(db, playlist_id, song_id, user_id, position)

    async def remove_song(self, db: AsyncSession, playlist_id: int, song_id: int, user_id: int):
        p = await playlist_repo.get(db, id=playlist_id)
        if not p or getattr(p, "is_deleted", False):
            raise HTTPException(status_code=404, detail="Playlist Not Found")

        if p.created_by_id != user_id and p.visibility != "Collaborative":
            raise HTTPException(status_code=403, detail="Permission Denied")

        removed = await playlist_repo.remove_track(db, playlist_id, song_id)
        if not removed:
            raise HTTPException(status_code=404, detail="Song not found in playlist")

playlist_service = PlaylistService()
