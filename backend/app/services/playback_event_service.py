from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.playback_event_repository import playback_event_repo
from app.schemas.activity import PlaybackEventSummaryResponse

class PlaybackEventService:
    async def get_events(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        event_type: Optional[str] = None
    ) -> List[PlaybackEventSummaryResponse]:

        events = await playback_event_repo.get_events(
            db,
            user_id=user_id,
            skip=skip,
            limit=limit,
            event_type=event_type
        )

        results = []
        for e in events:
            # Playback events are reconstructed from ActivityLog
            parsed_event_type = e.details.get("event_type", "UNKNOWN") if e.details else "UNKNOWN"

            results.append(PlaybackEventSummaryResponse(
                id=e.id,
                event_type=parsed_event_type,
                timestamp=e.created_at, # Using activity log creation time
                resource_type=e.resource_type,
                resource_id=e.resource_id
            ))

        return results

playback_event_service = PlaybackEventService()
