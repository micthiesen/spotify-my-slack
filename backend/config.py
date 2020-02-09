"""
Configuration module
"""
import logging
from typing import Optional

from pydantic import BaseSettings


class Settings(BaseSettings):
    """
    Backend settings
    """

    debug: Optional[bool] = False
    new_relic_enabled: Optional[bool] = False
    port: int
    sss_secret_key: str
    update_loop_default_interval: int
    worker_coroutines: int = 100

    database_url: str

    slack_client_id: str
    slack_client_secret: str
    slack_redirect_uri: str

    spotify_client_id: str
    spotify_client_secret: str
    spotify_redirect_uri: str


SETTINGS = Settings()
LOGGER = logging.getLogger("backend")
LOGGER.setLevel(logging.DEBUG if SETTINGS.debug else logging.INFO)
