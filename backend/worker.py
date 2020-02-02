"""
Worker module
"""
import asyncio
import logging


LOGGER = logging.getLogger("backend")


async def do_fake_work(index, sleep):
    """
    Fake work function
    """
    del index
    # LOGGER.info("Finished work for %s", index)
    await asyncio.sleep(sleep)


async def worker_entrypoint() -> None:
    """
    The entrypoint for the worker. Currently a stub
    """
    while True:
        # LOGGER.info("In the worker function")
        tasks = (do_fake_work(i, 10) for i in range(2))
        await asyncio.gather(*tasks)
