"""
Frontend (SPA) routes. Serves static files built by the frontend
"""
import os

from fastapi import FastAPI
from starlette.staticfiles import FileResponse, StaticFiles
from starlette.responses import Response
from starlette.types import Receive, Scope, Send


class StaticFilesLocal(StaticFiles):
    """
    Subclass to ensure static files from the frontend are always cached
    """
    def file_response(
        self,
        full_path: str,
        stat_result: os.stat_result,
        scope: Scope,
        status_code: int = 200,
    ) -> Response:
        return FileResponse(
            full_path,
            status_code=status_code,
            headers={"Cache-Control": "public, max-age=86400"},
            stat_result=stat_result,
            method=scope["method"],
        )


STATIC_FILES_APP = StaticFilesLocal(directory="frontend/build/static")
STATIC_FILES_PATH = "/static"
STATIC_FILES_NAME = "frontend_static"


ROUTER = FastAPI()


@ROUTER.get("/")
async def frontend_index():
    return FileResponse(
        "frontend/build/index.html", headers={"Cache-Control": "no-store"}
    )
