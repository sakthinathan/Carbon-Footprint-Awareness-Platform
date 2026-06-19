"""GHG Emission Factor Constants — Based on IPCC AR6 & EPA data"""

# Scope 1 — Stationary Combustion (kg CO₂e per unit)
EMISSION_FACTORS = {
    # Fuels — kg CO₂e per liter
    "natural_gas_liter": 1.89,
    "diesel_liter": 2.68,
    "petrol_liter": 2.31,
    "lpg_liter": 1.51,
    "coal_kg": 2.42,

    # Electricity — kg CO₂e per kWh (India grid average 2024)
    "electricity_india_kwh": 0.82,
    "electricity_us_kwh": 0.38,
    "electricity_eu_kwh": 0.25,
    "electricity_renewable_kwh": 0.02,

    # Transport — kg CO₂e per km
    "car_petrol_km": 0.192,
    "car_diesel_km": 0.171,
    "car_electric_km": 0.053,
    "flight_short_km": 0.255,
    "flight_long_km": 0.195,
    "train_km": 0.041,
    "bus_km": 0.089,

    # Waste — kg CO₂e per tonne
    "landfill_tonne": 467.0,
    "recycled_tonne": 21.0,
    "composted_tonne": 15.0,
}

# GHG Protocol Scope definitions
GHG_SCOPE_DESCRIPTIONS = {
    "scope_1": "Direct emissions from owned/controlled sources (fuel, company vehicles)",
    "scope_2": "Indirect emissions from purchased electricity, heat, or steam",
    "scope_3": "All other indirect emissions in the value chain",
}

# Industry average benchmarks (tonnes CO₂e per employee per year)
INDUSTRY_BENCHMARKS = {
    "technology": 8.2,
    "manufacturing": 35.7,
    "retail": 12.1,
    "finance": 5.4,
    "healthcare": 14.3,
    "logistics": 28.9,
    "agriculture": 42.1,
    "construction": 38.5,
    "education": 6.7,
    "energy": 78.3,
}
