"""
Auth utilities
"""
from typing import Optional

from starlette.requests import Request

from backend.config import LOGGER
from backend.database.users import User, get_or_create_from_session


async def log_in(request: Request) -> Optional[User]:
    """
    Try logging in the user (creating or updated them)

    Returns None if the user can't be logged in.
    """
    user = await get_or_create_from_session(session=request.session)
    if user:
        LOGGER.info("User %s logged in (created/updated)", user.id)
        request.session.clear()
        request.session["user_id"] = user.id
    return user
