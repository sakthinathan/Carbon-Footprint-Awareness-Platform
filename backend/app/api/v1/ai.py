"""
AI Advisor endpoint — Server-Sent Events streaming with Gemini.
"""
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional

from app.infrastructure.external.gemini_client import gemini_advisor
from app.infrastructure.database.models.user_model import UserModel
from app.api.middleware.firebase_auth import require_any
from app.api.middleware.rate_limiter import limiter

router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user" or "model"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[list[ChatMessage]] = None


@router.post("/chat")
async def ai_chat(
    payload: ChatRequest,
    current_user: UserModel = Depends(require_any),
):
    """
    Stream an AI advisor response via Server-Sent Events.
    Frontend should use EventSource or fetch with stream reading.
    """
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail={"code": "EMPTY_MESSAGE", "message": "Message cannot be empty"})

    # Convert history to Gemini format
    history = []
    if payload.history:
        for msg in payload.history[-10:]:  # Last 10 messages for context
            history.append({
                "role": msg.role,
                "parts": [{"text": msg.content}],
            })

    async def event_generator():
        try:
            async for chunk in gemini_advisor.chat_stream(payload.message, history):
                data = json.dumps({"chunk": chunk, "done": False})
                yield f"data: {data}\n\n"
            # Signal completion
            yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"
        except Exception as e:
            error_data = json.dumps({"error": str(e), "done": True})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/recommendations")
async def get_recommendations(
    emission_summary: dict,
    current_user: UserModel = Depends(require_any),
):
    """Get AI-powered reduction recommendations based on emission summary."""
    recommendations = await gemini_advisor.get_recommendations(emission_summary)
    return {
        "success": True,
        "data": {"recommendations": recommendations},
        "error": None,
    }
