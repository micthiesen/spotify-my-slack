"""
Configuration module
"""
import logging

from pydantic import BaseSettings


class Settings(BaseSettings):
    """
    Backend settings
    """

    debug: bool
    new_relic_enabled: bool
    port: int
    sss_secret_key: str
    update_loop_default_interval: int

    database_url: str
    redis_url: str

    slack_client_id: str
    slack_client_secret: str
    slack_redirect_uri: str

    spotify_client_id: str
    spotify_client_secret: str
    spotify_redirect_uri: str


LOGGER = logging.getLogger("backend")
SETTINGS = Settings()
