import time
import uuid
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger

from app.ai.pipelines.dataset_builder import dataset_builder
from app.ai.pipelines.validation_pipeline import validation_pipeline
from app.ai.pipelines.cross_validation import cross_validator
from app.ai.pipelines.hyperparameter_search import hyperparameter_search
from app.ai.pipelines.experiment_tracking import experiment_tracker
from app.ai.models.churn_model import ChurnModel
from app.ai.models.engagement_model import EngagementModel
from app.ai.models.evaluation import model_evaluator
from app.ai.models.versioning import SemanticVersion
from app.ai.registry.model_registry import model_registry
from app.ai.registry.metadata import ModelMetadataRecord
from app.ai.registry.artifacts import artifact_storage_manager
from app.ai.exceptions import TrainingException

class TrainingPipeline:
    """
    Master ML Training Pipeline Orchestrator.
    Executes dataset building, validation, hyperparameter search, cross-validation,
    model training, evaluation, serialization, artifact storage, and registry promotion.
    """

    async def run_churn_training_pipeline(
        self,
        db: AsyncSession,
        algorithm: str = "xgboost",
        sample_size: int = 200,
        bump_type: str = "minor"
    ) -> Dict[str, Any]:
        start_time = time.time()
        experiment_id = f"exp_churn_{uuid.uuid4().hex[:6]}"

        logger.info(f"[TrainingPipeline] Starting Churn Prediction Training | ExperimentID={experiment_id} | Algorithm={algorithm}")

        try:
            # 1. Load Features & Build Dataset
            X_train, X_test, y_train, y_test, feature_names = await dataset_builder.build_churn_dataset(
                db, sample_size=sample_size
            )

            # 2. Dataset Pre-training Validation
            val_info = validation_pipeline.validate_dataset(X_train, y_train)

            # 3. Instantiate Model
            current_champion = model_registry.get_model_metadata("mod_churn_xgb_v1.4.2")
            old_version = current_champion.version if current_champion else "v1.4.0"
            new_version = SemanticVersion.bump(old_version, bump_type=bump_type, suffix="prod")

            model = ChurnModel(algorithm=algorithm, version=new_version)

            # 4. Hyperparameter Search
            param_grid = {
                "n_estimators": [100, 200, 300],
                "max_depth": [3, 5, 7],
                "learning_rate": [0.01, 0.05, 0.1]
            }
            best_params, best_hpo_score = hyperparameter_search.search(
                model, param_grid, X_train, y_train, strategy="random_search", n_iter=5
            )

            # 5. Cross-Validation
            cv_results = cross_validator.evaluate_cv(model, X_train, y_train, n_splits=5)

            # 6. Fit Final Champion Candidate Model
            model.fit(X_train, y_train, feature_names=feature_names)

            # 7. Model Evaluation on Test Set
            eval_report = model_evaluator.evaluate_model(model, X_test, y_test)
            metrics = eval_report["metrics"]

            duration_ms = (time.time() - start_time) * 1000

            # 8. Experiment Tracking
            run_record = experiment_tracker.log_run(
                experiment_id=experiment_id,
                model_name=model.model_name,
                algorithm=algorithm,
                parameters=best_params,
                metrics=metrics,
                duration_ms=duration_ms
            )

            # 9. Model Serialization & Artifact Storage
            model_id = f"mod_churn_{algorithm}_{new_version.replace('.', '_')}"
            artifact_path = artifact_storage_manager.get_model_artifact_path(model_id)
            model.save(artifact_path)

            # 10. Register in Model Registry & Metadata Update
            record = ModelMetadataRecord(
                model_id=model_id,
                model_name=model.model_name,
                task_type=model.task_type,
                algorithm=algorithm,
                version=new_version,
                stage="Staging",
                owner="MLOps_Team",
                business_purpose="Predicts 30-day Premium user cancellation probability",
                feature_version="v1.0.0",
                dataset_version="ds_2026_q3",
                hyperparameters=best_params,
                metrics=metrics,
                artifact_path=artifact_path,
                is_champion=False
            )
            model_registry.register_model(record)

            # 11. Champion Promotion Evaluation
            promoted = model_registry.promote_to_champion(model_id, metric_key="roc_auc")

            logger.info(
                f"[TrainingPipeline] Churn Training Completed | ModelID={model_id} | "
                f"ROC_AUC={metrics.get('roc_auc')} | Promoted_Champion={promoted} | Duration={duration_ms:.2f}ms"
            )

            return {
                "experiment_id": experiment_id,
                "run_id": run_record.run_id,
                "model_id": model_id,
                "version": new_version,
                "metrics": metrics,
                "cv_results": cv_results["mean_metrics"],
                "best_hyperparameters": best_params,
                "promoted_to_champion": promoted,
                "artifact_path": artifact_path,
                "duration_ms": round(duration_ms, 2)
            }

        except Exception as e:
            raise TrainingException(f"Training pipeline execution failed: {str(e)}")

training_pipeline = TrainingPipeline()
