"""
Database config & setup
"""
import databases
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base

from backend.config import SETTINGS


_DATABASE_URL = SETTINGS.database_url.replace("postgres://", "postgresql://")
DATABASE = databases.Database(_DATABASE_URL)
METADATA = sqlalchemy.MetaData()

Base = declarative_base()  # pylint:disable=invalid-name
