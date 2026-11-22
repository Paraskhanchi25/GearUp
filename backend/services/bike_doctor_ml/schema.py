from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class SeverityLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MODERATE = "MODERATE"
    LOW = "LOW"

class UrgencyLevel(str, Enum):
    URGENT_DO_NOT_RIDE = "urgent_do_not_ride"
    CAUTION_VISIT_SOON = "caution_visit_soon"
    ROUTINE_SERVICE = "routine_service"

class PowertrainType(str, Enum):
    PETROL_CARBURETOR = "petrol_carburetor"
    PETROL_EFI = "petrol_efi"
    ELECTRIC = "electric"

class FeedbackStatus(str, Enum):
    UNVERIFIED = "UNVERIFIED"
    MECHANIC_CONFIRMED = "MECHANIC_CONFIRMED"
    APPROVED_FOR_TRAINING = "APPROVED_FOR_TRAINING"
    REJECTED = "REJECTED"

class CandidateCause(BaseModel):
    component: str
    category: str
    probability: float = Field(..., ge=0.0, le=1.0)
    confidence_label: str  # e.g. "High (82%)", "Moderate (64%)", "Low (28%)"
    explanation: str
    system: str            # e.g. "Fuel & Intake", "Electrical & Ignition", "Braking System"
    evidence_source: str   # e.g. "ML Classifier + Service History Corroboration"
    parts_likely_needed: Optional[List[str]] = []

class DiagnosticCheck(BaseModel):
    check_type: str        # "DIY_SAFE" or "PROFESSIONAL_MECHANIC"
    title: str
    steps: List[str]
    safety_precaution: Optional[str] = None
    tools_required: Optional[List[str]] = []

class SafetyAssessment(BaseModel):
    severity: SeverityLevel
    urgency: UrgencyLevel
    is_safe_to_ride: bool
    risk_summary: str
    critical_warning: Optional[str] = None

class DiagnosisRequest(BaseModel):
    symptom_text: str = Field(..., min_length=3, example="My bike engine knocks on sudden throttle and front brake feels spongy")
    category: Optional[str] = "motorcycle"  # motorcycle, scooter, electric_scooter
    brand: Optional[str] = "Royal Enfield"
    model: Optional[str] = "Classic 350"
    year: Optional[int] = 2022
    km: Optional[int] = 18000
    fuel_type: Optional[str] = "petrol"     # petrol, electric
    engine_cc: Optional[float] = 349.0
    has_image: Optional[bool] = False
    has_audio: Optional[bool] = False

class CostEstimate(BaseModel):
    min_inr: int
    max_inr: int
    labor_inr: int
    notes: str

class DiagnosisResponse(BaseModel):
    diagnosis_id: str
    timestamp: str
    reported_symptom: str
    vehicle_summary: Dict[str, Any]
    safety_assessment: SafetyAssessment
    primary_fault_category: str
    ranked_causes: List[CandidateCause]
    safe_diy_checks: List[DiagnosticCheck]
    professional_mechanic_checks: List[DiagnosticCheck]
    clarifying_questions: List[str]
    model_specific_notes: List[str]
    estimated_repair_cost: CostEstimate
    ai_mechanic_explanation: str
    ml_metadata: Dict[str, Any]

class DiagnosisFeedbackRequest(BaseModel):
    diagnosis_id: str
    actual_fault_component: str
    actual_fault_category: str
    was_accurate: bool
    resolution_notes: Optional[str] = None
    verified_by_mechanic: bool = False
    mechanic_shop_name: Optional[str] = None
    replaced_parts: Optional[List[str]] = []
    cost_paid: Optional[float] = None
    rating: Optional[int] = Field(None, ge=1, le=5)

class FeedbackReviewRequest(BaseModel):
    feedback_id: str
    status: FeedbackStatus
    reviewer_notes: Optional[str] = None

class MLStatusResponse(BaseModel):
    model_version: str
    status: str
    last_trained_at: Optional[str] = None
    dataset_records_count: int
    verified_feedback_count: int
    symptom_classifier_metrics: Dict[str, Any]
    fault_predictor_metrics: Dict[str, Any]
    supported_symptom_classes: List[str]
    supported_fault_categories: List[str]
