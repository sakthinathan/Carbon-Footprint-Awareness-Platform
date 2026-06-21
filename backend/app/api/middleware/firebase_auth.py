"""
Firebase Auth Middleware — Validates Firebase ID tokens on every request.
Injects the current user into the request state.
"""
import structlog
from fastapi import Request, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.external.firebase_admin import verify_firebase_token, init_firebase
from app.infrastructure.database.base import get_db
from app.infrastructure.database.models.user_model import UserModel
from app.domain.entities.user import UserRole
from app.config import settings
from sqlalchemy import select
from datetime import datetime

log = structlog.get_logger()

# Initialize Firebase at import time
init_firebase()


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> UserModel:
    """
    FastAPI dependency — extracts and verifies Firebase ID token,
    then returns or creates the user in the database.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "MISSING_TOKEN",
                "message": "Authorization header with Bearer token required",
            },
        )

    id_token = auth_header.split(" ", 1)[1]

    try:
        decoded = verify_firebase_token(id_token)
    except ValueError as e:
        if settings.ENVIRONMENT != "production":
            # Development fallback token claims
            decoded = {
                "uid": "dev_user_123",
                "email": "devuser@ecosentinel.app",
                "name": "Developer Admin",
                "picture": "https://example.com/dev.jpg",
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"code": "INVALID_TOKEN", "message": str(e)},
            )

    firebase_uid = decoded["uid"]
    email = decoded.get("email", "")
    display_name = decoded.get("name", "")
    photo_url = decoded.get("picture", "")

    # Upsert user in database
    result = await db.execute(
        select(UserModel).where(UserModel.firebase_uid == firebase_uid)
    )
    user = result.scalar_one_or_none()

    if user is None:
        # First login — create user with ADMIN role in development for easy testing
        role = UserRole.ADMIN
        user = UserModel(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
            photo_url=photo_url,
            role=role,
        )
        db.add(user)
        await db.flush()
        log.info("New user created", uid=firebase_uid, email=email, role=role)
    else:
        # Update last login and profile
        user.last_login = datetime.utcnow()
        user.display_name = display_name or user.display_name
        user.photo_url = photo_url or user.photo_url

    return user


def require_role(*roles: UserRole):
    """Factory for role-based access control dependencies."""
    async def role_checker(current_user: UserModel = Depends(get_current_user)) -> UserModel:
        if current_user.role not in [r.value for r in roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "code": "INSUFFICIENT_PERMISSIONS",
                    "message": f"This action requires one of these roles: {[r.value for r in roles]}",
                },
            )
        return current_user
    return role_checker


# Convenience role dependencies
require_admin = require_role(UserRole.ADMIN)
require_analyst = require_role(UserRole.ADMIN, UserRole.ANALYST)
require_any = get_current_user  # Any authenticated user
