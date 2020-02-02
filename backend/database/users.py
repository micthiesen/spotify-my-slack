"""
User model & CRUD
"""
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    UniqueConstraint,
)

from backend.database import Base


class User(Base):
    """
    User model
    """

    __tablename__ = "Users"

    id = Column("id", Integer, primary_key=True, nullable=False, index=True,)
    spotify_id = Column("spotifyId", String(length=255), nullable=False)
    spotify_expires_at = Column(
        "spotifyExpiresAt", DateTime(timezone=True), nullable=False
    )
    spotify_access_token = Column(
        "spotifyAccessToken", String(length=255), nullable=False
    )
    spotify_refresh_token = Column(
        "spotifyRefreshToken", String(length=255), nullable=False
    )
    slack_id = Column("slackId", String(length=255), nullable=False)
    slack_access_token = Column(
        "slackAccessToken", String(length=255), nullable=False
    )
    created_at = Column("createdAt", DateTime(timezone=True), nullable=False)
    updated_at = Column("updatedAt", DateTime(timezone=True), nullable=False)
    status_set_last_time = Column(
        "statusSetLastTime", Boolean, default=False, nullable=False
    )
    use_custom_emojis = Column(
        "useCustomEmojis", Boolean, default=True, nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "slackId", "spotifyId", name="user_unique_constraint"
        ),
    )
