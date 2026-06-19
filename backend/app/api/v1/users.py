"""Users management endpoint"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional

from app.infrastructure.database.base import get_db
from app.infrastructure.database.models.user_model import UserModel
from app.api.middleware.firebase_auth import require_any, require_admin
from app.domain.entities.user import UserRole

router = APIRouter()


class UserResponse(BaseModel):
    firebase_uid: str
    email: str
    display_name: str
    photo_url: str
    role: str
    is_active: bool
    model_config = {"from_attributes": True}


class UpdateRoleRequest(BaseModel):
    role: UserRole


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: UserModel = Depends(require_any),
):
    return UserResponse.model_validate(current_user)


@router.get("", response_model=list[UserResponse])
async def list_users(
    current_user: UserModel = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin only — list all platform users."""
    result = await db.execute(select(UserModel).order_by(UserModel.created_at.desc()))
    users = result.scalars().all()
    return [UserResponse.model_validate(u) for u in users]


@router.patch("/{firebase_uid}/role")
async def update_user_role(
    firebase_uid: str,
    payload: UpdateRoleRequest,
    current_user: UserModel = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin only — update a user's role."""
    result = await db.execute(
        select(UserModel).where(UserModel.firebase_uid == firebase_uid)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "User not found"})

    user.role = payload.role.value
    await db.flush()
    return {"success": True, "data": {"role": user.role}, "error": None}
