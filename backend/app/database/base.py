from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncAttrs
from app.database.naming import metadata

class Base(AsyncAttrs, DeclarativeBase):
    """
    Base Declarative Model for all SQLAlchemy models.
    All models must inherit from this class.
    """
    metadata = metadata
