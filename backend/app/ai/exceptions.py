class AIPlatformException(Exception):
    """Base exception class for all Enterprise AI Platform errors."""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}

class FeatureNotFoundException(AIPlatformException):
    """Raised when a requested feature is not registered in the Feature Registry."""
    pass

class FeatureValidationException(AIPlatformException):
    """Raised when feature values fail validation checks (type, range, nullness, completeness)."""
    def __init__(self, message: str, validation_errors: list = None, details: dict = None):
        super().__init__(message, details)
        self.validation_errors = validation_errors or []

class PipelineExecutionException(AIPlatformException):
    """Raised when an error occurs during feature pipeline ingestion, transformation, or computation."""
    pass

class RegistryException(AIPlatformException):
    """Raised when an error occurs during feature or model registration, metadata update, or deprecation."""
    pass

class CacheException(AIPlatformException):
    """Raised when online feature cache operations (get, set, invalidate, batch) fail."""
    pass

# ----------------------------------------------------
# Phase 7C Machine Learning Platform Exceptions
# ----------------------------------------------------

class DatasetException(AIPlatformException):
    """Raised when dataset loading, splitting, scaling, or feature selection fails."""
    pass

class TrainingException(AIPlatformException):
    """Raised when model training, fitting, or optimization fails."""
    pass

class EvaluationException(AIPlatformException):
    """Raised when model evaluation metric calculation or calibration assessment fails."""
    pass

class SerializationException(AIPlatformException):
    """Raised when model artifact serialization, pickling, or save/load fails."""
    pass

class VersionException(AIPlatformException):
    """Raised when invalid model semantic versioning or version progression occurs."""
    pass

# ----------------------------------------------------
# Phase 7D AI Runtime Platform Exceptions
# ----------------------------------------------------

class InferenceException(AIPlatformException):
    """Raised when an error occurs during real-time or batch inference execution."""
    pass

class PredictionException(AIPlatformException):
    """Raised when single or batch prediction execution fails."""
    pass

class ModelNotLoadedException(AIPlatformException):
    """Raised when an inference request is routed to an un-instantiated or missing model."""
    pass

class PredictionValidationException(AIPlatformException):
    """Raised when input features or request payloads fail prediction pre-checks."""
    pass

class ExplainabilityException(AIPlatformException):
    """Raised when SHAP attribution or feature contribution calculation fails."""
    pass

class RecommendationException(AIPlatformException):
    """Raised when Next Best Action generation or recommendation prioritization fails."""
    pass

class BusinessRuleException(AIPlatformException):
    """Raised when business decision override rules evaluation fails."""
    pass
