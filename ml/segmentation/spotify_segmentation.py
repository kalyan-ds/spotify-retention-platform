import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# =====================================
# CREATE OUTPUT DIRECTORY
# =====================================

os.makedirs("outputs/segmentation", exist_ok=True)

# =====================================
# LOAD DATA
# =====================================

df = pd.read_csv(
    "data/spotify_users_engineered.csv"
)

print("Dataset Loaded Successfully!")

print("\nShape:")
print(df.shape)

# =====================================
# SEGMENTATION FEATURES
# =====================================

segmentation_features = [

    "engagement_index",
    "music_addiction_score",
    "loyalty_score",
    "user_value_score",
    "churn_risk_score",
    "retention_score",
    "lifetime_value"

]

X = df[segmentation_features]

# =====================================
# STANDARDIZATION
# =====================================

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# =====================================
# ELBOW METHOD
# =====================================

print("\nRunning Elbow Method...")

wcss = []

for i in range(1,11):

    kmeans = KMeans(
        n_clusters=i,
        random_state=42,
        n_init=10
    )

    kmeans.fit(X_scaled)

    wcss.append(
        kmeans.inertia_
    )

plt.figure(figsize=(10,6))

plt.plot(
    range(1,11),
    wcss,
    marker="o"
)

plt.title(
    "Elbow Method"
)

plt.xlabel(
    "Number of Clusters"
)

plt.ylabel(
    "WCSS"
)

plt.tight_layout()

plt.savefig(
    "outputs/segmentation/elbow_method.png"
)

plt.close()

# =====================================
# FINAL MODEL
# =====================================

optimal_clusters = 5

kmeans = KMeans(
    n_clusters=optimal_clusters,
    random_state=42,
    n_init=10
)

df["segment"] = kmeans.fit_predict(
    X_scaled
)

print("\nSegments Created Successfully!")

print(
    df["segment"]
    .value_counts()
)

# =====================================
# SAVE DATASET
# =====================================

df.to_csv(
    "data/spotify_users_segmented.csv",
    index=False
)

# =====================================
# PCA VISUALIZATION
# =====================================

pca = PCA(
    n_components=2
)

pca_result = pca.fit_transform(
    X_scaled
)

df["pca1"] = pca_result[:,0]
df["pca2"] = pca_result[:,1]

plt.figure(figsize=(10,6))

sns.scatterplot(
    data=df,
    x="pca1",
    y="pca2",
    hue="segment",
    palette="viridis"
)

plt.title(
    "Spotify User Segments"
)

plt.tight_layout()

plt.savefig(
    "outputs/segmentation/user_clusters_2d.png"
)

plt.close()

# =====================================
# CLUSTER DISTRIBUTION
# =====================================

plt.figure(figsize=(8,5))

sns.countplot(
    x="segment",
    data=df
)

plt.title(
    "Cluster Distribution"
)

plt.tight_layout()

plt.savefig(
    "outputs/segmentation/cluster_distribution.png"
)

plt.close()

# =====================================
# SEGMENT PROFILES
# =====================================

segment_profiles = (
    df.groupby("segment")
    [
        [
            "engagement_index",
            "music_addiction_score",
            "loyalty_score",
            "user_value_score",
            "churn_risk_score"
        ]
    ]
    .mean()
)

segment_profiles.to_csv(
    "outputs/segmentation/segment_profiles.csv"
)

plt.figure(figsize=(12,6))

sns.heatmap(
    segment_profiles,
    annot=True,
    cmap="YlGnBu"
)

plt.title(
    "Segment Profiles"
)

plt.tight_layout()

plt.savefig(
    "outputs/segmentation/segment_profiles.png"
)

plt.close()

# =====================================
# BUSINESS INTERPRETATION
# =====================================

print("\n==============================")
print("SEGMENT ANALYSIS")
print("==============================")

for segment in sorted(
    df["segment"].unique()
):

    temp = df[
        df["segment"] == segment
    ]

    print(
        f"\nSegment {segment}"
    )

    print(
        "Users:",
        len(temp)
    )

    print(
        "Avg Engagement:",
        round(
            temp["engagement_index"].mean(),
            2
        )
    )

    print(
        "Avg Loyalty:",
        round(
            temp["loyalty_score"].mean(),
            2
        )
    )

    print(
        "Avg User Value:",
        round(
            temp["user_value_score"].mean(),
            2
        )
    )

    print(
        "Avg Churn Risk:",
        round(
            temp["churn_risk_score"].mean(),
            2
        )
    )

print("\nDataset Saved:")
print(
    "data/spotify_users_segmented.csv"
)

print("\nOutputs Saved:")
print(
    "outputs/segmentation/"
)
