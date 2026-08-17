from typing import Dict, List, Optional
from app.ai.constants import FeatureGroup, FeatureDataType
from app.ai.feature_store.definitions import FeatureDefinition, FEATURE_CATALOG
from app.ai.exceptions import FeatureNotFoundException, RegistryException

class FeatureRegistry:
    """
    Central Feature Registry managing registration, metadata update, deprecation, lookup, and search.
    """
    def __init__(self):
        self._registry: Dict[str, FeatureDefinition] = {}
        self._initialize_default_catalog()

    def _initialize_default_catalog(self):
        for fdef in FEATURE_CATALOG:
            self._registry[fdef.name] = fdef

    def register_feature(self, feature_def: FeatureDefinition) -> FeatureDefinition:
        if feature_def.name in self._registry and not self._registry[feature_def.name].is_deprecated:
            raise RegistryException(f"Feature '{feature_def.name}' is already registered in the Feature Registry.")
        self._registry[feature_def.name] = feature_def
        return feature_def

    def update_feature(self, name: str, updates: dict) -> FeatureDefinition:
        if name not in self._registry:
            raise FeatureNotFoundException(f"Cannot update feature '{name}': Not found in registry.")
        existing = self._registry[name]
        updated_data = existing.model_dump()
        updated_data.update(updates)
        updated_def = FeatureDefinition(**updated_data)
        self._registry[name] = updated_def
        return updated_def

    def deprecate_feature(self, name: str) -> FeatureDefinition:
        if name not in self._registry:
            raise FeatureNotFoundException(f"Cannot deprecate feature '{name}': Not found in registry.")
        self._registry[name].is_deprecated = True
        return self._registry[name]

    def get_feature(self, name: str) -> FeatureDefinition:
        if name not in self._registry:
            raise FeatureNotFoundException(f"Feature '{name}' is not registered in the Feature Registry.")
        return self._registry[name]

    def search_features(
        self,
        query: Optional[str] = None,
        group: Optional[FeatureGroup] = None,
        data_type: Optional[FeatureDataType] = None,
        include_deprecated: bool = False
    ) -> List[FeatureDefinition]:
        results = []
        for fdef in self._registry.values():
            if not include_deprecated and fdef.is_deprecated:
                continue
            if group and fdef.group != group:
                continue
            if data_type and fdef.data_type != data_type:
                continue
            if query:
                q_lower = query.lower()
                matches_name = q_lower in fdef.name.lower()
                matches_desc = q_lower in fdef.description.lower()
                matches_purpose = q_lower in fdef.business_purpose.lower()
                if not (matches_name or matches_desc or matches_purpose):
                    continue
            results.append(fdef)
        return results

    def get_catalog(self, include_deprecated: bool = False) -> List[FeatureDefinition]:
        if include_deprecated:
            return list(self._registry.values())
        return [f for f in self._registry.values() if not f.is_deprecated]

    def get_feature_names(self, include_deprecated: bool = False) -> List[str]:
        return [f.name for f in self.get_catalog(include_deprecated=include_deprecated)]

feature_registry = FeatureRegistry()
