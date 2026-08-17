from pydantic import BaseModel, Field
from typing import Optional

class ConfidenceCategoryDTO(BaseModel):
    category: str = Field(..., description="High, Medium, Low")

class PredictionReliabilityDTO(BaseModel):
    score: float = Field(..., ge=0.0, le=1.0)
    status: str = Field("RELIABLE", description="RELIABLE, UNCERTAIN, UNRELIABLE")

class PredictionStabilityDTO(BaseModel):
    variance: float = 0.02
    stability_score: float = 0.95

class ConfidenceScoreDTO(BaseModel):
    overall_confidence: float = Field(..., ge=0.0, le=1.0, description="Normalized model confidence score")
    category: str = Field("High", description="High, Medium, Low")
    probability_margin: float = Field(..., description="Distance from 0.5 decision boundary")
    reliability: PredictionReliabilityDTO
    stability: PredictionStabilityDTO
