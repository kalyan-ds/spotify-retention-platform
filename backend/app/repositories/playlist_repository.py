from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, asc
from sqlalchemy.orm import selectinload

from app.models.playlist import Playlist, PlaylistTrack
from app.repositories.base import BaseRepository

class PlaylistRepository(BaseRepository[Playlist, dict, dict]):
    def __init__(self):
        super().__init__(Playlist)

    async def get_playlists(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "created_at",
        sort_desc: bool = True
    ) -> List[Playlist]:

        query = select(self.model).where(
            and_(self.model.created_by_id == user_id, getattr(self.model, "is_deleted", False) == False)
        )

        sort_column = getattr(self.model, sort_by, self.model.created_at)
        if sort_desc:
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_with_details(self, db: AsyncSession, id: int) -> Optional[Playlist]:
        query = select(self.model).where(
            and_(self.model.id == id, getattr(self.model, "is_deleted", False) == False)
        ).options(
            selectinload(self.model.creator),
            selectinload(self.model.tracks).selectinload(PlaylistTrack.song),
            selectinload(self.model.tracks).selectinload(PlaylistTrack.added_by)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_name(self, db: AsyncSession, name: str, user_id: int) -> Optional[Playlist]:
        query = select(self.model).where(
            and_(
                self.model.name == name,
                self.model.created_by_id == user_id,
                getattr(self.model, "is_deleted", False) == False
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def add_track(self, db: AsyncSession, playlist_id: int, song_id: int, user_id: int, position: int) -> PlaylistTrack:
        track = PlaylistTrack(
            playlist_id=playlist_id,
            song_id=song_id,
            position=position,
            added_by_id=user_id
        )
        db.add(track)
        await db.commit()
        await db.refresh(track)
        return track

    async def remove_track(self, db: AsyncSession, playlist_id: int, song_id: int) -> bool:
        query = select(PlaylistTrack).where(
            and_(PlaylistTrack.playlist_id == playlist_id, PlaylistTrack.song_id == song_id)
        )
        result = await db.execute(query)
        track = result.scalar_one_or_none()
        if track:
            await db.delete(track)
            await db.commit()
            return True
        return False

    async def get_track(self, db: AsyncSession, playlist_id: int, song_id: int) -> Optional[PlaylistTrack]:
        query = select(PlaylistTrack).where(
            and_(PlaylistTrack.playlist_id == playlist_id, PlaylistTrack.song_id == song_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

playlist_repo = PlaylistRepository()
