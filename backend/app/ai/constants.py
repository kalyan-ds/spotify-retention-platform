from enum import Enum

class FeatureGroup(str, Enum):
    BEHAVIOR = "Behavior"
    ENGAGEMENT = "Engagement"
    SUBSCRIPTION = "Subscription"
    FINANCIAL = "Financial"
    RECOMMENDATION = "Recommendation"
    DEVICE = "Device"
    DEMOGRAPHIC = "Demographic"
    MUSIC_PREFERENCE = "Music Preference"
    TEMPORAL = "Temporal"
    PLATFORM = "Platform"

class FeatureDataType(str, Enum):
    FLOAT = "Float"
    INT = "Int"
    STRING = "String"
    BOOLEAN = "Boolean"
    DATETIME = "DateTime"
    LIST = "List"

class RefreshFrequency(str, Enum):
    REALTIME = "Realtime"
    HOURLY = "Hourly"
    DAILY = "Daily"
    WEEKLY = "Weekly"

DEFAULT_FEATURE_OWNER = "ML_DATA_ENGINEERING_TEAM"
FEATURE_STORE_VERSION = "v1.0.0"
MAX_FEATURE_NAME_LENGTH = 128
