import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

sns.set_style("whitegrid")

# =====================================
# CREATE OUTPUT DIRECTORY
# =====================================

os.makedirs("outputs/eda", exist_ok=True)

# =====================================
# LOAD DATA
# =====================================

df = pd.read_csv("data/spotify_users.csv")

print("Dataset Loaded Successfully!")

print("\nShape:")
print(df.shape)

# =====================================
# USER BEHAVIOR ANALYTICS
# =====================================

print("\n==============================")
print("USER BEHAVIOR ANALYTICS")
print("==============================")

# Listening Hours Distribution

plt.figure(figsize=(10,6))

sns.histplot(
    df["daily_listening_hours"],
    bins=30,
    kde=True
)

plt.title("Daily Listening Hours Distribution")

plt.savefig(
    "outputs/eda/listening_hours_distribution.png"
)

plt.close()

# Songs Played Distribution

plt.figure(figsize=(10,6))

sns.histplot(
    df["songs_played_per_day"],
    bins=30,
    kde=True
)

plt.title("Songs Played Per Day")

plt.savefig(
    "outputs/eda/songs_played_distribution.png"
)

plt.close()

# Device Distribution

plt.figure(figsize=(10,6))

sns.countplot(
    y="device_type",
    data=df,
    order=df["device_type"].value_counts().index
)

plt.title("Device Type Distribution")

plt.savefig(
    "outputs/eda/device_type_distribution.png"
)

plt.close()

# Country Distribution

plt.figure(figsize=(12,6))

sns.countplot(
    y="country",
    data=df,
    order=df["country"].value_counts().index
)

plt.title("Country User Analysis")

plt.savefig(
    "outputs/eda/country_user_analysis.png"
)

plt.close()

# =====================================
# REVENUE ANALYTICS
# =====================================

print("\n==============================")
print("REVENUE ANALYTICS")
print("==============================")

country_revenue = (
    df.groupby("country")["lifetime_value"]
    .sum()
    .sort_values(ascending=False)
)

plt.figure(figsize=(12,6))

country_revenue.plot(kind="bar")

plt.title("Revenue By Country")

plt.ylabel("Revenue")

plt.tight_layout()

plt.savefig(
    "outputs/eda/revenue_by_country.png"
)

plt.close()

premium_revenue = (
    df.groupby("premium_user")
    ["lifetime_value"]
    .sum()
)

plt.figure(figsize=(8,6))

premium_revenue.plot(
    kind="bar"
)

plt.title("Premium vs Free Revenue")

plt.ylabel("Revenue")

plt.tight_layout()

plt.savefig(
    "outputs/eda/premium_vs_free_revenue.png"
)

plt.close()

plt.figure(figsize=(10,6))

sns.histplot(
    df["lifetime_value"],
    bins=30,
    kde=True
)

plt.title("Lifetime Value Distribution")

plt.savefig(
    "outputs/eda/ltv_distribution.png"
)

plt.close()

# =====================================
# CHURN ANALYTICS
# =====================================

print("\n==============================")
print("CHURN ANALYTICS")
print("==============================")

plt.figure(figsize=(10,6))

sns.boxplot(
    x="churn",
    y="skip_rate",
    data=df
)

plt.title("Churn vs Skip Rate")

plt.savefig(
    "outputs/eda/churn_vs_skip_rate.png"
)

plt.close()

plt.figure(figsize=(10,6))

sns.boxplot(
    x="churn",
    y="daily_listening_hours",
    data=df
)

plt.title("Churn vs Listening Hours")

plt.savefig(
    "outputs/eda/churn_vs_listening_hours.png"
)

plt.close()

plt.figure(figsize=(10,6))

sns.boxplot(
    x="churn",
    y="retention_score",
    data=df
)

plt.title("Churn vs Retention Score")

plt.savefig(
    "outputs/eda/churn_vs_retention_score.png"
)

plt.close()

plt.figure(figsize=(10,6))

sns.boxplot(
    x="churn",
    y="engagement_score",
    data=df
)

plt.title("Churn vs Engagement Score")

plt.savefig(
    "outputs/eda/churn_vs_engagement_score.png"
)

plt.close()

# =====================================
# EXECUTIVE ANALYTICS
# =====================================

print("\n==============================")
print("EXECUTIVE ANALYTICS")
print("==============================")

top_country_revenue = (
    df.groupby("country")
    ["lifetime_value"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

plt.figure(figsize=(12,6))

top_country_revenue.plot(
    kind="bar"
)

plt.title("Top Revenue Countries")

plt.tight_layout()

plt.savefig(
    "outputs/eda/top_countries_revenue.png"
)

plt.close()

# User Activity Heatmap

activity_cols = [
    "daily_listening_hours",
    "songs_played_per_day",
    "playlist_count",
    "liked_songs",
    "retention_score"
]

plt.figure(figsize=(10,6))

sns.heatmap(
    df[activity_cols].corr(),
    annot=True,
    cmap="coolwarm"
)

plt.title("User Activity Heatmap")

plt.tight_layout()

plt.savefig(
    "outputs/eda/user_activity_heatmap.png"
)

plt.close()

# Premium User Behavior

premium_analysis = df.groupby("premium_user")[
    [
        "daily_listening_hours",
        "playlist_count",
        "retention_score"
    ]
].mean()

premium_analysis.plot(
    kind="bar",
    figsize=(10,6)
)

plt.title("Premium User Behavior")

plt.tight_layout()

plt.savefig(
    "outputs/eda/premium_user_behavior.png"
)

plt.close()

# =====================================
# BUSINESS INSIGHTS
# =====================================

print("\n==============================")
print("EXECUTIVE INSIGHTS")
print("==============================")

print(
    "\nAverage Listening Hours:",
    round(
        df["daily_listening_hours"].mean(),
        2
    )
)

print(
    "\nAverage Retention Score:",
    round(
        df["retention_score"].mean(),
        2
    )
)

print(
    "\nAverage Engagement Score:",
    round(
        df["engagement_score"].mean(),
        2
    )
)

print(
    "\nTotal Revenue:",
    round(
        df["lifetime_value"].sum(),
        2
    )
)

print(
    "\nPremium Users:",
    df["premium_user"].sum()
)

print(
    "\nChurn Rate:",
    round(
        df["churn"].mean()*100,
        2
    ),
    "%"
)

print("\nEDA Visualizations Saved Successfully!")

print("\nSaved To:")

print("outputs/eda/")
