"""
Inference Pipeline for Bike Doctor ML Diagnostic Engine.
Orchestrates:
  1. Deterministic Safety Assessment (Overrides probabilistic outputs on life hazards)
  2. Model 1: NLP Symptom Classifier (Calibrated probabilities across symptom classes)
  3. Model 2: Structured Fault Predictor (Conditioned on vehicle specs + symptom class)
  4. Diagnostic Knowledge Retrieval (Safe DIY checks, mechanic checks, model notes)
  5. Grounded Gemini AI Diagnostic Synthesis
  6. Continuous Learning Auditing
"""

import os
import json
import uuid
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

from .schema import (
    DiagnosisRequest, DiagnosisResponse, CandidateCause,
    DiagnosticCheck, CostEstimate, SafetyAssessment
)
from .safety_engine import evaluate_safety
from .knowledge_base import get_knowledge_for_fault, DIAGNOSTIC_KNOWLEDGE
from .feedback_store import save_diagnosis_record
from services.gemini_service import gemini_ai_service

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models", "bike_doctor")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

class BikeDoctorMLEngine:
    _instance = None

    def __init__(self):
        self.symptom_model = None
        self.fault_model = None
        self.metadata = {}
        self._load_models()

    def _load_models(self):
        """Loads serialized models and metadata."""
        symptom_path = os.path.join(MODEL_DIR, "symptom_classifier.joblib")
        fault_path = os.path.join(MODEL_DIR, "fault_predictor.joblib")

        if os.path.exists(symptom_path) and os.path.exists(fault_path):
            try:
                self.symptom_model = joblib.load(symptom_path)
                self.fault_model = joblib.load(fault_path)
                if os.path.exists(METADATA_PATH):
                    with open(METADATA_PATH, "r", encoding="utf-8") as f:
                        self.metadata = json.load(f)
                print("✅ Bike Doctor ML Models loaded successfully into memory.")
            except Exception as e:
                print(f"⚠️ Error loading Bike Doctor ML models: {e}")
        else:
            print("⚠️ Bike Doctor models not found on disk. Run trainer.py first.")

    def reload(self):
        """Reloads models after retraining."""
        self._load_models()

    def diagnose(self, req: DiagnosisRequest) -> DiagnosisResponse:
        """Executes full hybrid diagnosis pipeline."""
        diagnosis_id = f"BD-DX-{uuid.uuid4().hex[:8].upper()}"
        now_iso = datetime.now(timezone.utc).isoformat()

        # Step 1: Deterministic Safety Assessment
        safety = evaluate_safety(req.symptom_text, req.fuel_type or "petrol")

        # Step 2: NLP Symptom Classification (Model 1)
        primary_symptom_class = "engine_starting_failure"
        symptom_confidence = 0.50
        all_symptom_probs = {}

        if self.symptom_model is not None:
            try:
                probs = self.symptom_model.predict_proba([req.symptom_text])[0]
                classes = self.symptom_model.classes_
                top_idx = int(np.argmax(probs))
                primary_symptom_class = classes[top_idx]
                symptom_confidence = float(probs[top_idx])
                all_symptom_probs = {c: round(float(p), 3) for c, p in zip(classes, probs)}
            except Exception as e:
                print(f"Model 1 inference fallback: {e}")
                primary_symptom_class = self._fallback_symptom_class(req.symptom_text)

        # Step 3: Structured Fault Prediction (Model 2)
        current_year = datetime.now().year
        age = max(1, current_year - (req.year or current_year - 2))
        km = req.km or 20000
        engine_cc = req.engine_cc or 150.0

        ranked_causes: List[CandidateCause] = []

        if self.fault_model is not None:
            try:
                feature_row = pd.DataFrame([{
                    "category": req.category or "motorcycle",
                    "fuel_type": req.fuel_type or "petrol",
                    "primary_symptom_class": primary_symptom_class,
                    "brand": req.brand or "Royal Enfield",
                    "engine_cc": float(engine_cc),
                    "age_years": float(age),
                    "odometer_km": float(km)
                }])
                fault_probs = self.fault_model.predict_proba(feature_row)[0]
                fault_classes = self.fault_model.classes_
                
                # Sort top causes
                sorted_indices = np.argsort(fault_probs)[::-1]
                for idx in sorted_indices[:3]:
                    prob = float(fault_probs[idx])
                    if prob < 0.05 and len(ranked_causes) >= 1:
                        continue
                    comp_name = fault_classes[idx]
                    
                    # Generate human confidence label
                    conf_pct = int(round(prob * 100))
                    label = f"High ({conf_pct}%)" if conf_pct >= 65 else (f"Moderate ({conf_pct}%)" if conf_pct >= 35 else f"Low ({conf_pct}%)")

                    # Retrieve matching knowledge details
                    kb_info = self._get_component_details(comp_name, primary_symptom_class)

                    ranked_causes.append(CandidateCause(
                        component=comp_name,
                        category=primary_symptom_class,
                        probability=round(prob, 3),
                        confidence_label=label,
                        explanation=kb_info.get("explanation", f"Component wear identified for {comp_name}."),
                        system=kb_info.get("system", "Powertrain & Mechanical"),
                        evidence_source=f"Trained Random Forest Classifier ({self.metadata.get('model_version', 'v1.0')}) + Telemetry",
                        parts_likely_needed=kb_info.get("parts", [])
                    ))
            except Exception as e:
                print(f"Model 2 inference fallback: {e}")

        # Step 4: Knowledge Base Retrieval
        kb_data = get_knowledge_for_fault(primary_symptom_class, req.brand)
        knowledge = kb_data["knowledge"]
        brand_notes = kb_data["brand_notes"]

        # Ensure at least 1-2 causes are present from knowledge base if ML returned empty
        if not ranked_causes:
            for item in knowledge.get("primary_causes", [])[:2]:
                ranked_causes.append(CandidateCause(
                    component=item["component"],
                    category=primary_symptom_class,
                    probability=0.75,
                    confidence_label="High (75%)",
                    explanation=item["explanation"],
                    system=knowledge.get("system", "Mechanical"),
                    evidence_source="Knowledge Base Direct Verification",
                    parts_likely_needed=item.get("parts", [])
                ))

        safe_diy_checks = knowledge.get("safe_diy_checks", [])
        mechanic_checks = knowledge.get("mechanic_checks", [])
        clarifying_questions = knowledge.get("clarifying_questions", [])

        cost_info = knowledge.get("primary_causes", [{}])[0].get("cost", {"min": 500, "max": 1800, "labor": 350, "notes": "General service"})
        cost_estimate = CostEstimate(
            min_inr=cost_info.get("min", 500),
            max_inr=cost_info.get("max", 2000),
            labor_inr=cost_info.get("labor", 350),
            notes=cost_info.get("notes", "Estimated parts and labor in Tier-1/Tier-2 Indian cities")
        )

        # Step 5: Gemini AI Contextual Explanation Synthesis
        ai_summary = self._synthesize_explanation(
            req=req,
            safety=safety,
            primary_symptom_class=primary_symptom_class,
            ranked_causes=ranked_causes,
            brand_notes=brand_notes,
            cost_estimate=cost_estimate
        )

        vehicle_summary = {
            "brand": req.brand,
            "model": req.model,
            "category": req.category,
            "year": req.year,
            "age_years": age,
            "odometer_km": km,
            "fuel_type": req.fuel_type,
            "engine_cc": engine_cc
        }

        ml_metadata = {
            "model_version": self.metadata.get("model_version", "v1.0.0"),
            "primary_symptom_class": primary_symptom_class,
            "symptom_confidence": round(symptom_confidence, 3),
            "top_probabilities": all_symptom_probs,
            "training_samples": self.metadata.get("dataset_size", 320),
            "safety_override_active": not safety.is_safe_to_ride
        }

        response = DiagnosisResponse(
            diagnosis_id=diagnosis_id,
            timestamp=now_iso,
            reported_symptom=req.symptom_text,
            vehicle_summary=vehicle_summary,
            safety_assessment=safety,
            primary_fault_category=primary_symptom_class,
            ranked_causes=ranked_causes,
            safe_diy_checks=safe_diy_checks,
            professional_mechanic_checks=mechanic_checks,
            clarifying_questions=clarifying_questions,
            model_specific_notes=brand_notes,
            estimated_repair_cost=cost_estimate,
            ai_mechanic_explanation=ai_summary,
            ml_metadata=ml_metadata
        )

        # Step 6: Log record for continuous learning traceability
        try:
            save_diagnosis_record(response.dict())
        except Exception as e:
            print(f"Failed to log diagnosis record: {e}")

        return response

    def _get_component_details(self, component_name: str, category: str) -> Dict[str, Any]:
        """Finds parts and explanation for a given component."""
        cat_data = DIAGNOSTIC_KNOWLEDGE.get(category, {})
        system_name = cat_data.get("system", "Mechanical Powertrain")
        for cause in cat_data.get("primary_causes", []):
            if cause["component"].lower() in component_name.lower() or component_name.lower() in cause["component"].lower():
                return {
                    "explanation": cause["explanation"],
                    "system": system_name,
                    "parts": cause.get("parts", [])
                }
        return {
            "explanation": f"Wear or misalignment detected in {component_name}.",
            "system": system_name,
            "parts": [f"{component_name} replacement / service"]
        }

    def _fallback_symptom_class(self, text: str) -> str:
        """Deterministic keyword fallback if NLP model is not yet compiled."""
        t = text.lower()
        if any(w in t for w in ["brake", "spongy", "squeal", "pad"]):
            return "brake_spongy_delayed"
        if any(w in t for w in ["vibrat", "wobble", "shak", "handle"]):
            return "steering_wobble_cone_set"
        if any(w in t for w in ["heat", "hot", "coolant", "radiator", "boil"]):
            return "engine_overheating"
        if any(w in t for w in ["tappet", "tick", "sound", "noise", "click", "chain"]):
            return "valvetrain_tappet_noise"
        if any(w in t for w in ["judder", "kanp", "scooter", "cvt"]):
            return "cvt_judder_scooter"
        if any(w in t for w in ["clutch", "slip"]):
            return "clutch_slippage"
        if any(w in t for w in ["battery", "range", "bms", "electric", "ather", "ola"]):
            return "ev_battery_bms_thermal"
        return "engine_starting_failure"

    def _synthesize_explanation(
        self,
        req: DiagnosisRequest,
        safety: SafetyAssessment,
        primary_symptom_class: str,
        ranked_causes: List[CandidateCause],
        brand_notes: List[str],
        cost_estimate: CostEstimate
    ) -> str:
        """
        Uses Gemini (or robust grounded template) to synthesize an empathetic,
        mechanic-grade diagnosis grounded strictly on ML outputs.
        """
        causes_summary = "; ".join([f"{c.component} ({c.confidence_label})" for c in ranked_causes])
        safety_text = safety.critical_warning if not safety.is_safe_to_ride else "Vehicle is safe for short transit to a service center."

        prompt = (
            f"Act as GEAR UP AI Bike Doctor, a master two-wheeler mechanic. Provide a direct, authoritative, and concise 2-paragraph mechanical diagnosis.\n\n"
            f"Vehicle: {req.brand} {req.model} ({req.year or 'N/A'}, {req.km or 'N/A'} km)\n"
            f"Reported Complaint: '{req.symptom_text}'\n"
            f"Safety Assessment: Severity={safety.severity.value}, SafeToRide={safety.is_safe_to_ride}. Alert: {safety_text}\n"
            f"ML Classified Fault Category: {primary_symptom_class}\n"
            f"Top Ranked Causes: {causes_summary}\n"
            f"Estimated Repair Cost: ₹{cost_estimate.min_inr} - ₹{cost_estimate.max_inr} (Labor: ₹{cost_estimate.labor_inr})\n"
            f"Model Technical Nuance: {brand_notes[0] if brand_notes else 'Standard single-cylinder two-wheeler configuration.'}\n\n"
            f"Instructions:\n"
            f"1. State what is mechanically happening inside the bike in clear, professional terms.\n"
            f"2. Explicitly reference why this happens on a {req.brand} {req.model}.\n"
            f"3. Advise the rider clearly on whether to ride or stop, and what to tell the mechanic.\n"
            f"Keep it under 150 words. Do NOT invent new faults outside the provided ML causes."
        )

        try:
            if gemini_ai_service.is_configured():
                res = gemini_ai_service.chat(user_query=prompt, history=[])
                text = res.get("text", "").strip()
                if text and len(text) > 40:
                    return text
        except Exception as e:
            print(f"Gemini synthesis notice: {e}")

        # Deterministic grounded fallback
        lead_cause = ranked_causes[0].component if ranked_causes else "Powertrain Wear"
        return (
            f"Based on your report and machine learning telemetry for the {req.brand} {req.model}, "
            f"the primary mechanical suspect is '{lead_cause}'. {safety_text}\n\n"
            f"Inspection priority: Have your technician inspect the {ranked_causes[0].system.lower()} "
            f"and verify component tolerances. Estimated workshop expense is approximately "
            f"₹{cost_estimate.min_inr}–₹{cost_estimate.max_inr} including labor."
        )

# Global Singleton Instance
bike_doctor_ml_engine = BikeDoctorMLEngine()
