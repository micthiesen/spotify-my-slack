"""
Spotify utilities
"""
from typing import cast

import httpx
from pydantic import BaseModel, ValidationError

from backend.conf import SETTINGS


TOKEN_EXCHANGE_URI = "https://accounts.spotify.com/api/token"


class TokenExchangeError(Exception):
    """
    Error when exchaging tokens with Spotify
    """


class TokenExchangeData(BaseModel):
    """
    Data returned by Spotify after exchanging tokens
    """

    access_token: str
    token_type: str
    scope: str
    expires_in: int
    refresh_token: str


async def exchange_code_for_tokens(code: str) -> TokenExchangeData:
    """
    Exchange an authorization code for an access & refresh token
    """
    exchange_args = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SETTINGS.spotify_redirect_uri,
        "client_id": SETTINGS.spotify_client_id,
        "client_secret": SETTINGS.spotify_client_secret,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(TOKEN_EXCHANGE_URI, data=exchange_args)
    if response.status_code != 200:
        raise TokenExchangeError(
            f"Unexpected {response.status_code} response from Spotify when "
            f"exchanging tokens: {response.text}",
        )

    try:
        exchange_json = cast(dict, response.json())
        exchange_data = TokenExchangeData(**exchange_json)
    except (ValidationError, ValueError) as err:
        raise TokenExchangeError(
            f"Could not decode response from Spotify when exchanging tokens: "
            f"{err}",
        )
    return exchange_data
