import os
import hashlib
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split
from typing import Tuple, Dict

def build_datasets(df: pd.DataFrame, output_dir: str = "app/ml/datasets") -> Dict[str, pd.DataFrame]:
    """
    Splits validated DataFrame into Train and Validation sets.
    Generates metadata and saves locally.
    """
    if df.empty:
        raise ValueError("DataFrame is empty. Cannot build datasets.")

    os.makedirs(output_dir, exist_ok=True)

    # Split features and target
    X = df.drop(columns=["is_churned"])
    y = df["is_churned"]

    # 80/20 train/validation split
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    train_df = pd.concat([X_train, y_train], axis=1)
    val_df = pd.concat([X_val, y_val], axis=1)

    # Create hashes for reproducibility
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    train_csv = train_df.to_csv(index=False).encode('utf-8')
    val_csv = val_df.to_csv(index=False).encode('utf-8')

    train_hash = hashlib.sha256(train_csv).hexdigest()[:12]
    val_hash = hashlib.sha256(val_csv).hexdigest()[:12]

    dataset_version = f"v1_{timestamp}"

    train_path = os.path.join(output_dir, f"train_{dataset_version}.csv")
    val_path = os.path.join(output_dir, f"val_{dataset_version}.csv")

    with open(train_path, "wb") as f:
        f.write(train_csv)
    with open(val_path, "wb") as f:
        f.write(val_csv)

    return {
        "version": dataset_version,
        "train_df": train_df,
        "val_df": val_df,
        "train_hash": train_hash,
        "val_hash": val_hash
    }
