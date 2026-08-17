import os
import json
from typing import Dict, Any

def generate_reports(
    dataset_metadata: Dict[str, Any],
    eval_results: Dict[str, Dict[str, Any]],
    output_dir: str = "app/ml/reports"
):
    """
    Generates training and evaluation summary reports.
    """
    os.makedirs(output_dir, exist_ok=True)

    # 1. Dataset Statistics
    dataset_stats_path = os.path.join(output_dir, "dataset_statistics.md")
    with open(dataset_stats_path, "w") as f:
        f.write("# Dataset Statistics\n\n")
        f.write(f"- **Version**: {dataset_metadata['version']}\n")
        f.write(f"- **Train Hash**: {dataset_metadata['train_hash']}\n")
        f.write(f"- **Validation Hash**: {dataset_metadata['val_hash']}\n")
        f.write(f"- **Train Rows**: {len(dataset_metadata['train_df'])}\n")
        f.write(f"- **Validation Rows**: {len(dataset_metadata['val_df'])}\n")

    # 2. Evaluation Summary & Model Comparison
    eval_summary_path = os.path.join(output_dir, "evaluation_summary.md")
    with open(eval_summary_path, "w") as f:
        f.write("# Model Comparison & Evaluation Summary\n\n")
        f.write("| Model | ROC AUC | F1 Score | Accuracy | Precision | Recall |\n")
        f.write("|-------|---------|----------|----------|-----------|--------|\n")

        # Sort by ROC AUC descending
        sorted_results = sorted(eval_results.items(), key=lambda x: x[1]['roc_auc'], reverse=True)

        for name, metrics in sorted_results:
            f.write(f"| {name} | {metrics['roc_auc']:.4f} | {metrics['f1_score']:.4f} | {metrics['accuracy']:.4f} | {metrics['precision']:.4f} | {metrics['recall']:.4f} |\n")

    # 3. JSON Output for system consumption
    json_path = os.path.join(output_dir, "metrics.json")
    with open(json_path, "w") as f:
        json.dump(eval_results, f, indent=4)
