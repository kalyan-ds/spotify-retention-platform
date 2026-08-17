from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

# Create the SQLAlchemy Async Engine
engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    echo=settings.LOG_LEVEL == "DEBUG",
    future=True,
    pool_pre_ping=True,  # Enable connection health checks
    pool_size=20,
    max_overflow=10
)

# Create the session maker
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)
