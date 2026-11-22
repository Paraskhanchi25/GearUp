"""
GEAR UP AI Ecosystem Backend
Independent, modular AI micro-services for the GEAR UP two-wheeler marketplace:
- /api/ai-buddy/
- /api/price-estimator/
- /api/deal-detector/
- /api/listing-assistant/
- /api/upgrade-studio/
- /api/bike-comparison/
- /api/voice/
"""

import os
import sys
import time

# Ensure backend root is on Python sys.path regardless of execution working directory
_backend_dir = os.path.dirname(os.path.abspath(__file__))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from routers.ai_buddy import router as ai_buddy_router
from routers.price_estimator import router as price_estimator_router
from routers.deal_detector import router as deal_detector_router
from routers.listing_assistant import router as listing_assistant_router
from routers.upgrade_studio import router as upgrade_studio_router
from routers.bike_comparison import router as bike_comparison_router
from routers.voice import router as voice_router
from routers.verification import router as verification_router
from routers.location_monetization import router as location_monetization_router
from routers.rc_verification import router as rc_verification_router
from routers.models_3d import router as models_3d_router
from routers.platform_fee import router as platform_fee_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Dedicated AI services for Indian two-wheeler marketplace (ML valuation, Gemini AI Buddy, Deal Detector, Listing Assistant, Upgrade Studio, Comparison, and Voice AI)",
)

# CORS Middleware (allowing client Vite app on 5173 and standard web clients)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing & Simple Rate Limiting Tracker
REQUEST_HISTORY = {}

@app.middleware("http")
async def security_and_timing_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()
    
    # Rate limit check: max 60 requests per minute per IP
    history = REQUEST_HISTORY.get(client_ip, [])
    # purge records older than 60s
    history = [t for t in history if current_time - t < 60]
    if len(history) >= 60:
        return JSONResponse(status_code=429, content={"error": "Rate limit exceeded. Please wait a minute."})
    history.append(current_time)
    REQUEST_HISTORY[client_ip] = history

    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Process-Time-Ms"] = str(duration_ms)
    return response

# Mount Independent API Routers
app.include_router(ai_buddy_router, prefix=settings.API_PREFIX)
app.include_router(price_estimator_router, prefix=settings.API_PREFIX)
app.include_router(deal_detector_router, prefix=settings.API_PREFIX)
app.include_router(listing_assistant_router, prefix=settings.API_PREFIX)
app.include_router(upgrade_studio_router, prefix=settings.API_PREFIX)
app.include_router(bike_comparison_router, prefix=settings.API_PREFIX)
app.include_router(voice_router, prefix=settings.API_PREFIX)
app.include_router(verification_router, prefix=settings.API_PREFIX)
app.include_router(location_monetization_router, prefix=settings.API_PREFIX)
app.include_router(rc_verification_router, prefix=settings.API_PREFIX)
app.include_router(models_3d_router, prefix=settings.API_PREFIX)
app.include_router(platform_fee_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "service": "GEAR UP AI Ecosystem Backend",
        "status": "operational",
        "modules": [
            "/api/ai-buddy/",
            "/api/price-estimator/",
            "/api/deal-detector/",
            "/api/listing-assistant/",
            "/api/upgrade-studio/",
            "/api/bike-comparison/",
            "/api/voice/"
        ],
        "ml_valuation_model": "GradientBoosting (R2=0.987, MedAPE=3.08%)",
        "gemini_api_configured": bool(settings.GEMINI_API_KEY)
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": time.time()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
