"""
Spotify utilities
"""
from enum import Enum
from typing import Optional, Type, TypeVar, cast

import httpx
from pydantic import BaseModel, ValidationError

from backend.config import SETTINGS


ME_URI = "https://api.spotify.com/v1/me"
PLAYER_URI = "https://api.spotify.com/v1/me/player"
TOKEN_EXCHANGE_URI = "https://accounts.spotify.com/api/token"

T = TypeVar("T", bound=BaseModel)  # pylint:disable=invalid-name


class SpotifyApiError(Exception):
    """
    Error when accessing the Spotify API
    """

    def __init__(self, message: str, error_code: int) -> None:
        self.error_code = error_code
        super().__init__(message)


class GrantType(Enum):
    """
    The grant type to use when requesting access & refresh tokens
    """

    CODE = "authorization_code"
    REFRESH_TOKEN = "refresh_token"


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

    return await _make_request(
        "POST", TOKEN_EXCHANGE_URI, TokenExchangeData, data=exchange_args
    )


class MeData(BaseModel):
    """
    Data returned by Spotify after a 'me' request
    """

    display_name: Optional[str]
    href: str
    id: str
    uri: str


async def get_me(access_token: str) -> MeData:
    """
    Get the currently logged in user
    """
    return await _make_request(
        "GET", ME_URI, MeData, access_token=access_token
    )


class PlayerData(BaseModel):
    """
    Data returned by Spotify after a 'player' request
    """


async def get_player(access_token: str) -> PlayerData:
    """
    Get information about the user's current player state
    """
    return await _make_request(
        "GET", PLAYER_URI, PlayerData, access_token=access_token
    )


async def _make_request(
    method: str,
    uri: str,
    model: Type[T],
    *,
    access_token: Optional[str] = None,
    data: Optional[httpx.models.RequestData] = None,
) -> T:
    """
    Make a Spotify API request with error handling etc.
    """
    headers = (
        {}
        if access_token is None
        else {"Authorization": f"Bearer {access_token}"}
    )
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method, uri, data=data, headers=headers
        )
    if response.status_code != 200:
        raise SpotifyApiError(
            f"Unexpected {response.status_code} response from Spotify when "
            f"retrieving '{model.__name__}': {response.text}",
            error_code=response.status_code,
        )

    try:
        response_json = cast(dict, response.json())
        response_data = model(**response_json)
    except (ValidationError, ValueError) as err:
        raise SpotifyApiError(
            f"Could not decode response from Spotify when retrieving "
            f"'{model.__name__}': {err}",
            error_code=500,
        )
    return response_data
