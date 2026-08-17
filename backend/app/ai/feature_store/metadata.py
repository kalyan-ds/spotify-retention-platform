from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
from app.ai.constants import FeatureGroup, FeatureDataType, RefreshFrequency
from app.ai.feature_store.definitions import FeatureDefinition, FEATURE_CATALOG
from app.ai.exceptions import FeatureNotFoundException

class FeatureMetadata(BaseModel):
    name: str
    group: FeatureGroup
    data_type: FeatureDataType
    description: str
    business_purpose: str
    source_table: str
    owner: str
    refresh_frequency: RefreshFrequency
    window_days: int
    default_value: Any
    version: str
    dependencies: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_deprecated: bool = False

class FeatureGroupSummary(BaseModel):
    group: FeatureGroup
    total_features: int
    active_features: int
    deprecated_features: int
    feature_names: List[str]

class FeatureMetadataManager:
    """
    Manages feature metadata, lineage graph, group taxonomy, and version history.
    """
    def __init__(self):
        self._metadata_store: Dict[str, FeatureMetadata] = {}
        self._bootstrap_catalog()

    def _bootstrap_catalog(self):
        for fdef in FEATURE_CATALOG:
            self._metadata_store[fdef.name] = FeatureMetadata(
                name=fdef.name,
                group=fdef.group,
                data_type=fdef.data_type,
                description=fdef.description,
                business_purpose=fdef.business_purpose,
                source_table=fdef.source_table,
                owner=fdef.owner,
                refresh_frequency=fdef.refresh_frequency,
                window_days=fdef.window_days,
                default_value=fdef.default_value,
                version=fdef.version,
                dependencies=fdef.dependencies,
                is_deprecated=fdef.is_deprecated
            )

    def get_metadata(self, feature_name: str) -> FeatureMetadata:
        if feature_name not in self._metadata_store:
            raise FeatureNotFoundException(f"Metadata for feature '{feature_name}' not found.")
        return self._metadata_store[feature_name]

    def list_all_metadata(self, include_deprecated: bool = False) -> List[FeatureMetadata]:
        if include_deprecated:
            return list(self._metadata_store.values())
        return [m for m in self._metadata_store.values() if not m.is_deprecated]

    def get_group_summary(self, group: FeatureGroup) -> FeatureGroupSummary:
        features = [m for m in self._metadata_store.values() if m.group == group]
        return FeatureGroupSummary(
            group=group,
            total_features=len(features),
            active_features=len([f for f in features if not f.is_deprecated]),
            deprecated_features=len([f for f in features if f.is_deprecated]),
            feature_names=[f.name for f in features]
        )

    def get_lineage(self, feature_name: str) -> Dict[str, Any]:
        meta = self.get_metadata(feature_name)
        return {
            "feature_name": meta.name,
            "group": meta.group.value,
            "source_table": meta.source_table,
            "dependencies": meta.dependencies,
            "version": meta.version,
            "refresh_frequency": meta.refresh_frequency.value
        }

feature_metadata_manager = FeatureMetadataManager()
