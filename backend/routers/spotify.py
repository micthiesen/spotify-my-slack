"""
Spotify OAuth grant routes
"""
from datetime import datetime, timedelta, timezone
from typing import Optional, cast
from urllib.parse import urlencode

from fastapi.routing import APIRouter
from starlette.requests import Request
from starlette.responses import RedirectResponse

from backend.config import LOGGER, SETTINGS
from backend.utils.auth import log_in
from backend.utils.spotify import (
    GrantType,
    MeData,
    SpotifyApiError,
    TokenExchangeData,
    get_me,
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
    request: Request, code: Optional[str] = None, error: Optional[str] = None
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
        exchange_data: TokenExchangeData = await get_new_access_token(
            cast(str, code), GrantType.CODE  # Checks above ensure code is str
        )
    except SpotifyApiError as err:
        LOGGER.warning("%s", err)
        return RedirectResponse("/")

    try:
        me_data: MeData = await get_me(exchange_data.access_token)
    except SpotifyApiError as err:
        LOGGER.warning("%s", err)
        return RedirectResponse("/")

    request.session["spotify_id"] = me_data.id
    request.session["spotify_expires_at"] = (
        datetime.now(timezone.utc)
        + timedelta(seconds=exchange_data.expires_in)
    ).isoformat()
    request.session["spotify_access_token"] = exchange_data.access_token
    request.session["spotify_refresh_token"] = exchange_data.refresh_token

    await log_in(request)

    return RedirectResponse("/")
