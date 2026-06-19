import pytest
from datetime import datetime
from uuid import uuid4

@pytest.mark.asyncio
async def test_create_and_get_emission(client):
    """Test creating an emission record via POST and retrieving it via GET."""
    payload = {
        "title": "Corporate Office Power Grid",
        "description": "Electricity consumption for Q2",
        "scope": "scope_2",
        "category": "purchased_electricity",
        "amount": 2500.0,
        "unit": "kwh",
        "emission_factor": 0.82,
        "source": "utility bill",
        "location": "HQ",
        "date": datetime.utcnow().isoformat(),
    }

    # POST create
    response = await client.post("/api/v1/emissions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["amount"] == 2500.0
    assert data["co2_equivalent_kg"] == 2500.0 * 0.82
    assert "id" in data

    emission_id = data["id"]

    # GET detail
    detail_response = await client.get(f"/api/v1/emissions/{emission_id}")
    assert detail_response.status_code == 200
    detail_data = detail_response.json()
    assert detail_data["id"] == emission_id
    assert detail_data["title"] == "Corporate Office Power Grid"

@pytest.mark.asyncio
async def test_list_emissions(client):
    """Test listing emission records with paginated parameters."""
    # Create two records
    for i in range(2):
        await client.post("/api/v1/emissions", json={
            "title": f"Transport Trip {i}",
            "scope": "scope_1",
            "category": "mobile_combustion",
            "amount": 100.0 + i,
            "unit": "km",
            "date": datetime.utcnow().isoformat(),
        })

    response = await client.get("/api/v1/emissions?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2
    assert data["items"][0]["title"] == "Transport Trip 1" # Ordered by date.desc()

@pytest.mark.asyncio
async def test_update_and_delete_emission(client):
    """Test updating and deleting an emission record."""
    create_response = await client.post("/api/v1/emissions", json={
        "title": "Initial Title",
        "scope": "scope_1",
        "category": "stationary_combustion",
        "amount": 500.0,
        "unit": "liters",
        "date": datetime.utcnow().isoformat(),
    })
    emission_id = create_response.json()["id"]

    # PATCH update
    update_payload = {"title": "Updated Title", "amount": 600.0}
    update_response = await client.patch(f"/api/v1/emissions/{emission_id}", json=update_payload)
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated Title"

    # DELETE record
    delete_response = await client.delete(f"/api/v1/emissions/{emission_id}")
    assert delete_response.status_code == 204

    # Verify deleted
    get_response = await client.get(f"/api/v1/emissions/{emission_id}")
    assert get_response.status_code == 404

@pytest.mark.asyncio
async def test_get_summary(client):
    """Test fetching dashboard summaries."""
    await client.post("/api/v1/emissions", json={
        "title": "Scope 1 emission",
        "scope": "scope_1",
        "category": "stationary_combustion",
        "amount": 10.0,
        "unit": "liters",
        "emission_factor": 2.68,
        "date": datetime.utcnow().isoformat(),
    })
    await client.post("/api/v1/emissions", json={
        "title": "Scope 2 emission",
        "scope": "scope_2",
        "category": "purchased_electricity",
        "amount": 100.0,
        "unit": "kwh",
        "emission_factor": 0.82,
        "date": datetime.utcnow().isoformat(),
    })

    response = await client.get("/api/v1/emissions/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_emissions_kg"] == (10.0 * 2.68) + (100.0 * 0.82)
    assert data["scope_1_kg"] == 10.0 * 2.68
    assert data["scope_2_kg"] == 100.0 * 0.82
