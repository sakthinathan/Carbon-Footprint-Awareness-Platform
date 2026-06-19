"""API v1 Router — aggregates all endpoint routers"""
from fastapi import APIRouter
from app.api.v1 import emissions, analytics, ai, users, health, reports

api_router = APIRouter()

api_router.include_router(health.router, prefix="/v1", tags=["Health"])
api_router.include_router(emissions.router, prefix="/v1/emissions", tags=["Emissions"])
api_router.include_router(analytics.router, prefix="/v1/analytics", tags=["Analytics"])
api_router.include_router(ai.router, prefix="/v1/ai", tags=["AI Advisor"])
api_router.include_router(users.router, prefix="/v1/users", tags=["Users"])
api_router.include_router(reports.router, prefix="/v1/reports", tags=["Reports"])
