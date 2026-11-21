from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from ml.model_store import price_estimator_engine
from services.marketplace_service import search_marketplace_listings

router = APIRouter(prefix="/deal-detector", tags=["Deal Detector"])

class DealCheckRequest(BaseModel):
    listing_id: Optional[str] = None
    brand: str
    model: str
    year: int
    km: int
    asking_price: float
    condition: str = "good"
    city: str = "Chandigarh"
    verification_tier: Optional[str] = "seller_provided"
    inspection_score: Optional[float] = 4.5
    category: Optional[str] = "motorcycle"

class DealAssessmentResponse(BaseModel):
    listing_id: Optional[str]
    asking_price: float
    estimated_fair_price: float
    price_difference_inr: float
    percentage_difference: float
    deal_rating: str  # "potentially_attractive", "fair_market_value", "potentially_overpriced", "insufficient_info"
    deal_badge: str
    badge_color: str
    assessment_summary: str
    key_factors: List[str]
    important_concerns: List[str]
    comparables: List[Dict[str, Any]]

@router.post("/evaluate", response_model=DealAssessmentResponse)
async def evaluate_deal(req: DealCheckRequest):
    # 1. Query real ML price estimator
    val_data = {
        "brand": req.brand,
        "model": req.model,
        "variant": getattr(req, "variant", "") or "",
        "manufacturing_year": req.year,
        "km_driven": req.km,
        "condition": req.condition,
        "city": req.city,
        "category": req.category or "motorcycle"
    }
    
    val_result = price_estimator_engine.predict(val_data)
    fair_price = val_result["estimated_price"]
    min_price = val_result["price_range_min"]
    max_price = val_result["price_range_max"]
    
    diff_inr = req.asking_price - fair_price
    pct_diff = round((diff_inr / fair_price) * 100, 1)
    
    # 2. Determine deal rating with condition and verification nuance
    concerns = []
    factors = []
    
    if pct_diff <= -6.0:
        if req.verification_tier == "seller_provided":
            deal_rating = "potentially_attractive"
            deal_badge = "Attractive Deal (Verify In-Person)"
            badge_color = "emerald"
            concerns.append("Significantly below market value: verify vehicle RC documents and inspect engine condition in person before transferring advance payments.")
        else:
            deal_rating = "potentially_attractive"
            deal_badge = "Excellent Value Deal"
            badge_color = "emerald"
        factors.append(f"Priced ₹{int(abs(diff_inr)):,} ({abs(pct_diff)}%) below average market benchmark for {req.brand} {req.model}.")
    elif pct_diff <= 6.0:
        deal_rating = "fair_market_value"
        deal_badge = "Fair Market Price"
        badge_color = "forest"
        factors.append(f"Asking price aligns within ±{abs(pct_diff)}% of current verified sales data in {req.city}.")
    else:
        deal_rating = "potentially_overpriced"
        deal_badge = "Potentially Overpriced"
        badge_color = "amber"
        factors.append(f"Asking price is ₹{int(diff_inr):,} ({pct_diff}%) above the estimated fair valuation for its {req.year} vintage and {req.km:,} km.")
        concerns.append(f"Seller has set an ambitious price. We recommend negotiating down towards the ₹{int(min_price):,} – ₹{int(fair_price):,} bracket.")
        
    if req.km > (2026 - req.year) * 12000:
        concerns.append(f"Above-average annual mileage ({req.km // max(1, 2026 - req.year):,} km/year). Inquire about recent chain and brake pad replacement.")
    else:
        factors.append(f"Low mileage utilization ({req.km:,} km) compared to typical {2026 - req.year}-year fleet wear.")
        
    summary = (
        f"{deal_badge}: The asking price of ₹{int(req.asking_price):,} is {abs(pct_diff)}% "
        f"{'below' if pct_diff < 0 else 'above'} our ML fair value estimate (₹{int(fair_price):,})."
    )
    
    return DealAssessmentResponse(
        listing_id=req.listing_id,
        asking_price=req.asking_price,
        estimated_fair_price=fair_price,
        price_difference_inr=diff_inr,
        percentage_difference=pct_diff,
        deal_rating=deal_rating,
        deal_badge=deal_badge,
        badge_color=badge_color,
        assessment_summary=summary,
        key_factors=factors,
        important_concerns=concerns,
        comparables=val_result.get("comparables", [])
    )
