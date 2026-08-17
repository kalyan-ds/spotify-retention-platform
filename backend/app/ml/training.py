import os
import joblib
import pandas as pd
from loguru import logger
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from typing import Dict, Any

def train_models(X_train: pd.DataFrame, y_train: pd.Series, output_dir: str = "app/ml/models") -> Dict[str, Any]:
    """
    Trains baseline models on the preprocessed training dataset.
    Saves model artifacts to disk and returns them.
    """
    os.makedirs(output_dir, exist_ok=True)
    trained_models = {}

    logger.info("Training Logistic Regression...")
    lr_model = LogisticRegression(random_state=42, max_iter=1000)
    lr_model.fit(X_train, y_train)
    joblib.dump(lr_model, os.path.join(output_dir, "logistic_regression.joblib"))
    trained_models["logistic_regression"] = lr_model

    logger.info("Training Random Forest...")
    rf_model = RandomForestClassifier(random_state=42, n_estimators=100)
    rf_model.fit(X_train, y_train)
    joblib.dump(rf_model, os.path.join(output_dir, "random_forest.joblib"))
    trained_models["random_forest"] = rf_model

    logger.info("Training XGBoost...")
    xgb_model = XGBClassifier(random_state=42, use_label_encoder=False, eval_metric="logloss")
    xgb_model.fit(X_train, y_train)
    joblib.dump(xgb_model, os.path.join(output_dir, "xgboost.joblib"))
    trained_models["xgboost"] = xgb_model

    logger.info("Model training complete.")
    return trained_models
