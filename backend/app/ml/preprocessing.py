import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
import joblib
import os

def build_preprocessor() -> ColumnTransformer:
    """
    Constructs the Scikit-Learn preprocessing pipeline.
    """
    numeric_features = [
        "subscription_age_days",
        "listening_hours",
        "completion_rate",
        "skip_rate",
        "active_days"
    ]
    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    # We leave is_premium as is (it's already 0/1) but we could explicitly pass it through
    # For simplicity, we process only numeric features and passthrough binary
    categorical_features = ["is_premium"]
    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent"))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features)
        ]
    )
    return preprocessor

def preprocess_datasets(
    train_df: pd.DataFrame,
    val_df: pd.DataFrame,
    output_dir: str = "app/ml/models"
):
    """
    Fits the preprocessor on the training set and transforms both sets.
    Saves the preprocessor artifact.
    """
    os.makedirs(output_dir, exist_ok=True)

    X_train = train_df.drop(columns=["is_churned"])
    y_train = train_df["is_churned"]

    X_val = val_df.drop(columns=["is_churned"])
    y_val = val_df["is_churned"]

    preprocessor = build_preprocessor()

    X_train_processed = preprocessor.fit_transform(X_train)
    X_val_processed = preprocessor.transform(X_val)

    # Save preprocessor
    joblib.dump(preprocessor, os.path.join(output_dir, "preprocessor.joblib"))

    # Convert back to df to retain column names for evaluation (optional, but good for SHAP)
    # The output of ColumnTransformer is a numpy array. We can recreate the DF.
    num_cols = ["subscription_age_days", "listening_hours", "completion_rate", "skip_rate", "active_days"]
    cat_cols = ["is_premium"]
    all_cols = num_cols + cat_cols

    X_train_proc_df = pd.DataFrame(X_train_processed, columns=all_cols)
    X_val_proc_df = pd.DataFrame(X_val_processed, columns=all_cols)

    return X_train_proc_df, y_train, X_val_proc_df, y_val
