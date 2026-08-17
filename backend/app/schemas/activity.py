from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.catalog import SongSummaryResponse, ArtistSummaryResponse

# -----------------------------------------
# Devices
# -----------------------------------------

class DeviceSummaryResponse(BaseModel):
    id: int
    device_type: str
    platform: Optional[str] = None
    last_active: Optional[datetime] = None

    class Config:
        from_attributes = True

class DeviceDetailResponse(DeviceSummaryResponse):
    operating_system: Optional[str] = None
    os_version: Optional[str] = None
    application_version: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# -----------------------------------------
# Listening Sessions
# -----------------------------------------

class ListeningSessionSummaryResponse(BaseModel):
    id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_ms: Optional[int] = None
    is_active: bool

    class Config:
        from_attributes = True

class ListeningSessionDetailResponse(ListeningSessionSummaryResponse):
    device: Optional[DeviceSummaryResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ListeningSessionListResponse(BaseModel):
    sessions: List[ListeningSessionSummaryResponse]


# -----------------------------------------
# Listening History
# -----------------------------------------

class ListeningHistorySummaryResponse(BaseModel):
    id: int
    song: SongSummaryResponse
    timestamp: datetime
    play_duration_ms: int
    completion_percentage: float
    skipped: bool

    class Config:
        from_attributes = True

class ListeningHistoryDetailResponse(ListeningHistorySummaryResponse):
    session: Optional[ListeningSessionSummaryResponse] = None
    device: Optional[DeviceSummaryResponse] = None
    skip_count: int
    repeated: bool
    shuffle_enabled: bool
    repeat_mode: str
    playback_source: str
    recommendation_source: Optional[str] = None
    network_type: Optional[str] = None
    country: Optional[str] = None
    platform: Optional[str] = None
    application_version: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ListeningHistoryListResponse(BaseModel):
    history: List[ListeningHistorySummaryResponse]


# -----------------------------------------
# Playback Events
# -----------------------------------------

class PlaybackEventSummaryResponse(BaseModel):
    id: int
    event_type: str
    timestamp: datetime
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None

    class Config:
        from_attributes = True

class PlaybackEventDetailResponse(PlaybackEventSummaryResponse):
    details: Optional[dict] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# -----------------------------------------
# Favorites
# -----------------------------------------

class FavoriteSongResponse(BaseModel):
    song: SongSummaryResponse
    added_at: datetime

    class Config:
        from_attributes = True

class FavoriteArtistResponse(BaseModel):
    artist: ArtistSummaryResponse
    added_at: datetime

    class Config:
        from_attributes = True


# -----------------------------------------
# Search History
# -----------------------------------------

class SearchHistorySummaryResponse(BaseModel):
    id: int
    query: str
    timestamp: datetime

    class Config:
        from_attributes = True

class SearchHistoryDetailResponse(SearchHistorySummaryResponse):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
