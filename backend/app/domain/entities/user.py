"""Domain Entity — User"""
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    VIEWER = "viewer"


@dataclass
class User:
    """Core user domain entity."""
    firebase_uid: str                           # Firebase Auth UID
    email: str
    display_name: str = ""
    photo_url: str = ""
    role: UserRole = UserRole.VIEWER
    is_active: bool = True
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_login: datetime = field(default_factory=datetime.utcnow)

    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN

    @property
    def can_write(self) -> bool:
        return self.role in (UserRole.ADMIN, UserRole.ANALYST)
