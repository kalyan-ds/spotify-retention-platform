from typing import Dict, Any, List
from app.ai.constants import FeatureDataType
from app.ai.feature_store.definitions import FEATURE_CATALOG, FeatureDefinition
from app.ai.schemas import FeatureValidationResultDTO
from app.ai.exceptions import FeatureValidationException

class TypeValidator:
    """Validates feature value data type against definition."""
    @staticmethod
    def validate(val: Any, expected_type: FeatureDataType) -> bool:
        if val is None:
            return True
        if expected_type == FeatureDataType.FLOAT:
            return isinstance(val, (float, int)) and not isinstance(val, bool)
        elif expected_type == FeatureDataType.INT:
            return isinstance(val, int) and not isinstance(val, bool)
        elif expected_type == FeatureDataType.STRING:
            return isinstance(val, str)
        elif expected_type == FeatureDataType.BOOLEAN:
            return isinstance(val, bool)
        elif expected_type == FeatureDataType.LIST:
            return isinstance(val, (list, tuple))
        return True


class NullValidator:
    """Enforces null/missing value rules."""
    @staticmethod
    def validate(val: Any, allow_null: bool) -> bool:
        if not allow_null and val is None:
            return False
        return True


class RangeValidator:
    """Enforces minimum and maximum numeric boundaries."""
    @staticmethod
    def validate(val: Any, min_val: float = None, max_val: float = None) -> bool:
        if val is None or not isinstance(val, (int, float)) or isinstance(val, bool):
            return True
        if min_val is not None and val < min_val:
            return False
        if max_val is not None and val > max_val:
            return False
        return True


class CategoricalValidator:
    """Enforces allowed value set membership."""
    @staticmethod
    def validate(val: Any, allowed_values: List[Any] = None) -> bool:
        if val is None or not allowed_values:
            return True
        return val in allowed_values


class FeatureVectorValidator:
    """
    Master feature vector validator running type, range, nullness, categorical, and integrity checks.
    """
    def __init__(self, catalog: List[FeatureDefinition] = None):
        self.catalog_map: Dict[str, FeatureDefinition] = {
            f.name: f for f in (catalog or FEATURE_CATALOG)
        }

    def validate_vector(self, features: Dict[str, Any], strict: bool = True) -> FeatureValidationResultDTO:
        errors: List[str] = []
        warnings: List[str] = []
        passed = 0
        failed = 0

        for f_name, f_def in self.catalog_map.items():
            if f_name not in features:
                msg = f"Missing feature '{f_name}' in input vector."
                if strict:
                    errors.append(msg)
                    failed += 1
                else:
                    warnings.append(msg)
                continue

            val = features[f_name]
            rules = f_def.validation_rules

            # 1. Null check
            if not NullValidator.validate(val, rules.allow_null):
                errors.append(f"Feature '{f_name}' value '{val}' is Null, but allow_null=False.")
                failed += 1
                continue

            # 2. Type check
            if not TypeValidator.validate(val, f_def.data_type):
                errors.append(f"Feature '{f_name}' value '{val}' does not match expected type {f_def.data_type.value}.")
                failed += 1
                continue

            # 3. Range check
            if not RangeValidator.validate(val, rules.min_value, rules.max_value):
                errors.append(f"Feature '{f_name}' value '{val}' out of range [{rules.min_value}, {rules.max_value}].")
                failed += 1
                continue

            # 4. Categorical check
            if not CategoricalValidator.validate(val, rules.allowed_values):
                errors.append(f"Feature '{f_name}' value '{val}' not in allowed set {rules.allowed_values}.")
                failed += 1
                continue

            passed += 1

        is_valid = len(errors) == 0
        if strict and not is_valid:
            raise FeatureValidationException(
                message=f"Feature vector failed validation with {len(errors)} errors.",
                validation_errors=errors
            )

        return FeatureValidationResultDTO(
            is_valid=is_valid,
            total_features_validated=len(self.catalog_map),
            passed_count=passed,
            failed_count=failed,
            errors=errors,
            warnings=warnings
        )

feature_validator = FeatureVectorValidator()
