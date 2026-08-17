from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional

class AIConfig(BaseSettings):
    """
    Centralized configuration for the Enterprise AI Data Engineering & Feature Store layer.
    """
    # Online Cache Settings
    FEATURE_CACHE_TTL_SECONDS: int = Field(3600, description="Online Redis feature cache TTL in seconds")
    FEATURE_CACHE_ENABLED: bool = Field(True, description="Master toggle for online feature caching")
    REDIS_URL: Optional[str] = Field("redis://localhost:6379/0", description="Redis connection string for online feature store")

    # Pipeline Execution Settings
    PIPELINE_BATCH_SIZE: int = Field(500, description="Batch chunk size for bulk feature extraction")
    PIPELINE_MAX_WORKERS: int = Field(4, description="Parallel worker count for feature computation")
    PIPELINE_TIMEOUT_SECONDS: int = Field(30, description="Max execution timeout per user feature vector computation")

    # Feature Validation Settings
    VALIDATION_STRICTNESS: str = Field("STRICT", description="Validation mode: STRICT, WARNING, or PERMISSIVE")
    ALLOW_NULL_FEATURES: bool = Field(False, description="Whether null values are tolerated after transformation")

    # Offline Persistence Settings
    OFFLINE_STORE_ENABLED: bool = Field(True, description="Whether to persist feature vectors to PostgreSQL feature_snapshots")
    OFFLINE_SNAPSHOT_RETENTION_DAYS: int = Field(90, description="Days to retain historical feature vector snapshots")

    # Logging & Monitoring
    STRUCTURED_LOGGING_ENABLED: bool = Field(True, description="Enable JSON structured logging for feature store events")
    LOG_LEVEL: str = Field("INFO", description="Feature store logging level")

    class Config:
        env_prefix = "AI_FEATURE_STORE_"
        case_sensitive = True

ai_config = AIConfig()
