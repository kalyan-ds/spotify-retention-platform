import pandas as pd
import numpy as np
from loguru import logger
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from typing import Dict, Any

def evaluate_model(model: Any, X_val: pd.DataFrame, y_val: pd.Series) -> Dict[str, Any]:
    """
    Evaluates a single model using standard classification metrics.
    """
    y_pred = model.predict(X_val)
    y_prob = model.predict_proba(X_val)[:, 1] if hasattr(model, "predict_proba") else y_pred

    acc = float(accuracy_score(y_val, y_pred))

    # Handle zero division warnings explicitly or just let sklearn output 0.0
    prec = float(precision_score(y_val, y_pred, zero_division=0))
    rec = float(recall_score(y_val, y_pred, zero_division=0))
    f1 = float(f1_score(y_val, y_pred, zero_division=0))

    try:
        roc_auc = float(roc_auc_score(y_val, y_prob))
    except ValueError:
        roc_auc = 0.5 # Default if only one class present in y_val

    cm = confusion_matrix(y_val, y_pred).tolist()

    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "roc_auc": roc_auc,
        "confusion_matrix": cm
    }

def evaluate_all_models(models: Dict[str, Any], X_val: pd.DataFrame, y_val: pd.Series) -> Dict[str, Dict[str, Any]]:
    """
    Evaluates all trained models on the validation set.
    """
    logger.info("Evaluating models...")
    results = {}
    for name, model in models.items():
        results[name] = evaluate_model(model, X_val, y_val)
        logger.info(f"{name} AUC-ROC: {results[name]['roc_auc']:.4f}")

    return results
