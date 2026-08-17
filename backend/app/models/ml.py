from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, ForeignKey, DateTime, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional

from app.database.base import Base
from app.database.mixins import BaseEntityMixin


class ModelVersion(BaseEntityMixin, Base):
    __tablename__ = "model_versions"

    name: Mapped[str] = mapped_column(String(100), index=True)
    version: Mapped[str] = mapped_column(String(50), index=True)
    description: Mapped[Optional[str]] = mapped_column(String(2000))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    deployed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    predictions: Mapped[List["Prediction"]] = relationship("Prediction", back_populates="model_version")


class FeatureSnapshot(BaseEntityMixin, Base):
    __tablename__ = "feature_snapshots"

    prediction_id: Mapped[int] = mapped_column(ForeignKey("predictions.id"), unique=True)
    features: Mapped[dict] = mapped_column(JSON)

    # Relationships
    prediction: Mapped["Prediction"] = relationship("Prediction", back_populates="feature_snapshot")


class Prediction(BaseEntityMixin, Base):
    __tablename__ = "predictions"
    __table_args__ = (
        Index("idx_user_prediction_date", "user_id", "prediction_timestamp"),
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    model_version_id: Mapped[int] = mapped_column(ForeignKey("model_versions.id"))

    prediction_score: Mapped[float] = mapped_column(Float)
    retention_probability: Mapped[float] = mapped_column(Float)
    churn_probability: Mapped[float] = mapped_column(Float)
    risk_level: Mapped[str] = mapped_column(String(50), index=True) # Low, Medium, High
    confidence_score: Mapped[float] = mapped_column(Float)
    prediction_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)

    explainability_reference: Mapped[Optional[str]] = mapped_column(String(255))
    recommended_action: Mapped[Optional[str]] = mapped_column(String(255))

    # Monitoring Fields
    prediction_status: Mapped[str] = mapped_column(String(50)) # success, failed
    inference_duration_ms: Mapped[Optional[int]] = mapped_column(Integer)
    model_latency_ms: Mapped[Optional[int]] = mapped_column(Integer)
    prediction_source: Mapped[Optional[str]] = mapped_column(String(100)) # batch, realtime
    execution_environment: Mapped[Optional[str]] = mapped_column(String(100))
    prediction_trigger: Mapped[Optional[str]] = mapped_column(String(100))
    pipeline_version: Mapped[Optional[str]] = mapped_column(String(50))

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="predictions")
    model_version: Mapped["ModelVersion"] = relationship("ModelVersion", back_populates="predictions")
    feature_snapshot: Mapped[Optional["FeatureSnapshot"]] = relationship("FeatureSnapshot", back_populates="prediction", cascade="all, delete-orphan", uselist=False)
    history: Mapped[List["PredictionHistory"]] = relationship("PredictionHistory", back_populates="prediction")
    explanations: Mapped[List["PredictionExplanation"]] = relationship("PredictionExplanation", back_populates="prediction", cascade="all, delete-orphan")


class PredictionHistory(BaseEntityMixin, Base):
    __tablename__ = "prediction_history"

    prediction_id: Mapped[int] = mapped_column(ForeignKey("predictions.id"), index=True)
    archived_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    snapshot_data: Mapped[dict] = mapped_column(JSON) # Store historical state of the prediction

    # Relationships
    prediction: Mapped["Prediction"] = relationship("Prediction", back_populates="history")


class PredictionExplanation(BaseEntityMixin, Base):
    __tablename__ = "prediction_explanations"

    prediction_id: Mapped[int] = mapped_column(ForeignKey("predictions.id"), index=True)
    feature_name: Mapped[str] = mapped_column(String(100))
    feature_importance: Mapped[float] = mapped_column(Float)
    impact_direction: Mapped[str] = mapped_column(String(50)) # positive, negative, neutral
    importance_rank: Mapped[int] = mapped_column(Integer)
    contribution_score: Mapped[float] = mapped_column(Float)
    normalized_score: Mapped[float] = mapped_column(Float)
    generated_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    visualization_color: Mapped[Optional[str]] = mapped_column(String(50))
    display_order: Mapped[int] = mapped_column(Integer)

    # Relationships
    prediction: Mapped["Prediction"] = relationship("Prediction", back_populates="explanations")


class Recommendation(BaseEntityMixin, Base):
    __tablename__ = "recommendations"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    song_id: Mapped[int] = mapped_column(ForeignKey("songs.id"))

    recommendation_score: Mapped[float] = mapped_column(Float)
    algorithm_name: Mapped[str] = mapped_column(String(100))
    algorithm_version: Mapped[Optional[str]] = mapped_column(String(50))
    generated_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    reason: Mapped[Optional[str]] = mapped_column(String(255))

    recommendation_rank: Mapped[Optional[int]] = mapped_column(Integer)

    # Interactions
    accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    rejected: Mapped[bool] = mapped_column(Boolean, default=False)
    clicked: Mapped[bool] = mapped_column(Boolean, default=False)
    skipped: Mapped[bool] = mapped_column(Boolean, default=False)
    played: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="recommendations")
    song: Mapped["Song"] = relationship("Song")
    history: Mapped[List["RecommendationHistory"]] = relationship("RecommendationHistory", back_populates="recommendation")


class RecommendationHistory(BaseEntityMixin, Base):
    __tablename__ = "recommendation_history"

    recommendation_id: Mapped[int] = mapped_column(ForeignKey("recommendations.id"), index=True)
    archived_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    historical_state: Mapped[dict] = mapped_column(JSON)

    # Relationships
    recommendation: Mapped["Recommendation"] = relationship("Recommendation", back_populates="history")
