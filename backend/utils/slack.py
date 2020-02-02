"""
Slack utilities
"""
from typing import cast

import httpx
from pydantic import BaseModel, ValidationError

from backend.config import SETTINGS


TOKEN_EXCHANGE_URI = "https://slack.com/api/oauth.access"


class TokenExchangeError(Exception):
    """
    Error when exchaging tokens with Slack
    """

    def __init__(self, message: str, error_code: int) -> None:
        self.error_code = error_code
        super().__init__(message)


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

    async with httpx.AsyncClient() as client:
        response = await client.post(TOKEN_EXCHANGE_URI, data=exchange_args)
    if response.status_code != 200:
        raise TokenExchangeError(
            f"Unexpected {response.status_code} response from Slack when "
            f"exchanging tokens: {response.text}",
            error_code=response.status_code,
        )

    try:
        exchange_json = cast(dict, response.json())
        exchange_data = TokenExchangeData(**exchange_json)
    except (ValidationError, ValueError) as err:
        raise TokenExchangeError(
            f"Could not decode response from Slack when exchanging tokens: "
            f"{err}",
            error_code=500,
        )
    return exchange_data
