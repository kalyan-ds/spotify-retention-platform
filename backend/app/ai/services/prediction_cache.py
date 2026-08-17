import time
from typing import Dict, Any, Optional, List
from app.ai.config import ai_config

class PredictionCache:
    """
    Sub-10ms Redis-ready Prediction Cache abstraction.
    Caches prediction responses, SHAP explanations, and Next Best Action feeds.
    """

    def __init__(self, ttl_seconds: int = 1800):
        self.ttl_seconds = ttl_seconds
        self._store: Dict[str, Dict[str, Any]] = {}
        self._hits = 0
        self._misses = 0

    def _make_key(self, user_id: int, model_key: str) -> str:
        return f"pred_cache:{model_key}:user:{user_id}"

    def get_prediction(self, user_id: int, model_key: str = "churn") -> Optional[Dict[str, Any]]:
        key = self._make_key(user_id, model_key)
        if key in self._store:
            entry = self._store[key]
            if time.time() < entry["expires_at"]:
                self._hits += 1
                return entry["data"]
            else:
                del self._store[key]

        self._misses += 1
        return None

    def set_prediction(self, user_id: int, model_key: str, data: Dict[str, Any], ttl: Optional[int] = None) -> bool:
        key = self._make_key(user_id, model_key)
        exp = time.time() + (ttl or self.ttl_seconds)
        self._store[key] = {
            "data": data,
            "expires_at": exp,
            "cached_at": time.time()
        }
        return True

    def invalidate(self, user_id: int, model_key: str = "churn") -> bool:
        key = self._make_key(user_id, model_key)
        if key in self._store:
            del self._store[key]
            return True
        return False

    def get_stats(self) -> Dict[str, Any]:
        total = self._hits + self._misses
        hit_rate = (self._hits / total) * 100.0 if total > 0 else 0.0
        return {
            "hits": self._hits,
            "misses": self._misses,
            "total_requests": total,
            "hit_rate_percentage": round(hit_rate, 2),
            "cached_entries_count": len(self._store)
        }

prediction_cache = PredictionCache()
