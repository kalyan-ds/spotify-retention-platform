import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# =====================================
# CREATE OUTPUT DIRECTORY
# =====================================

os.makedirs("outputs/eda", exist_ok=True)

# =====================================
# LOAD DATA
# =====================================

df = pd.read_csv("data/spotify_users.csv")

print("Dataset Loaded Successfully!")

print("\nShape Before Engineering:")
print(df.shape)

# =====================================
# FEATURE 1
# ENGAGEMENT INDEX
# =====================================

df["engagement_index"] = (
    df["daily_listening_hours"] * 0.30 +
    df["playlist_count"] * 0.20 +
    df["liked_songs"] * 0.0005 +
    df["followed_artists"] * 0.05 +
    df["search_frequency"] * 0.10
)

# =====================================
# FEATURE 2
# MUSIC ADDICTION SCORE
# =====================================

df["music_addiction_score"] = (
    df["daily_listening_hours"] * 8 +
    df["songs_played_per_day"] * 0.15 +
    df["session_duration"] * 0.05
)

# =====================================
# FEATURE 3
# LOYALTY SCORE
# =====================================

df["loyalty_score"] = (
    df["subscription_months"] * 1.5 +
    df["premium_renewals"] * 2 +
    df["retention_score"] * 0.5
)

# =====================================
# FEATURE 4
# USER VALUE SCORE
# =====================================

df["user_value_score"] = (
    df["lifetime_value"] * 0.02 +
    df["monthly_spending"] * 2 +
    df["premium_user"] * 25
)

# =====================================
# FEATURE 5
# CHURN RISK SCORE
# =====================================

df["churn_risk_score"] = (
    df["skip_rate"] * 0.40 +
    df["last_active_days"] * 2 -
    df["retention_score"] * 0.50 -
    df["engagement_score"] * 0.20
)

# =====================================
# NORMALIZATION
# =====================================

feature_cols = [
    "engagement_index",
    "music_addiction_score",
    "loyalty_score",
    "user_value_score",
    "churn_risk_score"
]

for col in feature_cols:

    min_val = df[col].min()
    max_val = df[col].max()

    df[col] = (
        (df[col] - min_val)
        /
        (max_val - min_val)
    ) * 100

# =====================================
# SAVE NEW DATASET
# =====================================

df.to_csv(
    "data/spotify_users_engineered.csv",
    index=False
)

print("\nShape After Engineering:")
print(df.shape)

print("\nNew Dataset Saved:")
print("data/spotify_users_engineered.csv")

# =====================================
# VISUALIZATIONS
# =====================================

# Engagement Index

plt.figure(figsize=(10,6))

sns.histplot(
    df["engagement_index"],
    bins=30,
    kde=True
)

plt.title("Engagement Index Distribution")

plt.tight_layout()

plt.savefig(
    "outputs/eda/engagement_index_distribution.png"
)

plt.close()

# Music Addiction

plt.figure(figsize=(10,6))

sns.histplot(
    df["music_addiction_score"],
    bins=30,
    kde=True
)

plt.title("Music Addiction Score Distribution")

plt.tight_layout()

plt.savefig(
    "outputs/eda/music_addiction_distribution.png"
)

plt.close()

# Loyalty Score

plt.figure(figsize=(10,6))

sns.histplot(
    df["loyalty_score"],
    bins=30,
    kde=True
)

plt.title("Loyalty Score Distribution")

plt.tight_layout()

plt.savefig(
    "outputs/eda/loyalty_score_distribution.png"
)

plt.close()

# User Value Score

plt.figure(figsize=(10,6))

sns.histplot(
    df["user_value_score"],
    bins=30,
    kde=True
)

plt.title("User Value Score Distribution")

plt.tight_layout()

plt.savefig(
    "outputs/eda/user_value_score_distribution.png"
)

plt.close()

# Churn Risk Score

plt.figure(figsize=(10,6))

sns.histplot(
    df["churn_risk_score"],
    bins=30,
    kde=True
)

plt.title("Churn Risk Score Distribution")

plt.tight_layout()

plt.savefig(
    "outputs/eda/churn_risk_distribution.png"
)

plt.close()

# =====================================
# CORRELATION WITH CHURN
# =====================================

correlation = (
    df[
        [
            "engagement_index",
            "music_addiction_score",
            "loyalty_score",
            "user_value_score",
            "churn_risk_score",
            "churn"
        ]
    ]
    .corr()
)

plt.figure(figsize=(8,6))

sns.heatmap(
    correlation,
    annot=True,
    cmap="coolwarm"
)

plt.title("Engineered Features Correlation")

plt.tight_layout()

plt.savefig(
    "outputs/eda/feature_importance_preview.png"
)

plt.close()

# =====================================
# BUSINESS INSIGHTS
# =====================================

print("\n==============================")
print("FEATURE ENGINEERING INSIGHTS")
print("==============================")

print(
    "\nAverage Engagement Index:",
    round(df["engagement_index"].mean(), 2)
)

print(
    "\nAverage Music Addiction Score:",
    round(df["music_addiction_score"].mean(), 2)
)

print(
    "\nAverage Loyalty Score:",
    round(df["loyalty_score"].mean(), 2)
)

print(
    "\nAverage User Value Score:",
    round(df["user_value_score"].mean(), 2)
)

print(
    "\nAverage Churn Risk Score:",
    round(df["churn_risk_score"].mean(), 2)
)

print("\nFeature Engineering Completed Successfully!")

print("\nOutputs Saved To:")
print("outputs/eda/")
