import pandas as pd
import numpy as np
import shap
import joblib
import matplotlib.pyplot as plt
import os

# =====================================
# CREATE OUTPUT DIRECTORY
# =====================================

os.makedirs("outputs/shap", exist_ok=True)

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
# PREPARE FEATURES
# =====================================

drop_cols = [
    "user_id",
    "gender",
    "country",
    "payment_method",
    "device_type",
    "churn"
]

X = df.drop(columns=drop_cols)

# =====================================
# LOAD MODEL
# =====================================

model = joblib.load(
    "models/churn_model.pkl"
)

print("\nModel Loaded Successfully!")

# =====================================
# SHAP EXPLAINER
# =====================================

print("\nGenerating SHAP Values...")

explainer = shap.TreeExplainer(model)

sample_size = 1000

X_sample = X.sample(
    sample_size,
    random_state=42
)

shap_values = explainer.shap_values(
    X_sample
)

# =====================================
# SHAP SUMMARY PLOT
# =====================================

plt.figure()

shap.summary_plot(
    shap_values,
    X_sample,
    show=False
)

plt.tight_layout()

plt.savefig(
    "outputs/shap/shap_summary.png",
    bbox_inches="tight"
)

plt.close()

# =====================================
# SHAP BAR PLOT
# =====================================

plt.figure()

shap.summary_plot(
    shap_values,
    X_sample,
    plot_type="bar",
    show=False
)

plt.tight_layout()

plt.savefig(
    "outputs/shap/shap_bar.png",
    bbox_inches="tight"
)

plt.close()

# =====================================
# FEATURE IMPORTANCE RANKING
# =====================================
# Handle different SHAP versions

if isinstance(shap_values, list):

    shap_array = np.array(shap_values[1])

else:

    shap_array = np.array(shap_values)

# If 3D output from newer SHAP

if len(shap_array.shape) == 3:

    shap_array = shap_array[:, :, 1]

importance = np.abs(
    shap_array
).mean(axis=0)

importance_df = pd.DataFrame({
    "Feature": X_sample.columns,
    "Importance": importance
})

importance_df = importance_df.sort_values(
    by="Importance",
    ascending=False
)

importance_df.to_csv(
    "outputs/shap/feature_importance_ranking.csv",
    index=False
)

plt.figure(figsize=(10,6))

plt.barh(
    importance_df["Feature"][:15],
    importance_df["Importance"][:15]
)

plt.title(
    "Top Feature Impact Ranking"
)

plt.tight_layout()

plt.savefig(
    "outputs/shap/feature_impact_ranking.png"
)

plt.close()
# =====================================
# WATERFALL SAMPLE
# =====================================

try:

    sample_index = 0

    if len(shap_array.shape) == 2:

        explanation = shap.Explanation(
            values=shap_array[sample_index],
            base_values=explainer.expected_value,
            data=X_sample.iloc[sample_index],
            feature_names=X_sample.columns
        )

        shap.plots.waterfall(
            explanation,
            show=False
        )

        plt.tight_layout()

        plt.savefig(
            "outputs/shap/shap_waterfall_sample.png",
            bbox_inches="tight"
        )

        plt.close()

except Exception as e:

    print("\nWaterfall Plot Skipped:", e)
# =====================================
# TOP FEATURES
# =====================================

print("\n==============================")
print("TOP CHURN DRIVERS")
print("==============================")

print(
    importance_df.head(10)
)

print("\nSHAP Analysis Completed!")

print("\nOutputs Saved To:")
print("outputs/shap/")
