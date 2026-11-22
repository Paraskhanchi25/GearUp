from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from services.gemini_service import gemini_ai_service
from datetime import datetime

router = APIRouter(prefix="/ai-buddy", tags=["AI Buddy"])

class ChatRequest(BaseModel):
    message: str = Field(..., description="User query or message")
    history: Optional[List[Dict[str, str]]] = Field(default=[], description="Active conversation context")
    language: Optional[str] = Field(default="en", description="Language: en, hi, pa")
    vehicle_context: Optional[Dict[str, Any]] = Field(default=None, description="Optional current bike context")

class ChatResponse(BaseModel):
    response: str
    is_refusal: bool
    matched_listings: Optional[List[Dict[str, Any]]] = []
    timestamp: str
    model_used: Optional[str] = None
    latency_ms: Optional[float] = None
    error: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_buddy(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    result = gemini_ai_service.chat(
        user_query=req.message,
        history=req.history,
        vehicle_context=req.vehicle_context,
        language=req.language or "en"
    )
    
    return ChatResponse(
        response=result.get("text", ""),
        is_refusal=result.get("is_refusal", False),
        matched_listings=result.get("matched_listings", []),
        timestamp=datetime.now().strftime("%I:%M %p"),
        model_used=result.get("model_used"),
        latency_ms=result.get("latency_ms"),
        error=result.get("error")
    )

@router.get("/diagnostic")
async def get_gemini_diagnostics():
    """
    Automated health-check & diagnostic test suite for genuine Google AI Studio Gemini API connectivity.
    Validates all 7 conditions: valid key, missing key, invalid key, timeout resilience, empty input, limits, multi-turn.
    """
    return gemini_ai_service.run_diagnostics()

@router.get("/health")
async def get_ai_buddy_health():
    """Fast status check for AI Buddy configuration."""
    return {
        "status": "healthy" if gemini_ai_service.is_configured() else "unconfigured",
        "service": "GEAR UP AI Buddy",
        "gemini_api_configured": gemini_ai_service.is_configured(),
        "timestamp": datetime.now().isoformat()
    }
