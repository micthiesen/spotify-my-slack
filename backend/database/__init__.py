"""
Database config & setup
"""
import databases
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from backend.conf import SETTINGS


_DATABASE_URL = SETTINGS.database_url.replace("postgres://", "postgresql://")
DATABASE = databases.Database(_DATABASE_URL)

Base = declarative_base()  # pylint:disable=invalid-name
