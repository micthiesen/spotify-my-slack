"""
User model & CRUD
"""
import orm

from backend.database import DATABASE, METADATA


class User(orm.Model):
    """
    User model
    """

    __tablename__ = "Users"
    __database__ = DATABASE
    __metadata__ = METADATA

    id = orm.Integer(primary_key=True, index=True)
    spotifyId = orm.String(max_length=255)
    spotifyExpiresAt = orm.DateTime(max_length=255)
    spotifyAccessToken = orm.String(max_length=255)
    spotifyRefreshToken = orm.String(max_length=255)
    slackId = orm.String(max_length=255)
    slackAccessToken = orm.String(max_length=255)
    createdAt = orm.DateTime()
    updatedAt = orm.DateTime()
    statusSetLastTime = orm.Boolean(default=False)
    useCustomEmojis = orm.Boolean(default=True)
