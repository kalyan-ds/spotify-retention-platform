import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# =====================================
# CREATE OUTPUT DIRECTORY
# =====================================

os.makedirs("outputs/data_quality", exist_ok=True)

# =====================================
# LOAD DATASET
# =====================================

df = pd.read_csv("data/spotify_users.csv")

print("Dataset Loaded Successfully!")

# =====================================
# BASIC INFORMATION
# =====================================

print("\nShape:")
print(df.shape)

print("\nColumns:")
print(df.columns)

print("\nFirst 5 Rows:")
print(df.head())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:")
print(df.duplicated().sum())

print("\nData Types:")
print(df.dtypes)

print("\nDescriptive Statistics:")
print(df.describe())

# =====================================
# MISSING VALUES VISUALIZATION
# =====================================

plt.figure(figsize=(12,6))

sns.heatmap(
    df.isnull(),
    cbar=False,
    cmap="viridis"
)

plt.title("Missing Values Heatmap")

plt.tight_layout()

plt.savefig(
    "outputs/data_quality/missing_values.png"
)

plt.close()

# =====================================
# CHURN DISTRIBUTION
# =====================================

plt.figure(figsize=(8,6))

sns.countplot(
    x="churn",
    data=df
)

plt.title("Churn Distribution")

plt.xlabel("Churn")

plt.ylabel("Count")

plt.tight_layout()

plt.savefig(
    "outputs/data_quality/churn_distribution.png"
)

plt.close()

# =====================================
# CORRELATION HEATMAP
# =====================================

numeric_df = df.select_dtypes(
    include=np.number
)

plt.figure(figsize=(16,10))

sns.heatmap(
    numeric_df.corr(),
    cmap="coolwarm",
    annot=False
)

plt.title("Feature Correlation Heatmap")

plt.tight_layout()

plt.savefig(
    "outputs/data_quality/feature_correlation_heatmap.png"
)

plt.close()

# =====================================
# OUTLIER BOXPLOTS
# =====================================

features = [
    "daily_listening_hours",
    "songs_played_per_day",
    "skip_rate",
    "engagement_score",
    "retention_score"
]

plt.figure(figsize=(14,8))

df[features].boxplot()

plt.title("Outlier Analysis")

plt.xticks(rotation=20)

plt.tight_layout()

plt.savefig(
    "outputs/data_quality/outlier_boxplots.png"
)

plt.close()

# =====================================
# PREMIUM VS CHURN
# =====================================

premium_churn = pd.crosstab(
    df["premium_user"],
    df["churn"]
)

premium_churn.plot(
    kind="bar",
    figsize=(8,6)
)

plt.title("Premium Users vs Churn")

plt.xlabel("Premium User")

plt.ylabel("Count")

plt.tight_layout()

plt.savefig(
    "outputs/data_quality/premium_vs_churn.png"
)

plt.close()

# =====================================
# COUNTRY DISTRIBUTION
# =====================================

plt.figure(figsize=(12,6))

sns.countplot(
    y="country",
    data=df,
    order=df["country"].value_counts().index
)

plt.title("Country Distribution")

plt.tight_layout()

plt.savefig(
    "outputs/data_quality/country_distribution.png"
)

plt.close()

# =====================================
# ENGAGEMENT SCORE DISTRIBUTION
# =====================================

plt.figure(figsize=(10,6))

sns.histplot(
    df["engagement_score"],
    bins=30,
    kde=True
)

plt.title("Engagement Score Distribution")

plt.tight_layout()

plt.savefig(
    "outputs/data_quality/engagement_score_distribution.png"
)

plt.close()

# =====================================
# RETENTION SCORE DISTRIBUTION
# =====================================

plt.figure(figsize=(10,6))

sns.histplot(
    df["retention_score"],
    bins=30,
    kde=True
)

plt.title("Retention Score Distribution")

plt.tight_layout()

plt.savefig(
    "outputs/data_quality/retention_score_distribution.png"
)

plt.close()

# =====================================
# BUSINESS INSIGHTS
# =====================================

print("\n==============================")
print("BUSINESS INSIGHTS")
print("==============================")

print("\nChurn Distribution:")
print(df["churn"].value_counts())

print("\nPremium User Distribution:")
print(df["premium_user"].value_counts())

print("\nTop Countries:")
print(df["country"].value_counts().head())

print("\nAverage Engagement Score:")
print(round(df["engagement_score"].mean(), 2))

print("\nAverage Retention Score:")
print(round(df["retention_score"].mean(), 2))

print("\nVisualizations Saved Successfully!")

print("\nSaved To:")
print("outputs/data_quality/")
