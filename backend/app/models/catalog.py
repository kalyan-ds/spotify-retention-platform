from datetime import date, datetime
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional

from app.database.base import Base
from app.database.mixins import BaseEntityMixin


class Artist(BaseEntityMixin, Base):
    __tablename__ = "artists"

    name: Mapped[str] = mapped_column(String(255), index=True)
    bio: Mapped[Optional[str]] = mapped_column(String(2000))
    country: Mapped[Optional[str]] = mapped_column(String(50))

    # Relationships
    albums: Mapped[List["Album"]] = relationship("Album", back_populates="artist")
    song_artists: Mapped[List["SongArtist"]] = relationship("SongArtist", back_populates="artist")


class Genre(BaseEntityMixin, Base):
    __tablename__ = "genres"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255))

    # Relationships
    song_genres: Mapped[List["SongGenre"]] = relationship("SongGenre", back_populates="genre")


class Album(BaseEntityMixin, Base):
    __tablename__ = "albums"

    title: Mapped[str] = mapped_column(String(255), index=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"), index=True)
    release_date: Mapped[Optional[date]] = mapped_column(Date, index=True)
    album_type: Mapped[Optional[str]] = mapped_column(String(50)) # album, single, compilation
    total_tracks: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    artist: Mapped["Artist"] = relationship("Artist", back_populates="albums")
    songs: Mapped[List["Song"]] = relationship("Song", back_populates="album")


class Song(BaseEntityMixin, Base):
    __tablename__ = "songs"

    title: Mapped[str] = mapped_column(String(255), index=True)
    album_id: Mapped[int] = mapped_column(ForeignKey("albums.id"), index=True)
    duration_ms: Mapped[int] = mapped_column(Integer)
    release_date: Mapped[Optional[date]] = mapped_column(Date, index=True)
    track_number: Mapped[Optional[int]] = mapped_column(Integer)
    is_explicit: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    album: Mapped["Album"] = relationship("Album", back_populates="songs")
    song_artists: Mapped[List["SongArtist"]] = relationship("SongArtist", back_populates="song")
    song_genres: Mapped[List["SongGenre"]] = relationship("SongGenre", back_populates="song")


class SongArtist(Base):
    __tablename__ = "song_artists"

    song_id: Mapped[int] = mapped_column(ForeignKey("songs.id"), primary_key=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"), primary_key=True)

    artist_role: Mapped[str] = mapped_column(String(100), default="Main Artist")
    contribution_percentage: Mapped[Optional[float]] = mapped_column(Float)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    verified_collaboration: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    song: Mapped["Song"] = relationship("Song", back_populates="song_artists")
    artist: Mapped["Artist"] = relationship("Artist", back_populates="song_artists")


class SongGenre(Base):
    __tablename__ = "song_genres"

    song_id: Mapped[int] = mapped_column(ForeignKey("songs.id"), primary_key=True)
    genre_id: Mapped[int] = mapped_column(ForeignKey("genres.id"), primary_key=True)

    # Relationships
    song: Mapped["Song"] = relationship("Song", back_populates="song_genres")
    genre: Mapped["Genre"] = relationship("Genre", back_populates="song_genres")


# Aliases for legacy repository imports
song_artists = SongArtist.__table__
song_genres = SongGenre.__table__
playlist_songs = None
