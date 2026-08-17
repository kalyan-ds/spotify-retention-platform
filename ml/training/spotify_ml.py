import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
    RocCurveDisplay
)

from xgboost import XGBClassifier

# =====================================
# CREATE DIRECTORIES
# =====================================

os.makedirs("outputs/ml", exist_ok=True)
os.makedirs("models", exist_ok=True)

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
# FEATURE SELECTION
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

y = df["churn"]

# =====================================
# TRAIN TEST SPLIT
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining Shape:")
print(X_train.shape)

print("\nTesting Shape:")
print(X_test.shape)

# =====================================
# SCALING
# =====================================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save scaler

joblib.dump(
    scaler,
    "models/scaler.pkl"
)

# =====================================
# LOGISTIC REGRESSION
# =====================================

print("\nTraining Logistic Regression...")

lr = LogisticRegression(
    max_iter=1000
)

lr.fit(
    X_train_scaled,
    y_train
)

lr_pred = lr.predict(X_test_scaled)

# =====================================
# RANDOM FOREST
# =====================================

print("Training Random Forest...")

rf = RandomForestClassifier(
    n_estimators=300,
    random_state=42
)

rf.fit(
    X_train,
    y_train
)

rf_pred = rf.predict(X_test)

# =====================================
# XGBOOST
# =====================================

print("Training XGBoost...")

xgb = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    random_state=42,
    eval_metric="logloss"
)

xgb.fit(
    X_train,
    y_train
)

xgb_pred = xgb.predict(X_test)

# =====================================
# EVALUATION FUNCTION
# =====================================

results = []

def evaluate_model(
    model_name,
    y_true,
    y_pred
):

    accuracy = accuracy_score(
        y_true,
        y_pred
    )

    precision = precision_score(
        y_true,
        y_pred
    )

    recall = recall_score(
        y_true,
        y_pred
    )

    f1 = f1_score(
        y_true,
        y_pred
    )

    results.append(
        [
            model_name,
            accuracy,
            precision,
            recall,
            f1
        ]
    )

    print("\n====================")
    print(model_name)
    print("====================")

    print("Accuracy :", round(accuracy,4))
    print("Precision:", round(precision,4))
    print("Recall   :", round(recall,4))
    print("F1 Score :", round(f1,4))

# =====================================
# MODEL RESULTS
# =====================================

evaluate_model(
    "Logistic Regression",
    y_test,
    lr_pred
)

evaluate_model(
    "Random Forest",
    y_test,
    rf_pred
)

evaluate_model(
    "XGBoost",
    y_test,
    xgb_pred
)

# =====================================
# CONFUSION MATRICES
# =====================================

models_dict = {
    "lr": (lr, X_test_scaled),
    "rf": (rf, X_test),
    "xgb": (xgb, X_test)
}

for name, (model, data) in models_dict.items():

    pred = model.predict(data)

    cm = confusion_matrix(
        y_test,
        pred
    )

    plt.figure(figsize=(6,5))

    disp = ConfusionMatrixDisplay(
        confusion_matrix=cm
    )

    disp.plot()

    plt.title(
        f"Confusion Matrix - {name.upper()}"
    )

    plt.tight_layout()

    plt.savefig(
        f"outputs/ml/confusion_matrix_{name}.png"
    )

    plt.close()

# =====================================
# ROC CURVE COMPARISON
# =====================================

plt.figure(figsize=(8,6))

RocCurveDisplay.from_estimator(
    lr,
    X_test_scaled,
    y_test,
    name="Logistic Regression"
)

RocCurveDisplay.from_estimator(
    rf,
    X_test,
    y_test,
    name="Random Forest"
)

RocCurveDisplay.from_estimator(
    xgb,
    X_test,
    y_test,
    name="XGBoost"
)

plt.title(
    "ROC Curve Comparison"
)

plt.savefig(
    "outputs/ml/roc_curve_comparison.png"
)

plt.close()

# =====================================
# FEATURE IMPORTANCE
# =====================================

importance_df = pd.DataFrame({
    "Feature": X.columns,
    "Importance": rf.feature_importances_
})

importance_df = (
    importance_df
    .sort_values(
        by="Importance",
        ascending=False
    )
    .head(15)
)

plt.figure(figsize=(10,6))

sns.barplot(
    data=importance_df,
    x="Importance",
    y="Feature"
)

plt.title(
    "Random Forest Feature Importance"
)

plt.tight_layout()

plt.savefig(
    "outputs/ml/feature_importance_rf.png"
)

plt.close()

# =====================================
# MODEL COMPARISON
# =====================================

results_df = pd.DataFrame(
    results,
    columns=[
        "Model",
        "Accuracy",
        "Precision",
        "Recall",
        "F1"
    ]
)

plt.figure(figsize=(10,6))

results_df.set_index(
    "Model"
)[
    [
        "Accuracy",
        "Precision",
        "Recall",
        "F1"
    ]
].plot(
    kind="bar"
)

plt.title(
    "Model Comparison"
)

plt.tight_layout()

plt.savefig(
    "outputs/ml/model_comparison.png"
)

plt.close()

# =====================================
# SAVE BEST MODEL
# =====================================

joblib.dump(
    rf,
    "models/churn_model.pkl"
)

print("\n==============================")
print("MODEL SAVED SUCCESSFULLY")
print("==============================")

print("\nSaved Files:")

print("models/churn_model.pkl")
print("models/scaler.pkl")

print("\nOutputs Saved To:")
print("outputs/ml/")
