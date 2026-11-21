from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import base64

router = APIRouter(prefix="/bike-doctor", tags=["AI Bike Doctor"])

class DiagnosisRequest(BaseModel):
    symptom_text: str = Field(..., example="My bike vibrates when I cross 60 km/h")
    category: Optional[str] = "motorcycle"
    brand: Optional[str] = "Royal Enfield"
    model: Optional[str] = "Classic 350"
    year: Optional[int] = 2022
    km: Optional[int] = 18000
    has_image: Optional[bool] = False
    has_audio: Optional[bool] = False

class DiagnosisResponse(BaseModel):
    reported_symptom: str
    urgency_level: str  # "routine", "caution", "urgent_do_not_ride"
    possible_causes: List[Dict[str, str]]
    clarifying_questions: List[str]
    safe_diy_checks: List[str]
    suggested_next_steps: List[str]
    professional_inspection_required: bool
    safety_disclaimer: str

@router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose_bike_problem(req: DiagnosisRequest):
    s = req.symptom_text.lower()
    
    # 1. Critical safety triggers: Brakes, steering wobble, tyre bulge, fuel leak
    is_critical = any(w in s for w in ["brake", "fail", "wobble", "tyre bulge", "fuel leak", "petrol smell", "smoke", "lock"])
    
    urgency = "urgent_do_not_ride" if is_critical else ("caution" if any(w in s for w in ["vibrat", "noise", "sound", "overheat", "oil leak"]) else "routine")
    
    # Determine cause categorization based on keywords
    causes = []
    diy_checks = []
    questions = []
    next_steps = []
    
    if "vibrat" in s:
        causes = [
            {"component": "Wheel Balancing & Rim Truing", "probability": "High", "explanation": "Unbalanced front alloy or dented spoke rim causes harmonic vibration specifically between 55–70 km/h."},
            {"component": "Engine Foundation Bolts", "probability": "Moderate", "explanation": "Loose chassis-to-engine mount torque causes raw engine vibrations to transfer directly to the handlebar and footpegs."},
            {"component": "Front Fork Alignment / Cone Set", "probability": "Moderate", "explanation": "Worn ball bearings in the steering stem (cone set) create handle buzz and slight vagueness on highway cruising."}
        ]
        diy_checks = [
            "Lift front wheel off the ground on main stand, spin tire and observe tread for lateral wobble.",
            "Inspect engine mounting bolts under fuel tank and frame for loose threads.",
            "Verify front tyre pressure is strictly between 28–29 PSI."
        ]
        questions = [
            "Does the vibration increase with engine RPM in neutral, or only when the wheels are spinning at 60 km/h?",
            "Did the vibration start right after hitting a pothole or getting a tyre punctured?"
        ]
        next_steps = [
            "Visit a tyre specialist for laser wheel balancing and rim runout check (~₹250–₹400).",
            "Get chassis engine mounting torqued to factory specifications with thread-locker."
        ]
    elif any(w in s for w in ["sound", "noise", "click", "knock", "aawaz"]):
        causes = [
            {"component": "Valve Tappet Clearance", "probability": "High", "explanation": "Excessive gap between rocker arm and valve stem creates a distinct metallic ticking that doubles with throttle."},
            {"component": "Cam Chain Tensioner", "probability": "Moderate", "explanation": "Automatic tensioner ratchet slippage causes timing chain rattle on the left engine case during deceleration."},
            {"component": "Dry Drive Chain / Worn Front Sprocket", "probability": "Moderate", "explanation": "Unlubricated roller chain links grinding over the countershaft sprocket teeth."}
        ]
        diy_checks = [
            "Check engine oil dipstick level when the bike is parked level on the center stand.",
            "Inspect drive chain slack: it should have 20–25mm of vertical play at mid-span."
        ]
        questions = [
            "Is the clicking sound louder when the engine is cold or after 20 minutes of riding?",
            "When was the engine oil last changed?"
        ]
        next_steps = [
            "Schedule a valve clearance inspection at your authorized workshop (~₹350).",
            "Lubricate chain with O-ring safe EP90 gear oil or dedicated chain wax."
        ]
    elif any(w in s for w in ["brake", "spongy", "squeal"]):
        causes = [
            {"component": "Brake Fluid Moisture / Air Bubble", "probability": "High", "explanation": "DOT 4 brake fluid absorbs water vapor over 2 years, leading to a spongy lever feel and delayed bite."},
            {"component": "Glazed or Worn Brake Pads", "probability": "High", "explanation": "Brake pad compound worn down past the 1.5mm wear indicator groove, resulting in metallic squealing and longer stopping distances."}
        ]
        diy_checks = [
            "Inspect sight glass on the handlebar master cylinder for fluid clarity (should be honey-gold, not black).",
            "Look through brake caliper slot with flashlight to check remaining friction pad thickness."
        ]
        questions = [
            "Does the brake lever pull all the way to the handlebar grip before stopping?",
            "Is there any oily residue around the caliper piston seals?"
        ]
        next_steps = [
            "Replace brake pads immediately if friction material is under 2mm.",
            "Perform a complete brake fluid flush and system bleeding with fresh DOT 4 fluid."
        ]
    else:
        causes = [
            {"component": "General Powertrain Wear", "probability": "Moderate", "explanation": "Routine wear on drive components, clutch friction plates, or air filtration system."},
            {"component": "Electrical Sensor / Spark Plug", "probability": "Moderate", "explanation": "Weak ignition spark or dirty throttle position sensor causing hesitation under load."}
        ]
        diy_checks = [
            "Check battery terminal connections for white sulfate corrosion.",
            "Verify air filter element is clean and free of heavy oil blow-by."
        ]
        questions = [
            "Does the issue occur consistently or only intermittently?",
            "Are there any warning lights illuminated on the digital instrument cluster?"
        ]
        next_steps = [
            "Have a certified mechanic perform a full diagnostic scan with an OBD-II scanner."
        ]

    disclaimer = (
        "⚠️ Important Safety Notice: AI Bike Doctor provides remote advisory analysis based on symptoms and user inputs. "
        "It cannot physically test structural integrity, hydraulic pressures, or internal engine tolerances. "
        "For any brake, steering, or structural anomalies, never ride at highway speeds until a certified technician has inspected your vehicle in person."
    )

    return DiagnosisResponse(
        reported_symptom=req.symptom_text,
        urgency_level=urgency,
        possible_causes=causes,
        clarifying_questions=questions,
        safe_diy_checks=diy_checks,
        suggested_next_steps=next_steps,
        professional_inspection_required=is_critical or urgency != "routine",
        safety_disclaimer=disclaimer
    )
