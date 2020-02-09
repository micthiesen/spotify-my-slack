"""
Worker module
"""
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Optional

from backend.database.users import User
from backend.config import LOGGER
from backend.utils.emojis import get_custom_emoji
from backend.utils.slack import (
    SlackApiError,
    UserProfileArgs,
    set_status,
)
from backend.utils.spotify import (
    GrantType,
    PlayerData,
    SpotifyApiError,
    TokenExchangeData,
    calc_spotify_expiry,
    get_new_access_token,
    get_player,
)


async def _update_user(user: User) -> None:
    """
    Update a single user
    """
    LOGGER.debug("Spotify token expires at %s", user.spotifyExpiresAt)
    spotify_token_expired = user.spotifyExpiresAt <= datetime.now(
        timezone.utc
    ) - timedelta(minutes=5)
    if spotify_token_expired and not user.spotifyRefreshToken:
        LOGGER.warning(
            "Deleting user %s as their Spotify token is expired and no "
            "refresh token is available :(",
            user.id,
        )
        await user.delete()
        return

    # Handle Spotify token refreshes
    if spotify_token_expired:
        LOGGER.debug("Refreshing Spotify token for user %s", user.id)
        try:
            exchange_data: TokenExchangeData = await get_new_access_token(
                user.spotifyRefreshToken, GrantType.REFRESH_TOKEN
            )
        except SpotifyApiError as err:
            LOGGER.warning(
                "Exiting update loop. Could not refresh Spotify token for "
                "user %s: %s",
                user.id,
                err,
            )
            return
        await user.update(
            spotifyExpiresAt=calc_spotify_expiry(exchange_data.expires_in),
            spotifyAccessToken=exchange_data.access_token,
            spotifyRefreshToken=exchange_data.refresh_token or "",
            updatedAt=datetime.now(timezone.utc),
        )
        LOGGER.debug("Refreshing Spotify token for user %s COMPLETE", user.id)

    # Retrieve Spotify player status
    LOGGER.debug("Updating user %s", user.id)  # TODO rm
    try:
        player: Optional[PlayerData] = await get_player(
            user.spotifyAccessToken
        )
    except SpotifyApiError as err:
        LOGGER.warning(
            "Exiting update loop. Could not retrieve player data for user %s: "
            "%s",
            user.id,
            err,
        )
        return
    if player is not None and player.item is not None and player.is_playing:
        if len(player.item.artists) == 0:
            by_artists = ""
        else:
            by_artists = (
                f' by {", ".join(a.name for a in player.item.artists)}'
            )
        user_profile_args = UserProfileArgs(
            status_text=f"{player.item.name}{by_artists}",
            status_emoji=get_custom_emoji(user, player.item),
        )
        LOGGER.debug("Setting user status %s", user_profile_args)  # TODO rm
        await _set_user_status(user, user_profile_args, True)
    elif user.statusSetLastTime:
        LOGGER.debug("Clearing user status")  # TODO rm
        user_profile_args = UserProfileArgs(status_text="", status_emoji="")
        await _set_user_status(user, user_profile_args, False)
    else:
        LOGGER.debug("Nothing playing and nothing to clear")  # TODO rm

    await asyncio.sleep(5)


async def _set_user_status(
    user: User, user_profile_args: UserProfileArgs, status_set_last_time: bool
) -> bool:
    """
    Set the user status & update their database entry
    """
    try:
        await set_status(user_profile_args, user.slackAccessToken)
    except SlackApiError as err:
        LOGGER.warning(
            "Exiting update loop. Could not set status for user %s: " "%s",
            user.id,
            err,
        )
        return False
    await user.update(
        statusSetLastTime=status_set_last_time,
        updatedAt=datetime.now(timezone.utc),
    )
    return True


async def _throttled_update_user(user, sem):
    async with sem:  # semaphore limits num of simultaneous updated
        return await _update_user(user)


async def worker_entrypoint() -> None:
    """
    The entrypoint for the worker. Currently a stub
    """
    sem = asyncio.Semaphore(10)
    while True:
        LOGGER.debug("Starting global update loop")
        update_tasks = [
            _throttled_update_user(user=user, sem=sem)
            for user in await User.objects.filter(id__gte=7769).all()
        ]
        await asyncio.gather(*update_tasks)
        await asyncio.sleep(5)
