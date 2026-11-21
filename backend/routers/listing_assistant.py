from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from ml.model_store import price_estimator_engine

router = APIRouter(prefix="/listing-assistant", tags=["AI Listing Assistant"])

class GenerateListingRequest(BaseModel):
    brand: str
    model: str
    year: int
    km: int
    city: str
    condition: str = "good"
    variant: Optional[str] = ""
    ownership: int = 1
    has_insurance: bool = True
    insurance_validity: Optional[str] = "Comprehensive until 2026"
    added_accessories: Optional[List[str]] = []
    seller_notes: Optional[str] = ""

class ListingDraftResponse(BaseModel):
    title: str
    description: str
    key_highlights: List[str]
    specs_summary: Dict[str, Any]
    suggested_asking_price: float
    estimated_fair_range: str
    missing_info_checklist: List[str]
    seller_tips: List[str]

@router.post("/generate", response_model=ListingDraftResponse)
async def generate_listing_draft(req: GenerateListingRequest):
    # 1. Fetch ML Price Valuation
    val_data = {
        "brand": req.brand,
        "model": req.model,
        "manufacturing_year": req.year,
        "km_driven": req.km,
        "condition": req.condition,
        "city": req.city,
        "owners_count": req.ownership
    }
    val = price_estimator_engine.predict(val_data)
    fair_price = val["estimated_price"]
    min_p = val["price_range_min"]
    max_p = val["price_range_max"]
    
    # Suggested asking price: 4-6% above fair value for negotiation room
    suggested_asking = round((fair_price * 1.05) / 500) * 500
    
    # Title Generation
    variant_text = f" {req.variant}" if req.variant else ""
    title = f"{req.year} {req.brand} {req.model}{variant_text} • {req.km:,} km • {req.condition.capitalize()} Condition"
    
    # Highlights
    highlights = [
        f"Single Owner & Well-Maintained in {req.city}" if req.ownership == 1 else f"{req.ownership} Owners with complete documentation",
        f"Genuinely driven {req.km:,} km ({req.km // max(1, 2026 - req.year):,} km/year average)",
        f"{'Comprehensive Insurance Active' if req.has_insurance else 'Insurance renewal required'}",
        f"{req.condition.capitalize()} condition with scratch-free tank and smooth engine compression"
    ]
    if req.added_accessories:
        highlights.append(f"Fitted Accessories: {', '.join(req.added_accessories)}")
        
    # Structured Description
    description = (
        f"Up for sale is my meticulously cared for {req.year} {req.brand} {req.model}{variant_text} registered in {req.city}.\n\n"
        f"Key Details:\n"
        f"• Manufacturing Year: {req.year}\n"
        f"• Total Odometer Reading: {req.km:,} km\n"
        f"• Number of Previous Owners: {req.ownership}\n"
        f"• Condition: {req.condition.capitalize()} (regularly serviced with manufacturer-spec synthetic engine oil)\n"
        f"• Documentation: Clean RC card, active insurance, and PUC certificate in hand.\n\n"
        f"The bike rides exceptionally well with crisp throttle response, strong brake bite, and zero unusual chassis vibrations. "
        f"Genuine buyers in and around {req.city} are welcome for a pre-purchase doorstep test ride via GEAR UP's secure inspection service."
    )
    
    # Missing information checklist
    checklist = []
    if not req.insurance_validity:
        checklist.append("Add exact insurance policy expiration date")
    if req.km > 20000:
        checklist.append("State remaining tyre tread depth (front & rear percentage)")
        checklist.append("Mention last chain sprocket or brake pad replacement date")
    checklist.append("Upload at least 4 clear photos: Front 45°, Left Profile, Right Profile, and Instrument Cluster odometer display")
    
    tips = [
        "Price competitively: Setting your asking price at ₹{suggested_asking:,} gives you a 5% negotiation cushion while attracting serious buyers.",
        "Take photos outdoors during morning or late afternoon golden hour with a clean washed bike.",
        "Highlight service bills or authorized showroom service history stamps to build immediate trust."
    ]
    
    return ListingDraftResponse(
        title=title,
        description=description,
        key_highlights=highlights,
        specs_summary={
            "brand": req.brand,
            "model": req.model,
            "year": req.year,
            "km": req.km,
            "city": req.city,
            "owners": req.ownership
        },
        suggested_asking_price=suggested_asking,
        estimated_fair_range=f"₹{int(min_p):,} – ₹{int(max_p):,}",
        missing_info_checklist=checklist,
        seller_tips=tips
    )
