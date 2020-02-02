"""
Database config & setup
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from backend.conf import SETTINGS


_ENGINE = create_engine(SETTINGS.database_url,)
SessionLocal = sessionmaker(  # pylint:disable=invalid-name
    autocommit=False, autoflush=False, bind=_ENGINE
)
Base = declarative_base()  # pylint:disable=invalid-name
