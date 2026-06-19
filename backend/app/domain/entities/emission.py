"""Domain Entities — Emission (pure Python, no framework dependency)"""
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4


class EmissionScope(str, Enum):
    SCOPE_1 = "scope_1"  # Direct emissions (fuel combustion, company vehicles)
    SCOPE_2 = "scope_2"  # Indirect — purchased electricity, heat, steam
    SCOPE_3 = "scope_3"  # Value chain — supply chain, business travel, waste


class EmissionCategory(str, Enum):
    # Scope 1
    STATIONARY_COMBUSTION = "stationary_combustion"
    MOBILE_COMBUSTION = "mobile_combustion"
    FUGITIVE_EMISSIONS = "fugitive_emissions"
    PROCESS_EMISSIONS = "process_emissions"
    # Scope 2
    PURCHASED_ELECTRICITY = "purchased_electricity"
    PURCHASED_HEAT = "purchased_heat"
    PURCHASED_STEAM = "purchased_steam"
    # Scope 3
    BUSINESS_TRAVEL = "business_travel"
    EMPLOYEE_COMMUTING = "employee_commuting"
    SUPPLY_CHAIN = "supply_chain"
    WASTE_DISPOSAL = "waste_disposal"
    PRODUCT_USE = "product_use"


class EmissionUnit(str, Enum):
    KG = "kg"
    TONNES = "tonnes"
    KWH = "kwh"
    MWH = "mwh"
    LITERS = "liters"
    KM = "km"


@dataclass
class Emission:
    """Core emission domain entity — represents a single emission data point."""
    id: UUID = field(default_factory=uuid4)
    user_id: str = ""                      # Firebase UID
    title: str = ""
    description: str = ""
    scope: EmissionScope = EmissionScope.SCOPE_1
    category: EmissionCategory = EmissionCategory.STATIONARY_COMBUSTION
    amount: float = 0.0                    # Raw amount in given unit
    unit: EmissionUnit = EmissionUnit.KG
    co2_equivalent_kg: float = 0.0         # Calculated CO₂e in kg
    emission_factor: float = 1.0           # Factor used for conversion
    source: str = ""                       # e.g., "electricity meter", "fuel receipt"
    location: str = ""
    date: datetime = field(default_factory=datetime.utcnow)
    is_verified: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def calculate_co2e(self) -> float:
        """Calculate CO₂ equivalent from raw amount and emission factor."""
        if self.unit == EmissionUnit.TONNES:
            base_kg = self.amount * 1000
        elif self.unit in (EmissionUnit.MWH,):
            base_kg = self.amount * 1000  # Convert to kWh-equivalent
        else:
            base_kg = self.amount
        self.co2_equivalent_kg = base_kg * self.emission_factor
        return self.co2_equivalent_kg

    @property
    def co2_equivalent_tonnes(self) -> float:
        return self.co2_equivalent_kg / 1000
