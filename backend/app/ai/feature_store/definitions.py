from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from app.ai.constants import FeatureGroup, FeatureDataType, RefreshFrequency, DEFAULT_FEATURE_OWNER

class FeatureValidationRule(BaseModel):
    allow_null: bool = False
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    allowed_values: Optional[List[Any]] = None
    regex_pattern: Optional[str] = None

class FeatureDefinition(BaseModel):
    name: str = Field(..., description="Unique feature name e.g., avg_session_duration_30d")
    group: FeatureGroup = Field(..., description="Category group e.g., Engagement, Behavior, Subscription")
    data_type: FeatureDataType = Field(..., description="Data type: Float, Int, String, Boolean, DateTime, List")
    description: str = Field(..., description="Detailed description of what this feature represents")
    business_purpose: str = Field(..., description="Business rationale for ML model inclusion")
    source_table: str = Field("listening_sessions", description="Origin database table")
    owner: str = Field(DEFAULT_FEATURE_OWNER, description="Feature owner team")
    refresh_frequency: RefreshFrequency = Field(RefreshFrequency.DAILY, description="Refresh interval")
    window_days: int = Field(30, description="Aggregation time window in days")
    default_value: Any = Field(0, description="Fallback value if data is missing")
    validation_rules: FeatureValidationRule = Field(default_factory=FeatureValidationRule)
    version: str = Field("v1.0.0", description="Semantic feature schema version")
    dependencies: List[str] = Field(default_factory=list, description="Upstream feature dependencies")
    is_deprecated: bool = Field(False, description="Deprecation status flag")

FEATURE_CATALOG: List[FeatureDefinition] = [
    # ----------------------------------------------------
    # 1. Behavior Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="skip_rate_30d",
        group=FeatureGroup.BEHAVIOR,
        data_type=FeatureDataType.FLOAT,
        window_days=30,
        description="Percentage of tracks skipped before 30 seconds duration over trailing 30 days",
        business_purpose="High skip rates strongly indicate content dissatisfaction and impending churn",
        source_table="listening_events",
        default_value=0.10,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=1.0)
    ),
    FeatureDefinition(
        name="completion_rate_30d",
        group=FeatureGroup.BEHAVIOR,
        data_type=FeatureDataType.FLOAT,
        window_days=30,
        description="Percentage of tracks played to >90% duration over trailing 30 days",
        business_purpose="Measures listening satisfaction and deep content engagement",
        source_table="listening_events",
        default_value=0.75,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=1.0)
    ),
    FeatureDefinition(
        name="repeat_listen_rate_30d",
        group=FeatureGroup.BEHAVIOR,
        data_type=FeatureDataType.FLOAT,
        window_days=30,
        description="Ratio of repeated song plays to total plays over trailing 30 days",
        business_purpose="High repeat listening indicates favorite content attachment and loyalty",
        source_table="listening_events",
        default_value=0.35,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=1.0)
    ),
    FeatureDefinition(
        name="playlist_interaction_count_30d",
        group=FeatureGroup.BEHAVIOR,
        data_type=FeatureDataType.INT,
        window_days=30,
        description="Count of playlist creation, editing, or saving actions over trailing 30 days",
        business_purpose="Curatorial playlist creation is a key sticky retention habit",
        source_table="user_playlist_actions",
        default_value=5,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=10000)
    ),
    FeatureDefinition(
        name="search_activity_count_30d",
        group=FeatureGroup.BEHAVIOR,
        data_type=FeatureDataType.INT,
        window_days=30,
        description="Count of search queries executed over trailing 30 days",
        business_purpose="Active intent search indicates high ongoing musical curiosity",
        source_table="search_logs",
        default_value=12,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=5000)
    ),

    # ----------------------------------------------------
    # 2. Engagement Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="avg_session_duration_30d",
        group=FeatureGroup.ENGAGEMENT,
        data_type=FeatureDataType.FLOAT,
        window_days=30,
        description="Average continuous listening session duration in minutes over trailing 30 days",
        business_purpose="Primary indicator of active platform usage and habit strength",
        source_table="user_sessions",
        default_value=25.0,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=1440.0)
    ),
    FeatureDefinition(
        name="weekly_sessions_count",
        group=FeatureGroup.ENGAGEMENT,
        data_type=FeatureDataType.INT,
        window_days=7,
        description="Count of active listening sessions over trailing 7 days",
        business_purpose="Frequent weekly touchpoints reduce churn probability by >40%",
        source_table="user_sessions",
        default_value=8,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=500)
    ),
    FeatureDefinition(
        name="monthly_sessions_count",
        group=FeatureGroup.ENGAGEMENT,
        data_type=FeatureDataType.INT,
        window_days=30,
        description="Count of active listening sessions over trailing 30 days",
        business_purpose="Used for monthly user active cohort segmentation",
        source_table="user_sessions",
        default_value=32,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=2000)
    ),
    FeatureDefinition(
        name="dau_mau_ratio_7d",
        group=FeatureGroup.ENGAGEMENT,
        data_type=FeatureDataType.FLOAT,
        window_days=7,
        description="Active day frequency ratio (DAU/MAU) over trailing 7 days",
        business_purpose="Standard executive metric for product stickiness",
        source_table="daily_metrics",
        default_value=0.40,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=1.0)
    ),
    FeatureDefinition(
        name="dormancy_days",
        group=FeatureGroup.ENGAGEMENT,
        data_type=FeatureDataType.INT,
        window_days=90,
        description="Days elapsed since the user's last recorded listening session",
        business_purpose="Dormancy > 14 days is the single strongest precursor to churn",
        source_table="user_sessions",
        default_value=1,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=365)
    ),

    # ----------------------------------------------------
    # 3. Subscription Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="tenure_months",
        group=FeatureGroup.SUBSCRIPTION,
        data_type=FeatureDataType.INT,
        window_days=365,
        description="Total continuous Spotify Premium tenure in months",
        business_purpose="Longer tenure correlates strongly with higher baseline customer lifetime value",
        source_table="subscriptions",
        default_value=12,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=240)
    ),
    FeatureDefinition(
        name="subscription_age_days",
        group=FeatureGroup.SUBSCRIPTION,
        data_type=FeatureDataType.INT,
        window_days=365,
        description="Days elapsed since initial account registration",
        business_purpose="Differentiates brand-new trial users from mature account holders",
        source_table="users",
        default_value=365,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=10000)
    ),
    FeatureDefinition(
        name="upgrade_history_count",
        group=FeatureGroup.SUBSCRIPTION,
        data_type=FeatureDataType.INT,
        window_days=365,
        description="Count of plan upgrades (e.g., Free to Individual, Individual to Duo/Family)",
        business_purpose="Upgraded plan users have significantly higher retention rates",
        source_table="subscription_history",
        default_value=1,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=20)
    ),

    # ----------------------------------------------------
    # 4. Financial Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="payment_failure_count_90d",
        group=FeatureGroup.FINANCIAL,
        data_type=FeatureDataType.INT,
        window_days=90,
        description="Count of failed credit card or payment authorization attempts in trailing 90 days",
        business_purpose="Involuntary churn driver requiring immediate automated retry interventions",
        source_table="payment_logs",
        default_value=0,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=50)
    ),
    FeatureDefinition(
        name="customer_lifetime_value",
        group=FeatureGroup.FINANCIAL,
        data_type=FeatureDataType.FLOAT,
        window_days=365,
        description="Predicted revenue contribution ($ USD) over the customer lifetime horizon",
        business_purpose="Prioritizes high-value retention interventions for executive CSM teams",
        source_table="financial_metrics",
        default_value=119.88,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=10000.0)
    ),

    # ----------------------------------------------------
    # 5. Recommendation Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="recommendation_acceptance_rate",
        group=FeatureGroup.RECOMMENDATION,
        data_type=FeatureDataType.FLOAT,
        window_days=30,
        description="Ratio of recommended songs clicked or played over recommended songs presented",
        business_purpose="Evaluates algorithmic relevance and personal preference alignment",
        source_table="recommendations",
        default_value=0.62,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=1.0)
    ),

    # ----------------------------------------------------
    # 6. Device Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="device_diversity_count",
        group=FeatureGroup.DEVICE,
        data_type=FeatureDataType.INT,
        window_days=30,
        description="Count of distinct devices (Mobile, Desktop, Smart Speaker, Car, TV) used",
        business_purpose="Multi-device users exhibit 3x higher 12-month retention rates",
        source_table="user_devices",
        default_value=2,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=1, max_value=20)
    ),

    # ----------------------------------------------------
    # 7. Demographic Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="user_demographic_segment",
        group=FeatureGroup.DEMOGRAPHIC,
        data_type=FeatureDataType.STRING,
        window_days=365,
        description="Categorical demographic cohort (e.g., Gen_Z_Student, Urban_Professional, Family_Admin)",
        business_purpose="Guides personalized plan recommendations and contextual campaign messaging",
        source_table="users",
        default_value="Urban_Professional",
        validation_rules=FeatureValidationRule(allow_null=False, allowed_values=["Gen_Z_Student", "Urban_Professional", "Family_Admin", "Standard_Premium"])
    ),

    # ----------------------------------------------------
    # 8. Music Preference Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="genre_diversity_count",
        group=FeatureGroup.MUSIC_PREFERENCE,
        data_type=FeatureDataType.INT,
        window_days=30,
        description="Count of distinct music genres listened to over trailing 30 days",
        business_purpose="Genre breadth reflects deep catalog exploration and platform dependency",
        source_table="listening_events",
        default_value=8,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=1, max_value=500)
    ),
    FeatureDefinition(
        name="artist_diversity_count",
        group=FeatureGroup.MUSIC_PREFERENCE,
        data_type=FeatureDataType.INT,
        window_days=7,
        description="Count of unique artists played over trailing 7 days",
        business_purpose="High weekly artist diversity indicates healthy discovery behavior",
        source_table="listening_events",
        default_value=42,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=1, max_value=2000)
    ),

    # ----------------------------------------------------
    # 9. Temporal Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="time_of_day_listening_peak",
        group=FeatureGroup.TEMPORAL,
        data_type=FeatureDataType.STRING,
        window_days=30,
        description="Primary listening period: Morning_Commute, Afternoon_Work, Evening_Relax, Night_Owl",
        business_purpose="Powers temporal-aware push notification timing",
        source_table="listening_events",
        default_value="Afternoon_Work",
        validation_rules=FeatureValidationRule(allow_null=False, allowed_values=["Morning_Commute", "Afternoon_Work", "Evening_Relax", "Night_Owl"])
    ),
    FeatureDefinition(
        name="weekend_activity_ratio",
        group=FeatureGroup.TEMPORAL,
        data_type=FeatureDataType.FLOAT,
        window_days=30,
        description="Ratio of Saturday/Sunday listening hours to total weekly listening hours",
        business_purpose="Helps identify leisure-focused vs commute-focused user routines",
        source_table="listening_events",
        default_value=0.28,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=1.0)
    ),
    FeatureDefinition(
        name="retention_trend_score",
        group=FeatureGroup.TEMPORAL,
        data_type=FeatureDataType.FLOAT,
        window_days=30,
        description="Sliding linear slope (-1.0 to +1.0) of 30-day listening velocity trajectory",
        business_purpose="Detects early engagement drops before absolute churn thresholds are breached",
        source_table="daily_metrics",
        default_value=0.15,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=-1.0, max_value=1.0)
    ),

    # ----------------------------------------------------
    # 10. Platform Features
    # ----------------------------------------------------
    FeatureDefinition(
        name="feature_breadth_score",
        group=FeatureGroup.PLATFORM,
        data_type=FeatureDataType.FLOAT,
        window_days=30,
        description="Normalized index (0.0 to 1.0) of distinct platform features utilized (Lyrics, Offline Downloads, Connect, Podcasts)",
        business_purpose="High feature adoption is directly correlated with long-term retention",
        source_table="user_feature_telemetry",
        default_value=0.58,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0.0, max_value=1.0)
    ),
    FeatureDefinition(
        name="social_shares_count_30d",
        group=FeatureGroup.PLATFORM,
        data_type=FeatureDataType.INT,
        window_days=30,
        description="Count of track/playlist shares to external social apps or Spotify Blend over 30 days",
        business_purpose="Social sharing creates viral network retention loops",
        source_table="social_events",
        default_value=3,
        validation_rules=FeatureValidationRule(allow_null=False, min_value=0, max_value=500)
    )
]
