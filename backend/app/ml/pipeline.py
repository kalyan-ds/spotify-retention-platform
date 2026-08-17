import asyncio
import os
import time
from loguru import logger
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.ml.feature_engineering import extract_features
from app.ml.validation import validate_features
from app.ml.dataset_builder import build_datasets
from app.ml.preprocessing import preprocess_datasets
from app.ml.training import train_models
from app.ml.evaluation import evaluate_all_models
from app.ml.registry import register_model
from app.ml.reports import generate_reports

async def run_pipeline():
    start_time = time.time()
    logger.info("Starting Enterprise Dataset Builder & Model Training Pipeline...")

    engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        # 1. Feature Engineering
        logger.info("Extracting features from database...")
        df = await extract_features(db)

        if df.empty:
            logger.error("No data available to build dataset.")
            return

        # 2. Validation
        df = validate_features(df)

        # 3. Dataset Builder
        logger.info("Building datasets...")
        dataset_meta = build_datasets(df, output_dir="app/ml/datasets")

        # 4. Preprocessing
        logger.info("Preprocessing datasets...")
        X_train, y_train, X_val, y_val = preprocess_datasets(
            dataset_meta["train_df"],
            dataset_meta["val_df"],
            output_dir="app/ml/models"
        )

        # 5. Training
        models = train_models(X_train, y_train, output_dir="app/ml/models")

        # 6. Evaluation
        eval_results = evaluate_all_models(models, X_val, y_val)

        # 7. Reports
        logger.info("Generating reports...")
        generate_reports(dataset_meta, eval_results, output_dir="app/ml/reports")

        # 8. Registry Integration
        logger.info("Registering models in DB...")
        for name, metrics in eval_results.items():
            await register_model(
                db=db,
                model_name=f"churn_prediction_{name}",
                algorithm=name,
                dataset_version=dataset_meta["version"],
                metrics=metrics,
                artifact_path=f"app/ml/models/{name}.joblib"
            )

    total_time = time.time() - start_time
    logger.info(f"Pipeline completed successfully in {total_time:.2f} seconds.")

if __name__ == "__main__":
    asyncio.run(run_pipeline())
