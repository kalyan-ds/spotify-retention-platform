from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from app.database.engine import engine

# Create the session factory
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)
