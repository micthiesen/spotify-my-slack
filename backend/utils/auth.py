"""
Auth utilities
"""
from typing import Optional

from starlette.requests import Request

from backend.config import LOGGER
from backend.database.users import User, get_or_create_from_session


async def sign_in(request: Request) -> Optional[User]:
    """
    Try signing in the user (creating or updated them)

    Returns None if the user can't be signed in.
    """
    user, created = await get_or_create_from_session(session=request.session)
    if user:
        LOGGER.info(
            "User %s signed in (%s) [%s]",
            user.id,
            "created" if created else "updated",
            request.client,
        )
        request.session.clear()
        request.session["user_id"] = user.id
    else:
        LOGGER.debug("User sign in attempt failed [%s]", request.client)
    return user


def sign_out(request: Request) -> None:
    """
    Sign out the user
    """
    request.session.clear()
