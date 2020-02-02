"""
Spotify utilities
"""
from enum import Enum
from typing import Optional, cast

import httpx
from pydantic import BaseModel, ValidationError

from backend.conf import SETTINGS


TOKEN_EXCHANGE_URI = "https://accounts.spotify.com/api/token"


class GrantType(Enum):
    """
    The grant type to use when requesting access & refresh tokens
    """

    CODE = "authorization_code"
    REFRESH_TOKEN = "refresh_token"


class TokenExchangeError(Exception):
    """
    Error when exchaging tokens with Spotify
    """

    def __init__(self, message: str, error_code: int) -> None:
        self.error_code = error_code
        super().__init__(message)


class TokenExchangeData(BaseModel):
    """
    Data returned by Spotify after exchanging tokens
    """

    access_token: str
    token_type: str
    scope: str
    expires_in: int
    refresh_token: Optional[str] = None


async def get_new_access_token(
    code_or_refresh_token: str, grant_type: GrantType
) -> TokenExchangeData:
    """
    Exchange a code or refresh token for a new access & refresh token
    """
    exchange_args = {
        "client_id": SETTINGS.spotify_client_id,
        "client_secret": SETTINGS.spotify_client_secret,
        "grant_type": grant_type.value,
        "redirect_uri": SETTINGS.spotify_redirect_uri,
    }
    if grant_type == GrantType.CODE:
        exchange_args["code"] = code_or_refresh_token
    elif grant_type == GrantType.REFRESH_TOKEN:
        exchange_args["refresh_token"] = code_or_refresh_token

    async with httpx.AsyncClient() as client:
        response = await client.post(TOKEN_EXCHANGE_URI, data=exchange_args)
    if response.status_code != 200:
        raise TokenExchangeError(
            f"Unexpected {response.status_code} response from Spotify when "
            f"exchanging tokens: {response.text}",
            error_code=response.status_code,
        )

    try:
        exchange_json = cast(dict, response.json())
        exchange_data = TokenExchangeData(**exchange_json)
    except (ValidationError, ValueError) as err:
        raise TokenExchangeError(
            f"Could not decode response from Spotify when exchanging tokens: "
            f"{err}",
            error_code=500,
        )
    return exchange_data
