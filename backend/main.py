"""
Entrypoint for the backend (FastAPI)
"""
from fastapi import FastAPI

from backend.routers import frontend


APP = FastAPI()


APP.mount(
    frontend.STATIC_FILES_PATH,
    frontend.STATIC_FILES_APP,
    name=frontend.STATIC_FILES_NAME,
)
APP.include_router(frontend.ROUTER)
