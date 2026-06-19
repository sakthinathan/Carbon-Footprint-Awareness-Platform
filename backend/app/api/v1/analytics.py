"""Analytics endpoints — monthly trends, scope breakdown, category distribution."""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract

from app.infrastructure.database.base import get_db
from app.infrastructure.database.models.emission_model import EmissionModel
from app.infrastructure.database.models.user_model import UserModel
from app.api.middleware.firebase_auth import require_any
from app.domain.entities.emission import EmissionScope, EmissionCategory
from app.domain.services.emission_factors import INDUSTRY_BENCHMARKS

router = APIRouter()


@router.get("/trends")
async def get_monthly_trends(
    months: int = 12,
    current_user: UserModel = Depends(require_any),
    db: AsyncSession = Depends(get_db),
):
    """Monthly emission trends for the past N months, broken down by scope."""
    start_date = datetime.utcnow() - timedelta(days=30 * months)

    result = await db.execute(
        select(
            extract("year", EmissionModel.date).label("year"),
            extract("month", EmissionModel.date).label("month"),
            EmissionModel.scope,
            func.sum(EmissionModel.co2_equivalent_kg).label("total_kg"),
        )
        .where(
            and_(
                EmissionModel.user_id == current_user.firebase_uid,
                EmissionModel.date >= start_date,
            )
        )
        .group_by("year", "month", EmissionModel.scope)
        .order_by("year", "month")
    )
    rows = result.all()

    # Pivot into monthly totals
    monthly: dict[str, dict] = {}
    for row in rows:
        key = f"{int(row.year)}-{int(row.month):02d}"
        if key not in monthly:
            monthly[key] = {
                "month": key,
                "scope_1_kg": 0.0,
                "scope_2_kg": 0.0,
                "scope_3_kg": 0.0,
                "total_kg": 0.0,
            }
        scope_key = f"{row.scope.replace('scope_', 'scope_')}_kg"
        monthly[key][scope_key] = float(row.total_kg or 0)
        monthly[key]["total_kg"] += float(row.total_kg or 0)

    return {
        "success": True,
        "data": {"trends": list(monthly.values())},
        "error": None,
    }


@router.get("/scope-breakdown")
async def get_scope_breakdown(
    current_user: UserModel = Depends(require_any),
    db: AsyncSession = Depends(get_db),
):
    """Donut chart data — CO₂e breakdown by scope."""
    results = []
    scope_colors = {
        EmissionScope.SCOPE_1: "#16A34A",
        EmissionScope.SCOPE_2: "#10B981",
        EmissionScope.SCOPE_3: "#84CC16",
    }

    for scope in EmissionScope:
        result = await db.execute(
            select(func.coalesce(func.sum(EmissionModel.co2_equivalent_kg), 0.0))
            .where(
                and_(
                    EmissionModel.user_id == current_user.firebase_uid,
                    EmissionModel.scope == scope,
                )
            )
        )
        total_kg = result.scalar() or 0.0
        results.append({
            "scope": scope.value,
            "label": scope.value.replace("_", " ").title(),
            "value_kg": total_kg,
            "value_tonnes": total_kg / 1000,
            "color": scope_colors[scope],
        })

    return {"success": True, "data": {"breakdown": results}, "error": None}


@router.get("/category-breakdown")
async def get_category_breakdown(
    current_user: UserModel = Depends(require_any),
    db: AsyncSession = Depends(get_db),
):
    """Bar chart data — top emission categories."""
    result = await db.execute(
        select(
            EmissionModel.category,
            func.sum(EmissionModel.co2_equivalent_kg).label("total_kg"),
        )
        .where(EmissionModel.user_id == current_user.firebase_uid)
        .group_by(EmissionModel.category)
        .order_by(func.sum(EmissionModel.co2_equivalent_kg).desc())
        .limit(10)
    )
    rows = result.all()

    return {
        "success": True,
        "data": {
            "categories": [
                {
                    "category": r.category,
                    "label": r.category.replace("_", " ").title(),
                    "total_kg": float(r.total_kg or 0),
                    "total_tonnes": float(r.total_kg or 0) / 1000,
                }
                for r in rows
            ]
        },
        "error": None,
    }


@router.get("/benchmarks")
async def get_benchmarks(
    industry: str = "technology",
    employee_count: int = 100,
    current_user: UserModel = Depends(require_any),
    db: AsyncSession = Depends(get_db),
):
    """Compare organization emissions against industry benchmarks."""
    # Get org total
    result = await db.execute(
        select(func.coalesce(func.sum(EmissionModel.co2_equivalent_kg), 0.0))
        .where(EmissionModel.user_id == current_user.firebase_uid)
    )
    total_kg = result.scalar() or 0.0
    total_tonnes = total_kg / 1000
    per_employee = total_tonnes / employee_count if employee_count > 0 else 0

    benchmark = INDUSTRY_BENCHMARKS.get(industry, 10.0)
    benchmark_total = benchmark * employee_count
    vs_benchmark_pct = ((per_employee - benchmark) / benchmark * 100) if benchmark > 0 else 0

    return {
        "success": True,
        "data": {
            "org_total_tonnes": total_tonnes,
            "org_per_employee_tonnes": per_employee,
            "industry": industry,
            "benchmark_per_employee_tonnes": benchmark,
            "benchmark_total_tonnes": benchmark_total,
            "vs_benchmark_pct": round(vs_benchmark_pct, 2),
            "performance": "above_average" if vs_benchmark_pct < 0 else "below_average",
            "all_benchmarks": INDUSTRY_BENCHMARKS,
        },
        "error": None,
    }
