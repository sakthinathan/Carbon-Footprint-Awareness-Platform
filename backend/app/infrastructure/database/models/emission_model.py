"""
SQLAlchemy ORM Models — Emissions table
"""
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Boolean, DateTime, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from app.infrastructure.database.base import Base
from app.domain.entities.emission import EmissionScope, EmissionCategory, EmissionUnit


class EmissionModel(Base):
    """Database model for emission records."""
    __tablename__ = "emissions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True, default="")
    scope: Mapped[str] = mapped_column(
        SAEnum(EmissionScope, name="emission_scope"), nullable=False, index=True
    )
    category: Mapped[str] = mapped_column(
        SAEnum(EmissionCategory, name="emission_category"), nullable=False
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(
        SAEnum(EmissionUnit, name="emission_unit"), nullable=False
    )
    co2_equivalent_kg: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    emission_factor: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    source: Mapped[str] = mapped_column(String(255), nullable=True, default="")
    location: Mapped[str] = mapped_column(String(255), nullable=True, default="")
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
