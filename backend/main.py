"""
Entrypoint for the backend (FastAPI)
"""
import asyncio
import logging
import os

import uvicorn
from fastapi import FastAPI

from backend.routers import frontend
from backend.worker import worker_entrypoint


APP = FastAPI()
DEBUG = os.environ.get("DEBUG", "").lower() == "true"
logging.basicConfig(level=2, format="%(levelname)-9s %(message)s")


APP.mount(
    frontend.STATIC_FILES_PATH,
    frontend.STATIC_FILES_APP,
    name=frontend.STATIC_FILES_NAME,
)
APP.include_router(frontend.ROUTER)


if __name__ == "__main__":
    CONFIG = uvicorn.Config(
        "backend.main:APP",
        host="0.0.0.0",
        port=int(os.environ["PORT"]),
        loop="uvloop",
        log_level="info",
        use_colors=True,
    )
    SERVER = uvicorn.Server(config=CONFIG)

    # Start both the server & worker together
    CONFIG.setup_event_loop()
    LOOP = asyncio.get_event_loop()
    LOOP.run_until_complete(asyncio.gather(SERVER.serve(), worker_entrypoint()))
