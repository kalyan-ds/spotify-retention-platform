import hashlib
import json
import math
from typing import Dict, Any, List
from datetime import datetime, date

def hash_feature_vector(features: Dict[str, Any]) -> str:
    """Computes a deterministic SHA-256 fingerprint hash of a feature vector dictionary."""
    sorted_dict = {k: features[k] for k in sorted(features.keys())}
    encoded = json.dumps(sorted_dict, sort_keys=True, default=str).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()

def days_between(d1: datetime, d2: datetime) -> int:
    """Returns absolute days between two datetime objects."""
    if isinstance(d1, date) and not isinstance(d1, datetime):
        d1 = datetime.combine(d1, datetime.min.time())
    if isinstance(d2, date) and not isinstance(d2, datetime):
        d2 = datetime.combine(d2, datetime.min.time())
    return abs((d1 - d2).days)

def compute_mean(values: List[float]) -> float:
    clean = [v for v in values if v is not None]
    if not clean:
        return 0.0
    return sum(clean) / len(clean)

def compute_std(values: List[float]) -> float:
    clean = [v for v in values if v is not None]
    if len(clean) < 2:
        return 0.0
    mean_val = compute_mean(clean)
    variance = sum((x - mean_val) ** 2 for x in clean) / len(clean)
    return math.sqrt(variance)

def min_max_norm(val: float, min_val: float, max_val: float) -> float:
    if max_val == min_val:
        return 0.0
    scaled = (val - min_val) / (max_val - min_val)
    return max(0.0, min(1.0, scaled))
