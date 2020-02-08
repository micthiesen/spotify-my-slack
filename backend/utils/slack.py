"""
Slack utilities
"""
from pydantic import BaseModel

from backend.config import SETTINGS
from backend.utils.http import BaseApiError, gen_make_request


class SlackApiError(BaseApiError):
    """
    Error when accessing the Slack API
    """


MAKE_REQUEST = gen_make_request("Slack", SlackApiError)
TOKEN_EXCHANGE_URI = "https://slack.com/api/oauth.access"


class TokenExchangeData(BaseModel):
    """
    Data returned by Slack after exchanging tokens
    """

    ok: bool
    access_token: str
    scope: str
    user_id: str
    team_id: str
    team_name: str


async def get_new_access_token(code: str) -> TokenExchangeData:
    """
    Exchange a code for a new access token
    """
    exchange_args = {
        "client_id": SETTINGS.slack_client_id,
        "client_secret": SETTINGS.slack_client_secret,
        "code": code,
        "redirect_uri": SETTINGS.slack_redirect_uri,
    }
    return await MAKE_REQUEST(
        "POST", TOKEN_EXCHANGE_URI, TokenExchangeData, data=exchange_args,
    )
