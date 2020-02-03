"""
User routes
"""
import orm
from fastapi.routing import APIRouter
from starlette.requests import Request
from starlette.responses import RedirectResponse

from backend.config import LOGGER
from backend.database import DATABASE
from backend.database.users import User
from backend.utils import auth


ROUTER = APIRouter()


@ROUTER.get("/delete-account")
@DATABASE.transaction()
async def delete_account(request: Request):
    """
    Delete account (stop monitoring)
    """
    try:
        user_id = request.session["user_id"]
    except KeyError:
        LOGGER.debug(
            "Unauthenticated user attempted to delete account [%s]",
            request.client,
        )
        return RedirectResponse("/")

    try:
        user = await User.objects.get(id=user_id)
    except orm.exceptions.NoMatch:
        LOGGER.warning(
            "User %s not found in the database; cannot delete [%s]",
            user_id,
            request.client,
        )
    else:
        await user.delete()
        LOGGER.info("User %s deleted account [%s]", user_id, request.client)

    auth.sign_out(request)
    return RedirectResponse("/")


@ROUTER.get("/sign-out")
async def sign_out(request: Request):
    """
    Sign out
    """
    try:
        user_id = request.session["user_id"]
    except KeyError:
        LOGGER.debug(
            "Unauthenticated user attempted to sign out [%s]", request.client
        )
    else:
        LOGGER.info("User %s signed out [%s]", user_id, request.client)

    auth.sign_out(request)
    return RedirectResponse("/")
