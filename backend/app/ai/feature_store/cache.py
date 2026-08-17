import time
from typing import Dict, Any, List, Optional
from app.ai.config import ai_config
from app.ai.schemas import FeatureVectorDTO
from app.ai.exceptions import CacheException

class OnlineFeatureCache:
    """
    Online Feature Store abstraction supporting Redis-ready caching, sub-10ms feature vector lookup,
    TTL expiration, batch retrieval, and cache invalidation.
    """
    def __init__(self, ttl_seconds: int = None):
        self.ttl_seconds = ttl_seconds or ai_config.FEATURE_CACHE_TTL_SECONDS
        self._memory_store: Dict[str, Dict[str, Any]] = {}
        self._hits = 0
        self._misses = 0

    def _make_key(self, user_id: int) -> str:
        return f"feature_vector:user:{user_id}"

    def get_feature_vector(self, user_id: int) -> Optional[Dict[str, Any]]:
        if not ai_config.FEATURE_CACHE_ENABLED:
            return None

        key = self._make_key(user_id)
        if key in self._memory_store:
            entry = self._memory_store[key]
            if time.time() < entry["expires_at"]:
                self._hits += 1
                return entry["data"]
            else:
                del self._memory_store[key]

        self._misses += 1
        return None

    def set_feature_vector(self, user_id: int, features: Dict[str, Any], ttl_seconds: int = None) -> bool:
        if not ai_config.FEATURE_CACHE_ENABLED:
            return False

        try:
            ttl = ttl_seconds or self.ttl_seconds
            key = self._make_key(user_id)
            self._memory_store[key] = {
                "data": features,
                "expires_at": time.time() + ttl,
                "cached_at": time.time()
            }
            return True
        except Exception as e:
            raise CacheException(f"Failed to cache feature vector for user {user_id}: {str(e)}")

    def invalidate_user_cache(self, user_id: int) -> bool:
        key = self._make_key(user_id)
        if key in self._memory_store:
            del self._memory_store[key]
            return True
        return False

    def get_batch_feature_vectors(self, user_ids: List[int]) -> Dict[int, Optional[Dict[str, Any]]]:
        results = {}
        for uid in user_ids:
            results[uid] = self.get_feature_vector(uid)
        return results

    def get_cache_stats(self) -> Dict[str, Any]:
        total = self._hits + self._misses
        hit_rate = (self._hits / total) if total > 0 else 0.0
        return {
            "hits": self._hits,
            "misses": self._misses,
            "total_requests": total,
            "hit_rate_percentage": round(hit_rate * 100, 2),
            "cached_users_count": len(self._memory_store)
        }

online_feature_cache = OnlineFeatureCache()
