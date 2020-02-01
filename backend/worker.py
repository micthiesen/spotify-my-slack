"""
Worker module
"""
import asyncio
import logging


LOGGER = logging.getLogger("backend")


async def worker_entrypoint() -> None:
    """
    The entrypoint for the worker. Currently a stub
    """
    while True:
        LOGGER.info("In the worker function")
        await asyncio.sleep(15)
