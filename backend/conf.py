"""
Configuration module
"""
from pydantic import BaseSettings


class Settings(BaseSettings):
    """
    Backend settings
    """

    debug: str
    port: int


SETTINGS = Settings()
