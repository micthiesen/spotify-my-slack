"""
Entrypoint for the backend (FastAPI)
"""
import asyncio
import logging

import uvicorn
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from backend.config import LOGGER, SETTINGS
from backend.routers import frontend, slack, spotify, users
from backend.worker import worker_entrypoint


APP = FastAPI()

# Temporary hack to allow access to the cookie within the frontend
APP.add_middleware(SessionMiddleware, secret_key=SETTINGS.sss_secret_key)
APP.error_middleware.app.security_flags = "samesite=lax"  # type:ignore

APP.mount(
    frontend.STATIC_FILES_PATH,
    frontend.STATIC_FILES_APP,
    name=frontend.STATIC_FILES_NAME,
)

APP.include_router(frontend.ROUTER)
APP.include_router(slack.ROUTER)
APP.include_router(spotify.ROUTER)
APP.include_router(users.ROUTER)


@APP.on_event("startup")
async def startup():
    """
    Startup actions
    """


@APP.on_event("shutdown")
async def shutdown():
    """
    Shutdown actions
    """
    current_task = asyncio.current_task()
    other_tasks = [t for t in asyncio.all_tasks() if t is not current_task]
    LOGGER.info("Cancelling %s outstanding tasks", len(other_tasks))
    for task in other_tasks:
        task.cancel()

    await asyncio.gather(
        *other_tasks, DATABASE.disconnect(), return_exceptions=True
    )
    LOGGER.info("Flushing metrics")
    asyncio.get_event_loop().stop()


if __name__ == "__main__":
    logging.basicConfig(level=2, format="%(levelname)-9s %(message)s")
    CONFIG = uvicorn.Config(
        "backend.main:APP",
        host="0.0.0.0",
        port=SETTINGS.port,
        lifespan="on",
        loop="uvloop",
        log_level="info",
        use_colors=True,
    )
    SERVER = uvicorn.Server(config=CONFIG)
    CONFIG.setup_event_loop()
    LOOP = asyncio.get_event_loop()

    from backend.database import DATABASE

    LOOP.run_until_complete(DATABASE.connect())
    try:
        LOOP.run_until_complete(
            asyncio.gather(SERVER.serve(), worker_entrypoint())
        )
    finally:
        LOOP.close()
        LOGGER.info("Shutdown successful")
