import asyncio
import logging
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.database.base import Base

# Import all models to ensure they are registered with Base.metadata
from app.models.auth import *
from app.models.subscription import *
from app.models.catalog import *
from app.models.listening import *
from app.models.ml import *
from app.models.analytics import *
from app.models.system import *

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def reset_db():
    logger.info("Dropping all tables...")
    engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI, echo=False)
    async with engine.begin() as conn:
        from sqlalchemy import text
        await conn.execute(text("DROP TABLE IF EXISTS alembic_version"))
        await conn.run_sync(Base.metadata.drop_all)
    logger.info("All tables dropped.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(reset_db())
