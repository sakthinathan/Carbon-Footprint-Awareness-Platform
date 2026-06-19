from datetime import datetime
from app.domain.entities.emission import Emission, EmissionScope, EmissionCategory, EmissionUnit

def test_calculate_co2e_kg_unit():
    """Test emission calculation when unit is kg (factor 1.5)."""
    emission = Emission(
        title="Test Electric",
        scope=EmissionScope.SCOPE_2,
        category=EmissionCategory.PURCHASED_ELECTRICITY,
        amount=100.0,
        unit=EmissionUnit.KG,
        emission_factor=0.82,  # India grid
    )
    co2e = emission.calculate_co2e()
    assert co2e == 82.0
    assert emission.co2_equivalent_tonnes == 0.082

def test_calculate_co2e_tonnes_unit():
    """Test emission calculation when unit is tonnes (converts to kg first)."""
    emission = Emission(
        title="Test Landfill",
        scope=EmissionScope.SCOPE_3,
        category=EmissionCategory.WASTE_DISPOSAL,
        amount=2.5,
        unit=EmissionUnit.TONNES,
        emission_factor=0.467,
    )
    co2e = emission.calculate_co2e()
    # 2.5 tonnes = 2500 kg. 2500 kg * 0.467 = 1167.5 kg
    assert co2e == 1167.5
    assert emission.co2_equivalent_tonnes == 1.1675

def test_calculate_co2e_mwh_unit():
    """Test emission calculation when unit is MWH."""
    emission = Emission(
        title="Industrial Boiler",
        scope=EmissionScope.SCOPE_2,
        category=EmissionCategory.PURCHASED_HEAT,
        amount=5.0,
        unit=EmissionUnit.MWH,
        emission_factor=0.38,
    )
    co2e = emission.calculate_co2e()
    # 5.0 MWH = 5000 kWh-equivalent. 5000 * 0.38 = 1900.0 kg
    assert co2e == 1900.0
    assert emission.co2_equivalent_tonnes == 1.9
