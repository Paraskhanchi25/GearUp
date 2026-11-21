from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from services.gemini_service import gemini_ai_service

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

@router.post("/chat", response_model=ChatResponse)
async def chat_with_buddy(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    result = gemini_ai_service.chat(user_query=req.message, history=req.history)
    
    from datetime import datetime
    return ChatResponse(
        response=result.get("text", ""),
        is_refusal=result.get("is_refusal", False),
        matched_listings=result.get("matched_listings", []),
        timestamp=datetime.now().strftime("%I:%M %p")
    )
