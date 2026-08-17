import pandas as pd
from loguru import logger

def validate_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Validates features for correct bounds and handles extreme outliers or nulls.
    Returns the validated dataframe.
    """
    if df.empty:
        return df

    logger.info(f"Validating dataset with {len(df)} records.")

    # 1. Bounds validation
    # Completion rate should be between 0 and 100
    if "completion_rate" in df.columns:
        df.loc[df["completion_rate"] < 0, "completion_rate"] = 0
        df.loc[df["completion_rate"] > 100, "completion_rate"] = 100

    # Skip rate should be between 0 and 1
    if "skip_rate" in df.columns:
        df.loc[df["skip_rate"] < 0, "skip_rate"] = 0
        df.loc[df["skip_rate"] > 1, "skip_rate"] = 1

    # Listening hours should be >= 0
    if "listening_hours" in df.columns:
        df.loc[df["listening_hours"] < 0, "listening_hours"] = 0

    # Active days should be >= 0
    if "active_days" in df.columns:
        df.loc[df["active_days"] < 0, "active_days"] = 0

    # Subscription age should be >= 0
    if "subscription_age_days" in df.columns:
        df.loc[df["subscription_age_days"] < 0, "subscription_age_days"] = 0

    # 2. Check for missing values - simple validation report
    null_counts = df.isnull().sum()
    if null_counts.sum() > 0:
        logger.warning(f"Found missing values:\n{null_counts[null_counts > 0]}")

    logger.info("Feature validation complete.")
    return df
