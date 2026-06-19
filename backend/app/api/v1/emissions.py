"""
Emissions API — Full CRUD + paginated list + summary KPIs.
"""
import math
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.infrastructure.database.base import get_db
from app.infrastructure.database.models.emission_model import EmissionModel
from app.infrastructure.database.models.user_model import UserModel
from app.api.middleware.firebase_auth import require_any, require_analyst
from app.api.middleware.rate_limiter import limiter
from app.application.schemas.emission_schema import (
    EmissionCreateRequest,
    EmissionUpdateRequest,
    EmissionResponse,
    EmissionListResponse,
    EmissionSummary,
    MonthlyTrend,
)
from app.domain.entities.emission import EmissionScope
from app.domain.services.emission_factors import EMISSION_FACTORS

router = APIRouter()


def _get_default_factor(category: str, unit: str) -> float:
    """Look up a default emission factor based on category."""
    mapping = {
        "stationary_combustion": EMISSION_FACTORS.get("natural_gas_liter", 1.89),
        "mobile_combustion": EMISSION_FACTORS.get("car_petrol_km", 0.192),
        "purchased_electricity": EMISSION_FACTORS.get("electricity_india_kwh", 0.82),
        "business_travel": EMISSION_FACTORS.get("flight_short_km", 0.255),
        "waste_disposal": EMISSION_FACTORS.get("landfill_tonne", 467.0) / 1000,
    }
    return mapping.get(category, 1.0)


@router.get("/summary", response_model=EmissionSummary)
async def get_emission_summary(
    current_user: UserModel = Depends(require_any),
    db: AsyncSession = Depends(get_db),
):
    """Dashboard KPI summary — total emissions, scope breakdown, MoM change."""
    now = datetime.utcnow()
    this_month_start = now.replace(day=1, hour=0, minute=0, second=0)
    last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)

    # Total per scope
    scope_totals = {}
    for scope in EmissionScope:
        result = await db.execute(
            select(func.coalesce(func.sum(EmissionModel.co2_equivalent_kg), 0.0))
            .where(EmissionModel.user_id == current_user.firebase_uid)
            .where(EmissionModel.scope == scope)
        )
        scope_totals[scope.value] = result.scalar() or 0.0

    total_kg = sum(scope_totals.values())

    # Monthly comparison
    this_month_result = await db.execute(
        select(func.coalesce(func.sum(EmissionModel.co2_equivalent_kg), 0.0))
        .where(EmissionModel.user_id == current_user.firebase_uid)
        .where(EmissionModel.date >= this_month_start)
    )
    this_month_kg = this_month_result.scalar() or 0.0

    last_month_result = await db.execute(
        select(func.coalesce(func.sum(EmissionModel.co2_equivalent_kg), 0.0))
        .where(EmissionModel.user_id == current_user.firebase_uid)
        .where(and_(EmissionModel.date >= last_month_start, EmissionModel.date < this_month_start))
    )
    last_month_kg = last_month_result.scalar() or 0.0

    change_pct = 0.0
    if last_month_kg > 0:
        change_pct = ((this_month_kg - last_month_kg) / last_month_kg) * 100

    # Net zero target: assume 10,000 kg baseline, track reduction progress
    baseline_kg = 10_000.0
    net_zero_pct = max(0.0, min(100.0, ((baseline_kg - total_kg) / baseline_kg) * 100)) if total_kg > 0 else 0.0

    return EmissionSummary(
        total_emissions_kg=total_kg,
        total_emissions_tonnes=total_kg / 1000,
        scope_1_kg=scope_totals.get("scope_1", 0.0),
        scope_2_kg=scope_totals.get("scope_2", 0.0),
        scope_3_kg=scope_totals.get("scope_3", 0.0),
        change_vs_last_month_pct=round(change_pct, 2),
        this_month_kg=this_month_kg,
        last_month_kg=last_month_kg,
        net_zero_progress_pct=round(net_zero_pct, 2),
        top_category="purchased_electricity",
    )


@router.get("", response_model=EmissionListResponse)
async def list_emissions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    scope: Optional[EmissionScope] = None,
    search: Optional[str] = None,
    current_user: UserModel = Depends(require_any),
    db: AsyncSession = Depends(get_db),
):
    """Paginated emission records with optional scope and search filters."""
    filters = [EmissionModel.user_id == current_user.firebase_uid]
    if scope:
        filters.append(EmissionModel.scope == scope)
    if search:
        filters.append(EmissionModel.title.ilike(f"%{search}%"))

    # Count
    count_result = await db.execute(
        select(func.count()).select_from(EmissionModel).where(and_(*filters))
    )
    total = count_result.scalar() or 0

    # Total CO2e
    co2e_result = await db.execute(
        select(func.coalesce(func.sum(EmissionModel.co2_equivalent_kg), 0.0))
        .where(and_(*filters))
    )
    total_co2e_kg = co2e_result.scalar() or 0.0

    # Paginated records
    offset = (page - 1) * page_size
    records_result = await db.execute(
        select(EmissionModel)
        .where(and_(*filters))
        .order_by(EmissionModel.date.desc())
        .offset(offset)
        .limit(page_size)
    )
    records = records_result.scalars().all()

    return EmissionListResponse(
        items=[EmissionResponse.model_validate(r) for r in records],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 1,
        total_co2e_kg=total_co2e_kg,
        total_co2e_tonnes=total_co2e_kg / 1000,
    )


@router.post("", response_model=EmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_emission(
    payload: EmissionCreateRequest,
    current_user: UserModel = Depends(require_analyst),
    db: AsyncSession = Depends(get_db),
):
    """Log a new emission record. Automatically calculates CO₂e."""
    factor = payload.emission_factor or _get_default_factor(
        payload.category.value, payload.unit.value
    )
    co2e_kg = payload.amount * factor

    record = EmissionModel(
        user_id=current_user.firebase_uid,
        title=payload.title,
        description=payload.description or "",
        scope=payload.scope,
        category=payload.category,
        amount=payload.amount,
        unit=payload.unit,
        co2_equivalent_kg=co2e_kg,
        emission_factor=factor,
        source=payload.source or "",
        location=payload.location or "",
        date=payload.date,
    )
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return EmissionResponse.model_validate(record)


@router.get("/{emission_id}", response_model=EmissionResponse)
async def get_emission(
    emission_id: UUID,
    current_user: UserModel = Depends(require_any),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(EmissionModel).where(
            and_(
                EmissionModel.id == emission_id,
                EmissionModel.user_id == current_user.firebase_uid,
            )
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Emission record not found"})
    return EmissionResponse.model_validate(record)


@router.patch("/{emission_id}", response_model=EmissionResponse)
async def update_emission(
    emission_id: UUID,
    payload: EmissionUpdateRequest,
    current_user: UserModel = Depends(require_analyst),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(EmissionModel).where(
            and_(EmissionModel.id == emission_id, EmissionModel.user_id == current_user.firebase_uid)
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Emission record not found"})

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)

    if "amount" in update_data or "emission_factor" in update_data:
        record.co2_equivalent_kg = record.amount * record.emission_factor

    await db.flush()
    await db.refresh(record)
    return EmissionResponse.model_validate(record)


@router.delete("/{emission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_emission(
    emission_id: UUID,
    current_user: UserModel = Depends(require_analyst),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(EmissionModel).where(
            and_(EmissionModel.id == emission_id, EmissionModel.user_id == current_user.firebase_uid)
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Emission record not found"})
    await db.delete(record)
