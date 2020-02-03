"""
User model & CRUD
"""
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple

import orm
from pydantic import BaseModel, ValidationError

from backend.config import LOGGER
from backend.database import DATABASE, METADATA


class User(orm.Model):
    """
    User model
    """

    __tablename__ = "Users"
    __database__ = DATABASE
    __metadata__ = METADATA

    id = orm.Integer(primary_key=True, index=True)
    slackId = orm.String(max_length=255)
    slackAccessToken = orm.String(max_length=255)
    spotifyId = orm.String(max_length=255)
    spotifyExpiresAt = orm.DateTime(max_length=255)
    spotifyAccessToken = orm.String(max_length=255)
    spotifyRefreshToken = orm.String(max_length=255)
    createdAt = orm.DateTime()
    updatedAt = orm.DateTime()
    statusSetLastTime = orm.Boolean(default=False)
    useCustomEmojis = orm.Boolean(default=True)


class FullSession(BaseModel):
    """
    A full session with all the info required to login/create a user
    """

    slack_id: str
    slack_access_token: str
    spotify_id: str
    spotify_expires_at: datetime
    spotify_access_token: str
    spotify_refresh_token: Optional[str] = None


@DATABASE.transaction()
async def get_or_create_from_session(
    session: Dict[str, Any]
) -> Tuple[Optional[User], bool]:
    """
    Get or create a user based on auth info in their session
    """
    created = False
    now = datetime.now(timezone.utc)
    try:
        full_session = FullSession(**session)
    except ValidationError:
        return (None, created)

    try:
        user = await User.objects.get(
            slackId=full_session.slack_id, spotifyId=full_session.spotify_id,
        )
    except orm.exceptions.MultipleMatches:
        LOGGER.error(
            "Multiple users returned for slack_id=%s, spotify_id=%s!",
            full_session.slack_id,
            full_session.spotify_id,
        )
        user = None
    except orm.exceptions.NoMatch:
        created = True
        user = await User.objects.create(
            slackId=full_session.slack_id,
            slackAccessToken=full_session.slack_access_token,
            spotifyId=full_session.spotify_id,
            spotifyExpiresAt=full_session.spotify_expires_at,
            spotifyAccessToken=full_session.spotify_access_token,
            spotifyRefreshToken=full_session.spotify_refresh_token,
            createdAt=now,
            updatedAt=now,
        )
    else:
        await user.update(
            slackAccessToken=full_session.slack_access_token,
            spotifyExpiresAt=full_session.spotify_expires_at,
            spotifyAccessToken=full_session.spotify_access_token,
            spotifyRefreshToken=full_session.spotify_refresh_token,
            updatedAt=now,
        )

    return (user, created)
