#!/usr/bin/env python
"""
Manage & interact with the project
"""
if __name__ == "__main__":
    import asyncio
    import sys
    from IPython import embed

    # Ensure `import backend.something` works
    sys.path.append("/spotify-my-slack")

    # pylint:disable=unused-import,unused-wildcard-import,wildcard-import
    from backend.database import DATABASE, METADATA
    from backend.database.users import User
    from backend.utils.emojis import *
    from backend.utils.slack import *
    from backend.utils.spotify import *

    LOOP = asyncio.new_event_loop()
    asyncio.set_event_loop(LOOP)
    LOOP.run_until_complete(DATABASE.connect())

    embed(using="asyncio")
