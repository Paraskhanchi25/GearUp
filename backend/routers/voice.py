from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/voice", tags=["Voice AI Shared Service"])

class VoiceTranscribeRequest(BaseModel):
    audio_base64: Optional[str] = None
    language: Optional[str] = "hi" # "en", "hi", "pa"
    sample_text: Optional[str] = None

class VoiceResponse(BaseModel):
    recognized_text: str
    detected_language: str
    normalized_english_intent: str
    suggested_module: str  # "ai_buddy", "price_estimator"
    spoken_audio_url: Optional[str] = None

# Multilingual Voice Intent Dictionary (English, Hindi, Punjabi)
MULTILINGUAL_INTENTS = [
    {
        "patterns": ["start nahi ho rahi", "start ni hundi", "bike start nahi hoti", "chalu nahi ho rahi", "self nahi lag raha"],
        "text": "Meri bike start nahi ho rahi",
        "lang": "hi",
        "intent": "Motorcycle or scooter failing to start, weak self-starter or spark issue",
        "module": "ai_buddy"
    },
    {
        "patterns": ["sound aa rahi hai", "aawaz aundi hai", "tappet aawaz", "engine se awaz", "khad khad aawaz"],
        "text": "Engine se ajeeb aawaz aa rahi hai",
        "lang": "hi",
        "intent": "Unusual engine clicking, knocking or valve tappet noise",
        "module": "ai_buddy"
    },
    {
        "patterns": ["kitne ki bikegi", "kinne di bikugi", "price estimate", "resale value kinni hai", "kya rate chal raha"],
        "text": "Meri bike ki sahi resale market value kya hai?",
        "lang": "hi",
        "intent": "Fair market price valuation query",
        "module": "price_estimator"
    },
    {
        "patterns": ["mileage kam ho gayi", "average ni de rahi", "tel zyada khati hai", "mileage drop"],
        "text": "Bike mileage bohot kam de rahi hai",
        "lang": "hi",
        "intent": "Sudden drop in fuel economy, tyre pressure or carburetion check",
        "module": "ai_buddy"
    },
    {
        "patterns": ["activa vs jupiter", "compare", "konsi lu", "kehdian vadiya hai"],
        "text": "Activa 6G aur Jupiter 125 mein se kaun si behtar hai?",
        "lang": "hi",
        "intent": "Two-wheeler comparison between models",
        "module": "bike_comparison"
    }
]

@router.post("/process", response_model=VoiceResponse)
async def process_voice_query(req: VoiceTranscribeRequest):
    input_text = (req.sample_text or "").lower().strip()
    
    # Match phonetic or semantic patterns
    matched = None
    for item in MULTILINGUAL_INTENTS:
        if any(p in input_text for p in item["patterns"]) or input_text in item["text"].lower():
            matched = item
            break
            
    if matched:
        return VoiceResponse(
            recognized_text=matched["text"],
            detected_language=matched["lang"],
            normalized_english_intent=matched["intent"],
            suggested_module=matched["module"]
        )
        
    # Default fallback transcription
    return VoiceResponse(
        recognized_text=req.sample_text or "Bike maintenance assistance query",
        detected_language=req.language or "en",
        normalized_english_intent="General two-wheeler mechanical or marketplace inquiry",
        suggested_module="ai_buddy"
    )
