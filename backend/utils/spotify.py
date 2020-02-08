"""
Spotify utilities
"""
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel

from backend.config import SETTINGS
from backend.utils.http import BaseApiError, gen_make_request


class SpotifyApiError(BaseApiError):
    """
    Error when accessing the Spotify API
    """


MAKE_REQUEST = gen_make_request("Spotify", SpotifyApiError)
ME_URI = "https://api.spotify.com/v1/me"
PLAYER_URI = "https://api.spotify.com/v1/me/player"
TOKEN_EXCHANGE_URI = "https://accounts.spotify.com/api/token"


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

    return await MAKE_REQUEST(
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
    return await MAKE_REQUEST("GET", ME_URI, MeData, access_token=access_token)


class Device(BaseModel):
    """
    A Spotify device
    """

    id: Optional[str]
    is_active: bool
    name: str
    type: str


class Album(BaseModel):
    """
    A Spotify album
    """

    album_type: str
    id: str
    name: str
    uri: str


class Artist(BaseModel):
    """
    A Spotify artist
    """

    id: str
    name: str
    uri: str


class TrackItem(BaseModel):
    """
    A Spotify track being played
    """

    album: Album
    artists: List[Artist]
    duration_ms: int
    explicit: bool
    id: str
    name: str
    popularity: int
    preview_url: str
    uri: str
    is_local: bool


class PlayerData(BaseModel):
    """
    Data returned by Spotify after a 'player' request
    """

    device: Device
    progress_ms: Optional[int]
    is_playing: bool
    item: Optional[TrackItem]


async def get_player(access_token: str) -> Optional[PlayerData]:
    """
    Get information about the user's current player state
    """
    try:
        return await MAKE_REQUEST(
            "GET", PLAYER_URI, PlayerData, access_token=access_token
        )
    except SpotifyApiError as err:
        if err.error_code == 204:
            return None
        raise
