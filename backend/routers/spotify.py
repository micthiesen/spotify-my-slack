"""
Spotify OAuth grant routes
"""
from typing import Optional, cast
from urllib.parse import urlencode

import httpx
from fastapi.routing import APIRouter
from pydantic import BaseModel, ValidationError
from starlette.responses import RedirectResponse

from backend.conf import LOGGER, SETTINGS


AUTHORIZE_SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
]
AUTHORIZE_URI = "https://accounts.spotify.com/authorize"
TOKEN_EXCHANGE_URI = "https://accounts.spotify.com/api/token"
ROUTER = APIRouter()


class TokenExchangeData(BaseModel):
    """
    Data returned by Spotify after exchanging tokens
    """

    access_token: str
    token_type: str
    scope: str
    expires_in: int
    refresh_token: str


@ROUTER.get("/spotify-grant")
async def spotify_grant():
    """
    Spotify grant redirect (request access & refresh tokens)
    """
    # TODO include state data
    grant_args = {
        "client_id": SETTINGS.spotify_client_id,
        "response_type": "code",
        "scope": AUTHORIZE_SCOPES,
        "redirect_uri": SETTINGS.spotify_redirect_uri,
    }
    return RedirectResponse(
        f"{AUTHORIZE_URI}?{urlencode(grant_args, doseq=True)}"
    )


@ROUTER.get("/spotify-grant-callback")
async def spotify_grant_callback(
    code: Optional[str] = None, error: Optional[str] = None
):
    """
    Spotify grant callback (receive access & refresh tokens)
    """
    if code is None and error is None:
        error = f"Neither 'code' nor 'error' were provided from Spotify"
    if error is not None:
        LOGGER.info("Spotify grant callback error: %s", error)
        return RedirectResponse("/")

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
        LOGGER.info(
            "Unexpected %s response from Spotify when exchanging tokens: %s",
            response.status_code,
            response.text,
        )
        return RedirectResponse("/")

    try:
        exchange_json = cast(dict, response.json())
        exchange_data = TokenExchangeData(**exchange_json)
    except (ValidationError, ValueError) as err:
        LOGGER.info(
            "Could not decode response from Spotify when exchaning tokens: %s",
            err,
        )
        return RedirectResponse("/")

    # TODO save the access token to the database
    LOGGER.info("Got exhange data from Spotify! %s", exchange_data)

    return RedirectResponse("/")
