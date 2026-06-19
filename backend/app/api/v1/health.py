"""Health check endpoint"""
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "service": "EcoSentinel API",
            "version": "1.0.0",
            "timestamp": datetime.utcnow().isoformat(),
        },
        "error": None,
    }
