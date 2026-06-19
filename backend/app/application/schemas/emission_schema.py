"""Pydantic Schemas — Emission request/response validation"""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

from app.domain.entities.emission import EmissionScope, EmissionCategory, EmissionUnit


class EmissionCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    scope: EmissionScope
    category: EmissionCategory
    amount: float = Field(..., gt=0, description="Positive amount in given unit")
    unit: EmissionUnit
    emission_factor: Optional[float] = Field(None, gt=0)
    source: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    date: datetime

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v > 1_000_000:
            raise ValueError("Amount cannot exceed 1,000,000 per record")
        return round(v, 6)


class EmissionUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    emission_factor: Optional[float] = Field(None, gt=0)
    source: Optional[str] = None
    location: Optional[str] = None
    date: Optional[datetime] = None
    is_verified: Optional[bool] = None


class EmissionResponse(BaseModel):
    id: UUID
    user_id: str
    title: str
    description: Optional[str]
    scope: EmissionScope
    category: EmissionCategory
    amount: float
    unit: EmissionUnit
    co2_equivalent_kg: float
    co2_equivalent_tonnes: float
    emission_factor: float
    source: Optional[str]
    location: Optional[str]
    date: datetime
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @property
    def co2_equivalent_tonnes(self) -> float:
        return self.co2_equivalent_kg / 1000


class EmissionListResponse(BaseModel):
    items: list[EmissionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    total_co2e_kg: float
    total_co2e_tonnes: float


class EmissionSummary(BaseModel):
    """Dashboard KPI summary"""
    total_emissions_kg: float
    total_emissions_tonnes: float
    scope_1_kg: float
    scope_2_kg: float
    scope_3_kg: float
    change_vs_last_month_pct: float
    this_month_kg: float
    last_month_kg: float
    net_zero_progress_pct: float
    top_category: str


class MonthlyTrend(BaseModel):
    month: str
    scope_1_kg: float
    scope_2_kg: float
    scope_3_kg: float
    total_kg: float
