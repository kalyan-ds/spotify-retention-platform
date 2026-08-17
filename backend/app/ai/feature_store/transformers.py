import math
from typing import List, Dict, Any, Union, Optional
from datetime import datetime, date

class BaseFeatureTransformer:
    """Abstract base transformer interface."""
    def fit(self, data: List[Any]) -> "BaseFeatureTransformer":
        return self

    def transform(self, data: List[Any]) -> List[Any]:
        raise NotImplementedError

    def fit_transform(self, data: List[Any]) -> List[Any]:
        return self.fit(data).transform(data)


class StandardScalerTransformer(BaseFeatureTransformer):
    """Z-score standardization: (x - mean) / std_dev"""
    def __init__(self):
        self.mean: float = 0.0
        self.std: float = 1.0

    def fit(self, data: List[Union[int, float]]) -> "StandardScalerTransformer":
        clean_data = [float(x) for x in data if x is not None]
        if not clean_data:
            return self
        self.mean = sum(clean_data) / len(clean_data)
        variance = sum((x - self.mean) ** 2 for x in clean_data) / len(clean_data)
        self.std = math.sqrt(variance) if variance > 0 else 1.0
        return self

    def transform(self, data: List[Union[int, float]]) -> List[float]:
        return [(float(x) - self.mean) / self.std if x is not None else 0.0 for x in data]


class MinMaxScalerTransformer(BaseFeatureTransformer):
    """Min-Max scaling to range [feature_min, feature_max]"""
    def __init__(self, feature_range: tuple = (0.0, 1.0)):
        self.min_val: float = 0.0
        self.max_val: float = 1.0
        self.target_min, self.target_max = feature_range

    def fit(self, data: List[Union[int, float]]) -> "MinMaxScalerTransformer":
        clean_data = [float(x) for x in data if x is not None]
        if not clean_data:
            return self
        self.min_val = min(clean_data)
        self.max_val = max(clean_data)
        return self

    def transform(self, data: List[Union[int, float]]) -> List[float]:
        denom = (self.max_val - self.min_val) if self.max_val != self.min_val else 1.0
        scale = (self.target_max - self.target_min) / denom
        return [
            ((float(x) - self.min_val) * scale) + self.target_min if x is not None else self.target_min
            for x in data
        ]


class OneHotEncoderTransformer(BaseFeatureTransformer):
    """One-Hot Encoding for categorical features."""
    def __init__(self, categories: Optional[List[str]] = None):
        self.categories: List[str] = categories or []

    def fit(self, data: List[str]) -> "OneHotEncoderTransformer":
        if not self.categories:
            self.categories = sorted(list(set(str(x) for x in data if x is not None)))
        return self

    def transform(self, data: List[str]) -> List[Dict[str, int]]:
        result = []
        for item in data:
            item_str = str(item) if item is not None else ""
            encoded = {f"cat_{cat}": 1 if item_str == cat else 0 for cat in self.categories}
            result.append(encoded)
        return result


class OrdinalEncoderTransformer(BaseFeatureTransformer):
    """Ordinal integer mapping for ordered categorical categories."""
    def __init__(self, mapping: Dict[str, int]):
        self.mapping = mapping

    def transform(self, data: List[str]) -> List[int]:
        return [self.mapping.get(str(x), 0) for x in data]


class FrequencyEncoderTransformer(BaseFeatureTransformer):
    """Encodes categories by their occurrence frequency ratio."""
    def __init__(self):
        self.frequencies: Dict[str, float] = {}

    def fit(self, data: List[str]) -> "FrequencyEncoderTransformer":
        clean = [str(x) for x in data if x is not None]
        total = len(clean) if clean else 1
        counts: Dict[str, int] = {}
        for item in clean:
            counts[item] = counts.get(item, 0) + 1
        self.frequencies = {k: v / total for k, v in counts.items()}
        return self

    def transform(self, data: List[str]) -> List[float]:
        return [self.frequencies.get(str(x), 0.0) for x in data]


class BooleanTransformer(BaseFeatureTransformer):
    """Converts boolean or truthy values to 1.0 or 0.0."""
    def transform(self, data: List[Any]) -> List[float]:
        return [1.0 if bool(x) else 0.0 for x in data]


class DateDiffTransformer(BaseFeatureTransformer):
    """Computes days elapsed between a date value and a reference date (default: today)."""
    def __init__(self, reference_date: Optional[Union[datetime, date]] = None):
        self.reference_date = reference_date or datetime.utcnow()

    def transform(self, data: List[Union[datetime, date, str]]) -> List[int]:
        results = []
        ref_dt = self.reference_date if isinstance(self.reference_date, datetime) else datetime.combine(self.reference_date, datetime.min.time())
        for d in data:
            if d is None:
                results.append(0)
                continue
            if isinstance(d, str):
                try:
                    d = datetime.fromisoformat(d)
                except ValueError:
                    results.append(0)
                    continue
            if isinstance(d, date) and not isinstance(d, datetime):
                d = datetime.combine(d, datetime.min.time())
            diff = (ref_dt - d).days
            results.append(max(0, diff))
        return results


class RollingStatsTransformer:
    """Computes rolling statistical aggregations over sliding numeric windows."""
    @staticmethod
    def compute_stats(values: List[Union[int, float]]) -> Dict[str, float]:
        clean = [float(v) for v in values if v is not None]
        if not clean:
            return {"mean": 0.0, "std": 0.0, "min": 0.0, "max": 0.0, "sum": 0.0}
        n = len(clean)
        mean_val = sum(clean) / n
        variance = sum((x - mean_val) ** 2 for x in clean) / n
        std_val = math.sqrt(variance)
        return {
            "mean": round(mean_val, 4),
            "std": round(std_val, 4),
            "min": round(min(clean), 4),
            "max": round(max(clean), 4),
            "sum": round(sum(clean), 4)
        }


class TimeWindowAggregator:
    """Aggregates raw event records into time-windowed numeric metrics."""
    @staticmethod
    def aggregate_window(events: List[Dict[str, Any]], timestamp_field: str, value_field: str, window_days: int) -> float:
        now = datetime.utcnow()
        total = 0.0
        for ev in events:
            ts = ev.get(timestamp_field)
            val = ev.get(value_field, 0.0)
            if isinstance(ts, str):
                try:
                    ts = datetime.fromisoformat(ts)
                except ValueError:
                    continue
            if isinstance(ts, (datetime, date)):
                if isinstance(ts, date) and not isinstance(ts, datetime):
                    ts = datetime.combine(ts, datetime.min.time())
                days_old = (now - ts).days
                if days_old <= window_days:
                    total += float(val)
        return total
