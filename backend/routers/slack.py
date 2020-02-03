"""
Slack OAuth grant routes
"""
from typing import Optional
from urllib.parse import urlencode

from fastapi.routing import APIRouter
from starlette.requests import Request
from starlette.responses import RedirectResponse

from backend.config import LOGGER, SETTINGS
from backend.utils.auth import sign_in
from backend.utils.slack import (
    TokenExchangeData,
    TokenExchangeError,
    get_new_access_token,
)


AUTHORIZE_SCOPES = ["users.profile:write"]
AUTHORIZE_URI = "https://slack.com/oauth/authorize"
ROUTER = APIRouter()


@ROUTER.get("/slack-grant")
async def slack_grant(request: Request):
    """
    Slack grant redirect (request access token)
    """
    # TODO include state data
    grant_args = {
        "client_id": SETTINGS.slack_client_id,
        "scope": " ".join(AUTHORIZE_SCOPES),
        "redirect_uri": SETTINGS.slack_redirect_uri,
    }
    LOGGER.debug("Slack grant redirect initiated [%s]", request.client)
    return RedirectResponse(
        f"{AUTHORIZE_URI}?{urlencode(grant_args, doseq=True)}"
    )


@ROUTER.get("/slack-grant-callback")
async def slack_grant_callback(request: Request, code: Optional[str] = None):
    """
    Slack grant callback (receive access token)
    """
    if code is None:
        LOGGER.warning(
            "Spotify grant callback error: 'code' was not provided by Spotify"
        )
        return RedirectResponse("/")

    try:
        exchange_data: TokenExchangeData = await get_new_access_token(code,)
    except TokenExchangeError as err:
        LOGGER.warning("%s", err)
        return RedirectResponse("/")

    request.session["slack_id"] = exchange_data.user_id
    request.session["slack_access_token"] = exchange_data.access_token

    await sign_in(request)

    LOGGER.debug("Slack grant callback successful [%s]", request.client)
    return RedirectResponse("/")
