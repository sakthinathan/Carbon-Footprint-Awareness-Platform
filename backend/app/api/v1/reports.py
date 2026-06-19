"""Reports endpoint — CSV export"""
import io
import csv
from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.infrastructure.database.base import get_db
from app.infrastructure.database.models.emission_model import EmissionModel
from app.infrastructure.database.models.user_model import UserModel
from app.api.middleware.firebase_auth import require_any

router = APIRouter()


@router.get("/export/csv")
async def export_emissions_csv(
    current_user: UserModel = Depends(require_any),
    db: AsyncSession = Depends(get_db),
):
    """Export all emissions as CSV — GHG Protocol compliant format."""
    result = await db.execute(
        select(EmissionModel)
        .where(EmissionModel.user_id == current_user.firebase_uid)
        .order_by(EmissionModel.date.desc())
    )
    records = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "Date", "Title", "Scope", "Category", "Amount", "Unit",
        "CO2e (kg)", "CO2e (tonnes)", "Emission Factor", "Source", "Location",
        "Verified", "Created At"
    ])
    for r in records:
        writer.writerow([
            str(r.id), r.date.date(), r.title, r.scope, r.category,
            r.amount, r.unit, r.co2_equivalent_kg, r.co2_equivalent_kg / 1000,
            r.emission_factor, r.source, r.location, r.is_verified, r.created_at.date()
        ])

    output.seek(0)
    filename = f"ecosentinel_emissions_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
