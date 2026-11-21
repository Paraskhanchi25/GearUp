from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/upgrade-studio", tags=["AI Resale Upgrade Studio"])

class UpgradePlanRequest(BaseModel):
    brand: str
    model: str
    year: int
    km: int
    objective: str = Field(..., example="improve visual appearance")
    budget_inr: float = Field(..., example=5000)

class UpgradeItem(BaseModel):
    title: str
    category: str
    cost_inr: float
    why_it_helps: str
    resale_roi_multiplier: float
    estimated_resale_boost_inr: float
    service_partner_type: str
    before_preview_concept: str
    after_preview_concept: str

class UpgradeStudioResponse(BaseModel):
    objective: str
    total_budget: float
    total_estimated_cost: float
    projected_resale_gain_inr: float
    roi_percentage: float
    upgrades: List[UpgradeItem]
    ai_label_disclaimer: str

@router.post("/recommend", response_model=UpgradeStudioResponse)
async def recommend_upgrades(req: UpgradePlanRequest):
    obj = req.objective.lower()
    b = req.budget_inr
    
    upgrades = []
    
    # 1. Paint Restoration / Ceramic Detailing (Cosmetic)
    if "visual" in obj or "presentation" in obj or "inspection" in obj or b >= 2500:
        upgrades.append(UpgradeItem(
            title="3-Step Paint Decontamination & Carnauba Wax / Ceramic Coat",
            category="Cosmetic Detailing",
            cost_inr=1800,
            why_it_helps="Removes swirl marks, exhaust soot, and fuel tank micro-scratches, making the bike look showroom-fresh in listing photographs.",
            resale_roi_multiplier=1.8,
            estimated_resale_boost_inr=3200,
            service_partner_type="Authorized Detailing Studio / Doorstep Partner",
            before_preview_concept="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=70",
            after_preview_concept="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=90"
        ))
        
    # 2. Premium Foam / Ergonomic Seat Cover (Comfort & Interior)
    if "comfort" in obj or "appearance" in obj or b >= 4000:
        upgrades.append(UpgradeItem(
            title="Ribbed Ergonomic Rib-Stitch Seat Cover with Memory Foam",
            category="Comfort & Styling",
            cost_inr=950,
            why_it_helps="Replaces sun-bleached, cracked factory vinyl with a modern diamond-ribbed saddle that buyers notice immediately during test rides.",
            resale_roi_multiplier=1.6,
            estimated_resale_boost_inr=1500,
            service_partner_type="Two-Wheeler Upholstery Specialist",
            before_preview_concept="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=70",
            after_preview_concept="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=90"
        ))
        
    # 3. Handlebar Grips & Bar-End Mirrors / Clean Levers
    if "accessories" in obj or "visual" in obj or b >= 5500:
        upgrades.append(UpgradeItem(
            title="CNC Machined Adjustable Levers & Textured Rubber Grips",
            category="Hardware Accessories",
            cost_inr=1200,
            why_it_helps="Eliminates sticky, gummy hand grips and scratched lever tips, giving the rider a positive, crisp tactile feel.",
            resale_roi_multiplier=1.4,
            estimated_resale_boost_inr=1700,
            service_partner_type="Local Two-Wheeler Parts Merchant",
            before_preview_concept="https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=400&q=70",
            after_preview_concept="https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=800&q=90"
        ))
        
    # 4. Chain Cleaning & Drive Service (Mechanical Reliability)
    if "reliability" in obj or "inspection" in obj or len(upgrades) < 2:
        upgrades.append(UpgradeItem(
            title="Drive Chain Deep Degrease, Tensioning & EP90 Lube Treatment",
            category="Mechanical Refinement",
            cost_inr=450,
            why_it_helps="Eliminates dry chain rust and harsh drivetrain clatter, ensuring a smooth, silent test ride experience for prospective buyers.",
            resale_roi_multiplier=2.2,
            estimated_resale_boost_inr=1000,
            service_partner_type="GEAR UP Verified Quick-Service Hub",
            before_preview_concept="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=70",
            after_preview_concept="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=90"
        ))

    total_cost = sum(u.cost_inr for u in upgrades)
    total_gain = sum(u.estimated_resale_boost_inr for u in upgrades)
    roi_pct = round(((total_gain - total_cost) / max(1, total_cost)) * 100, 1)

    return UpgradeStudioResponse(
        objective=req.objective,
        total_budget=req.budget_inr,
        total_estimated_cost=total_cost,
        projected_resale_gain_inr=total_gain,
        roi_percentage=roi_pct,
        upgrades=upgrades,
        ai_label_disclaimer="*Note: All before-and-after visual previews are AI-generated conceptual mockups. Resale value gains are empirical marketplace estimates and not contractual guarantees."
    )
