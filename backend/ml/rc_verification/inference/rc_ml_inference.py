"""
GEAR UP RC & Vehicle Document ML Inference Engine
Serves:
1. Document Type Classification (RC, Insurance, PUC, Other, Unreadable)
2. Document Anomaly & Risk Detection (Isolation Forest + Rule Engine)
3. Structured Field Extraction Enhancements & Fuzzy Catalog Matcher
"""

import os
import re
import json
from typing import Dict, Any, List, Optional, Tuple
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

CLASSIFIER_PATH = os.path.join(MODELS_DIR, "document_classifier_model.joblib")
VECTORIZER_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer.joblib")
ANOMALY_PATH = os.path.join(MODELS_DIR, "anomaly_detector_model.joblib")
METADATA_PATH = os.path.join(MODELS_DIR, "ml_metadata.json")

# Lazy-loaded singletons
_classifier = None
_vectorizer = None
_anomaly_detector = None
_metadata = None

def get_ml_models():
    global _classifier, _vectorizer, _anomaly_detector, _metadata
    if _classifier is None and os.path.exists(CLASSIFIER_PATH) and os.path.exists(VECTORIZER_PATH):
        try:
            _classifier = joblib.load(CLASSIFIER_PATH)
            _vectorizer = joblib.load(VECTORIZER_PATH)
        except Exception as e:
            print(f"Warning: Could not load document classifier: {e}")
            
    if _anomaly_detector is None and os.path.exists(ANOMALY_PATH):
        try:
            _anomaly_detector = joblib.load(ANOMALY_PATH)
        except Exception as e:
            print(f"Warning: Could not load anomaly detector: {e}")
            
    if _metadata is None and os.path.exists(METADATA_PATH):
        try:
            with open(METADATA_PATH, "r") as f:
                _metadata = json.load(f)
        except Exception:
            _metadata = {}
            
    return _classifier, _vectorizer, _anomaly_detector, _metadata

def classify_document_text(ocr_text: str) -> Dict[str, Any]:
    """
    Classifies raw OCR text into document type:
    RC, INSURANCE, PUC, OTHER, or UNREADABLE.
    Computes class probability distribution and uncertainty flag.
    """
    clf, vec, _, meta = get_ml_models()
    
    clean_text = (ocr_text or "").strip()
    if len(clean_text) < 15:
        return {
            "predicted_class": "UNREADABLE",
            "confidence": 0.95,
            "probabilities": {"UNREADABLE": 0.95, "RC": 0.01, "INSURANCE": 0.01, "PUC": 0.01, "OTHER": 0.02},
            "is_rc": False,
            "is_uncertain": False,
            "model_version": meta.get("model_version", "v1.2.0-rc-verified") if meta else "v1.2.0-rc-verified",
            "model_name": meta.get("model_architecture", "LogisticRegression") if meta else "LogisticRegression"
        }
        
    if clf is not None and vec is not None:
        try:
            features = vec.transform([clean_text])
            probs = clf.predict_proba(features)[0]
            classes = clf.classes_
            
            prob_dict = {str(c): round(float(p), 4) for c, p in zip(classes, probs)}
            top_idx = int(np.argmax(probs))
            top_class = str(classes[top_idx])
            top_conf = round(float(probs[top_idx]), 4)
            
            upper = clean_text.upper()
            if any(k in upper for k in ["CERTIFICATE OF REGISTRATION", "FORM 23", "REGISTRATION NO"]):
                top_class = "RC"
                top_conf = max(top_conf, 0.92)
                is_uncertain = False
            else:
                # Uncertainty threshold: if top probability is below 0.40, flag manual review
                is_uncertain = top_conf < 0.40
                if is_uncertain:
                    top_class = "UNREADABLE"
                
            return {
                "predicted_class": top_class,
                "confidence": top_conf,
                "probabilities": prob_dict,
                "is_rc": top_class == "RC",
                "is_uncertain": is_uncertain,
                "model_version": meta.get("model_version", "v1.2.0-rc-verified") if meta else "v1.2.0-rc-verified",
                "model_name": meta.get("model_architecture", "LogisticRegression") if meta else "LogisticRegression"
            }
        except Exception as e:
            print(f"ML Classification error, falling back to heuristic: {e}")
            
    # Fallback keyword heuristic
    upper = clean_text.upper()
    if any(k in upper for k in ["CERTIFICATE OF REGISTRATION", "FORM 23", "REGISTERING AUTHORITY", "CHASSIS NUMBER", "MOTORCYCLE / SCOOTER"]):
        return {"predicted_class": "RC", "confidence": 0.88, "probabilities": {"RC": 0.88}, "is_rc": True, "is_uncertain": False}
    elif any(k in upper for k in ["POLICY CERTIFICATE", "INSURANCE", "INSURED DECLARED VALUE", "IDV"]):
        return {"predicted_class": "INSURANCE", "confidence": 0.85, "probabilities": {"INSURANCE": 0.85}, "is_rc": False, "is_uncertain": False}
    elif any(k in upper for k in ["POLLUTION UNDER CONTROL", "PUCC", "EMISSION TESTING"]):
        return {"predicted_class": "PUC", "confidence": 0.87, "probabilities": {"PUC": 0.87}, "is_rc": False, "is_uncertain": False}
    else:
        return {"predicted_class": "OTHER", "confidence": 0.70, "probabilities": {"OTHER": 0.70}, "is_rc": False, "is_uncertain": True}

def detect_rc_anomalies(
    ocr_text: str,
    extracted_fields: Dict[str, Any],
    blur_score: float = 220.0
) -> Dict[str, Any]:
    """
    Evaluates document risk using Isolation Forest + rule-based validation:
    - Verifies Indian registration format (2 letters + 2 digits + 1-3 letters + 4 digits)
    - Checks missing essential fields (Chassis, Engine, Reg No, Manufacturer)
    - Evaluates OCR text density & blur quality
    """
    flags = []
    text = (ocr_text or "").upper()
    reg_no = extracted_fields.get("registrationNumber") or extracted_fields.get("registration_number") or ""
    
    # 1. Registration number format check
    norm_reg = re.sub(r"[^A-Z0-9]", "", str(reg_no).upper())
    is_valid_format = bool(re.match(r"^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$", norm_reg))
    if not norm_reg:
        flags.append("Registration number could not be detected from document.")
    elif not is_valid_format:
        flags.append(f"Extracted registration number '{norm_reg}' does not conform to standard Indian RTO format.")
        
    # 2. Critical field checks
    if not extracted_fields.get("manufacturer"):
        flags.append("Vehicle manufacturer / maker missing from RC extraction.")
    if not extracted_fields.get("chassisNumberMasked") and not extracted_fields.get("chassis_number"):
        flags.append("Chassis number not detected on document.")
    if not extracted_fields.get("engineNumberMasked") and not extracted_fields.get("engine_number"):
        flags.append("Engine / Motor number not detected on document.")
        
    # 3. Blur score assessment
    if blur_score < 100.0:
        flags.append(f"Document image blur level is high (variance: {blur_score:.1f}). OCR accuracy may be degraded.")
        
    # 4. Text density check
    if len(text) < 80:
        flags.append("Document has insufficient text density for authentic Parivahan RC.")
        
    # 5. Isolation Forest evaluation
    _, _, iso_forest, _ = get_ml_models()
    iso_score = 0.5
    if iso_forest is not None:
        try:
            # Build feature vector matching training distribution
            text_len = min(len(text), 2000) / 2000.0
            norm_blur = min(1.0, max(0.0, blur_score / 300.0))
            rto_keywords = ["REGISTRATION", "CHASSIS", "ENGINE", "MAKER", "MODEL", "DATE", "AUTHORITY"]
            kw_ratio = sum(1 for kw in rto_keywords if kw in text) / len(rto_keywords)
            digits = sum(c.isdigit() for c in text)
            letters = sum(c.isalpha() for c in text)
            ratio = (digits / max(1, letters)) if letters > 0 else 0.0
            norm_ratio = min(1.0, ratio / 0.5)
            
            vec = np.array([[text_len, 0.92, norm_blur, kw_ratio, norm_ratio, 1.0]])
            # decision_function gives negative for anomalies, positive for inliers
            raw_decision = float(iso_forest.decision_function(vec)[0])
            # normalize to [0, 1] where 1.0 is maximum anomaly
            iso_score = round(max(0.0, min(1.0, 0.5 - raw_decision)), 3)
        except Exception:
            iso_score = 0.3
            
    # Composite risk level
    if len(flags) >= 3 or blur_score < 50.0:
        risk_level = "HIGH_RISK"
        anomaly_score = max(iso_score, 0.85)
    elif len(flags) >= 1 or blur_score < 100.0 or iso_score > 0.60:
        risk_level = "MEDIUM"
        anomaly_score = max(iso_score, 0.50)
    else:
        risk_level = "LOW"
        anomaly_score = min(iso_score, 0.25)
        
    return {
        "anomaly_score": round(float(anomaly_score), 3),
        "risk_level": risk_level,
        "anomaly_flags": flags,
        "requires_manual_review": risk_level in ["MEDIUM", "HIGH_RISK"]
    }
