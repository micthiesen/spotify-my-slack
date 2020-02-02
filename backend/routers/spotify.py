"""
Spotify OAuth grant routes
"""
from typing import Optional
from urllib.parse import urlencode

from fastapi.routing import APIRouter
from starlette.responses import RedirectResponse

from backend.conf import LOGGER, SETTINGS
from backend.utils.spotify import (
    GrantType,
    TokenExchangeError,
    get_new_access_token,
)


AUTHORIZE_SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
]
AUTHORIZE_URI = "https://accounts.spotify.com/authorize"
ROUTER = APIRouter()


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
        LOGGER.warning("Spotify grant callback error: %s", error)
        return RedirectResponse("/")

    try:
        exchange_data = await get_new_access_token(code, GrantType.CODE)
    except TokenExchangeError as err:
        LOGGER.warning("%s", err)
        return RedirectResponse("/")

    # TODO save the access token to the database
    LOGGER.info("Got exhange data from Spotify! %s", exchange_data)

    return RedirectResponse("/")
