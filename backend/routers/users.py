"""
User routes
"""
from fastapi.routing import APIRouter
from starlette.requests import Request
from starlette.responses import RedirectResponse

from backend.config import LOGGER
from backend.utils import auth


ROUTER = APIRouter()


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
