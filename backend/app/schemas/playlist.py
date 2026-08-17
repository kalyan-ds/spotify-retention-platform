from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.catalog import SongSummaryResponse
from app.schemas.auth import UserResponse

# -----------------------------------------
# Playlist Track
# -----------------------------------------

class PlaylistTrackResponse(BaseModel):
    song: SongSummaryResponse
    position: int
    added_by: UserResponse
    added_at: datetime

    class Config:
        from_attributes = True

# -----------------------------------------
# Playlist
# -----------------------------------------

class PlaylistSummaryResponse(BaseModel):
    id: int
    name: str
    visibility: str
    follower_count: int
    total_tracks: int
    total_duration_ms: int

    class Config:
        from_attributes = True

class PlaylistDetailResponse(PlaylistSummaryResponse):
    description: Optional[str] = None
    creator: UserResponse
    tracks: List[PlaylistTrackResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PlaylistListResponse(BaseModel):
    playlists: List[PlaylistSummaryResponse]

# -----------------------------------------
# Playlist Requests
# -----------------------------------------

class PlaylistCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    visibility: str = Field("Public", description="Public, Private, or Collaborative")

class PlaylistUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    visibility: Optional[str] = Field(None)

class PlaylistAddSongRequest(BaseModel):
    song_id: int
    position: Optional[int] = None
