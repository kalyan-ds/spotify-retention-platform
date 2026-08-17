from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel, Field

# -----------------------------------------
# Genres
# -----------------------------------------

class GenreSummaryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class GenreDetailResponse(GenreSummaryResponse):
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    # Future Schema Expansion: popularity

    class Config:
        from_attributes = True

class GenreSearchResponse(GenreSummaryResponse):
    pass

class GenreListResponse(BaseModel):
    genres: List[GenreSummaryResponse]


# -----------------------------------------
# Artists
# -----------------------------------------

class ArtistSummaryResponse(BaseModel):
    id: int
    name: str
    country: Optional[str] = None

    class Config:
        from_attributes = True

class ArtistDetailResponse(ArtistSummaryResponse):
    bio: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    genres: List[GenreSummaryResponse] = []
    # Future Schema Expansion: popularity, follower_count, monthly_listeners, debut_year

    class Config:
        from_attributes = True

class ArtistSearchResponse(ArtistSummaryResponse):
    pass

class ArtistListResponse(BaseModel):
    artists: List[ArtistSummaryResponse]


# -----------------------------------------
# Albums
# -----------------------------------------

class AlbumSummaryResponse(BaseModel):
    id: int
    title: str
    release_date: Optional[date] = None
    album_type: Optional[str] = None

    class Config:
        from_attributes = True

class AlbumDetailResponse(AlbumSummaryResponse):
    artist: Optional[ArtistSummaryResponse] = None
    total_tracks: int
    created_at: datetime
    updated_at: datetime
    # Future Schema Expansion: label, popularity, cover_image_url

    class Config:
        from_attributes = True

class AlbumSearchResponse(AlbumSummaryResponse):
    artist_name: Optional[str] = None

    class Config:
        from_attributes = True

class AlbumListResponse(BaseModel):
    albums: List[AlbumSummaryResponse]


# -----------------------------------------
# Songs
# -----------------------------------------

class SongArtistSummary(BaseModel):
    artist_id: int
    artist_name: str
    artist_role: str

    class Config:
        from_attributes = True

class SongSummaryResponse(BaseModel):
    id: int
    title: str
    duration_ms: int
    is_explicit: bool

    class Config:
        from_attributes = True

class SongDetailResponse(SongSummaryResponse):
    album: Optional[AlbumSummaryResponse] = None
    track_number: Optional[int] = None
    release_date: Optional[date] = None
    artists: List[SongArtistSummary] = []
    genres: List[GenreSummaryResponse] = []
    created_at: datetime
    updated_at: datetime
    # Future Schema Expansion: ISRC, language, popularity, disc_number

    class Config:
        from_attributes = True

class SongSearchResponse(SongSummaryResponse):
    album_title: Optional[str] = None

    class Config:
        from_attributes = True

class SongListResponse(BaseModel):
    songs: List[SongSummaryResponse]


# -----------------------------------------
# Search Requests
# -----------------------------------------

class CatalogSearchRequest(BaseModel):
    q: str
    type: str = Field(default="all", description="artist, album, song, genre, or all")

    # These will typically come from PaginationParams in the controller
    # page: int = 1
    # page_size: int = 20

class CatalogFilterRequest(BaseModel):
    pass
    # Defined via Query params in individual controllers
