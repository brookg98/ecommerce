import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_products_empty(client: AsyncClient):
    response = await client.get("/api/v1/products")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_product_health_check(client: AsyncClient):
    response = await client.get("/api/v1/products/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
