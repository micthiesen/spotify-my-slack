"""
Entrypoint for the backend (FastAPI)
"""
import asyncio
import logging

import uvicorn
from fastapi import FastAPI

from backend.conf import SETTINGS
from backend.routers import frontend
from backend.worker import worker_entrypoint


APP = FastAPI()
LOGGER = logging.getLogger("backend")


APP.mount(
    frontend.STATIC_FILES_PATH,
    frontend.STATIC_FILES_APP,
    name=frontend.STATIC_FILES_NAME,
)
APP.include_router(frontend.ROUTER)


if __name__ == "__main__":
    logging.basicConfig(level=2, format="%(levelname)-9s %(message)s")

    CONFIG = uvicorn.Config(
        "backend.main:APP",
        host="0.0.0.0",
        port=SETTINGS.port,
        loop="uvloop",
        log_level="info",
        use_colors=True,
    )
    SERVER = uvicorn.Server(config=CONFIG)

    # Start both the server & worker together
    CONFIG.setup_event_loop()
    LOOP = asyncio.get_event_loop()
    try:
        LOOP.run_until_complete(asyncio.gather(SERVER.serve(), worker_entrypoint()))
    finally:
        LOOP.close()
        LOGGER.info("Shutdown successful")
