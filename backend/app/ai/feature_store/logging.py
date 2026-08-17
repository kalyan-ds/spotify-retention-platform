import logging
import time
from typing import Dict, Any, Optional
from loguru import logger
from app.ai.config import ai_config

class FeatureStoreLogger:
    """
    Structured logging utility for feature store pipeline events, execution timing,
    validation auditing, and security sanitization.
    """

    @staticmethod
    def _sanitize(data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitizes sensitive information (PII, credentials, tokens) from log payloads."""
        if not data:
            return {}
        sanitized = {}
        sensitive_keys = {"password", "token", "jwt", "email", "credit_card", "secret"}
        for k, v in data.items():
            if any(sk in k.lower() for sk in sensitive_keys):
                sanitized[k] = "***REDACTED***"
            else:
                sanitized[k] = v
        return sanitized

    def log_pipeline_start(self, user_id: int, execution_id: str):
        logger.info(
            f"[FeatureStore] Pipeline Started | ExecutionID={execution_id} | UserID={user_id}"
        )

    def log_pipeline_success(
        self, user_id: int, execution_id: str, feature_count: int, duration_ms: float, is_cached: bool
    ):
        logger.info(
            f"[FeatureStore] Pipeline Success | ExecutionID={execution_id} | UserID={user_id} | "
            f"Features={feature_count} | Duration={duration_ms:.2f}ms | Cached={is_cached}"
        )

    def log_validation_error(self, execution_id: str, user_id: int, errors: list):
        logger.error(
            f"[FeatureStore] Validation Failed | ExecutionID={execution_id} | UserID={user_id} | "
            f"ErrorCount={len(errors)} | Errors={errors}"
        )

    def log_cache_event(self, user_id: int, is_hit: bool):
        event = "HIT" if is_hit else "MISS"
        logger.debug(f"[FeatureStore] Cache {event} | UserID={user_id}")

    def log_feature_registered(self, feature_name: str, group: str, version: str):
        logger.info(
            f"[FeatureStore] Feature Registered | Name='{feature_name}' | Group='{group}' | Version='{version}'"
        )

feature_store_logger = FeatureStoreLogger()
