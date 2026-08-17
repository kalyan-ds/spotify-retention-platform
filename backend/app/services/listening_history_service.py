from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.listening_history_repository import listening_history_repo
from app.schemas.activity import ListeningHistorySummaryResponse, ListeningHistoryDetailResponse
from app.schemas.catalog import SongSummaryResponse, SongArtistSummary

class ListeningHistoryService:
    async def get_listening_history(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "timestamp",
        sort_desc: bool = True,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        song_id: Optional[int] = None,
        device_id: Optional[int] = None,
        min_completion: Optional[float] = None,
        skipped: Optional[bool] = None
    ) -> List[ListeningHistorySummaryResponse]:
        history_records = await listening_history_repo.get_history(
            db,
            user_id=user_id,
            skip=skip,
            limit=limit,
            sort_by=sort_by,
            sort_desc=sort_desc,
            start_date=start_date,
            end_date=end_date,
            song_id=song_id,
            device_id=device_id,
            min_completion=min_completion,
            skipped=skipped
        )

        results = []
        for h in history_records:
            # Map Song
            song_data = SongSummaryResponse(
                id=h.song.id,
                title=h.song.title,
                duration_ms=h.song.duration_ms,
                is_explicit=h.song.is_explicit
            )

            summary = ListeningHistorySummaryResponse(
                id=h.id,
                song=song_data,
                timestamp=h.timestamp,
                play_duration_ms=h.play_duration_ms,
                completion_percentage=h.completion_percentage,
                skipped=h.skipped
            )
            results.append(summary)

        return results

    async def get_listening_history_detail(
        self,
        db: AsyncSession,
        history_id: int,
        user_id: int
    ) -> ListeningHistoryDetailResponse:
        h = await listening_history_repo.get_with_details(db, id=history_id, user_id=user_id)
        if not h:
            raise HTTPException(status_code=404, detail="Listening History Not Found")

        song_data = SongSummaryResponse(
            id=h.song.id,
            title=h.song.title,
            duration_ms=h.song.duration_ms,
            is_explicit=h.song.is_explicit
        )

        detail = ListeningHistoryDetailResponse(
            id=h.id,
            song=song_data,
            timestamp=h.timestamp,
            play_duration_ms=h.play_duration_ms,
            completion_percentage=h.completion_percentage,
            skipped=h.skipped,
            skip_count=h.skip_count,
            repeated=h.repeated,
            shuffle_enabled=h.shuffle_enabled,
            repeat_mode=h.repeat_mode,
            playback_source=h.playback_source,
            recommendation_source=h.recommendation_source,
            network_type=h.network_type,
            country=h.country,
            platform=h.platform,
            application_version=h.application_version,
            created_at=h.created_at,
            updated_at=h.updated_at
        )

        if h.session:
            # Map basic session
            # Needs lazy load issues check, but we selectinloaded session
            detail.session = {
                "id": h.session.id,
                "start_time": h.session.start_time,
                "end_time": h.session.end_time,
                "duration_ms": h.session.duration_ms,
                "is_active": h.session.is_active
            }

        if h.device:
            detail.device = {
                "id": h.device.id,
                "device_type": h.device.device_type,
                "platform": h.device.platform,
                "last_active": h.device.updated_at
            }

        return detail

listening_history_service = ListeningHistoryService()
