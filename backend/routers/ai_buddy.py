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
    image_data: Optional[str] = Field(default=None, description="Base64 or Data URL of attached image")
    mime_type: Optional[str] = Field(default=None, description="MIME type of attached image")
    audio_data: Optional[str] = Field(default=None, description="Base64 or Data URL of attached audio")
    audio_mime_type: Optional[str] = Field(default=None, description="MIME type of attached audio")

class ChatResponse(BaseModel):
    response: str
    is_refusal: bool
    response_type: Optional[str] = "GENERAL_TEXT"
    matched_listings: Optional[List[Dict[str, Any]]] = []
    timestamp: str
    model_used: Optional[str] = None
    latency_ms: Optional[float] = None
    error: Optional[str] = None

class TranscribeRequest(BaseModel):
    audio_data: str = Field(..., description="Base64 or Data URL of audio recording")
    mime_type: Optional[str] = Field(default="audio/webm", description="MIME type of audio")

class TranscribeResponse(BaseModel):
    transcript: str
    status: str
    latency_ms: Optional[float] = None
    error: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_buddy(req: ChatRequest):
    if (not req.message or not req.message.strip()) and not req.image_data and not req.audio_data:
        raise HTTPException(status_code=400, detail="Message or attachment cannot be empty")
        
    result = gemini_ai_service.chat(
        user_query=req.message or "",
        history=req.history,
        vehicle_context=req.vehicle_context,
        language=req.language or "en",
        image_data=req.image_data,
        mime_type=req.mime_type,
        audio_data=req.audio_data,
        audio_mime_type=req.audio_mime_type
    )
    
    return ChatResponse(
        response=result.get("text", ""),
        is_refusal=result.get("is_refusal", False),
        response_type=result.get("response_type", "GENERAL_TEXT"),
        matched_listings=result.get("matched_listings", []),
        timestamp=datetime.now().strftime("%I:%M %p"),
        model_used=result.get("model_used"),
        latency_ms=result.get("latency_ms"),
        error=result.get("error")
    )

@router.post("/transcribe-audio", response_model=TranscribeResponse)
async def transcribe_audio_endpoint(req: TranscribeRequest):
    if not req.audio_data or not req.audio_data.strip():
        raise HTTPException(status_code=400, detail="audio_data cannot be empty")
    
    result = gemini_ai_service.transcribe_audio(
        audio_data=req.audio_data,
        mime_type=req.mime_type or "audio/webm"
    )
    
    return TranscribeResponse(
        transcript=result.get("transcript", ""),
        status=result.get("status", "success"),
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
