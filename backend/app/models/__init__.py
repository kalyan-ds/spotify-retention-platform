# app/models/__init__.py
from app.models.auth import Role, Permission, RolePermission, User, UserSession
from app.models.subscription import SubscriptionPlan, Subscription, PaymentHistory
from app.models.catalog import Artist, Genre, Album, Song, SongArtist, SongGenre
from app.models.playlist import Playlist, PlaylistTrack
from app.models.listening import Device, ListeningSession, ListeningHistory, SearchHistory, FavoriteSong, FavoriteArtist
from app.models.ml import ModelVersion, FeatureSnapshot, Prediction, PredictionHistory, PredictionExplanation, Recommendation, RecommendationHistory
from app.models.analytics import DailyMetric, WeeklyMetric, MonthlyMetric, DashboardCache, RetentionCohort
from app.models.system import Notification, ActivityLog, AuditLog, SystemSetting, UserPreference

# Re-exporting all models to easily import them into Alembic's env.py
__all__ = [
    "Role", "Permission", "RolePermission", "User", "UserSession",
    "SubscriptionPlan", "Subscription", "PaymentHistory",
    "Artist", "Genre", "Album", "Song", "SongArtist", "SongGenre",
    "Playlist", "PlaylistTrack",
    "Device", "ListeningSession", "ListeningHistory", "SearchHistory", "FavoriteSong", "FavoriteArtist",
    "ModelVersion", "FeatureSnapshot", "Prediction", "PredictionHistory", "PredictionExplanation", "Recommendation", "RecommendationHistory",
    "DailyMetric", "WeeklyMetric", "MonthlyMetric", "DashboardCache", "RetentionCohort",
    "Notification", "ActivityLog", "AuditLog", "SystemSetting", "UserPreference"
]
