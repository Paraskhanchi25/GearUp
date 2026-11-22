"""
Continuous Learning Feedback & Diagnosis Store.
Manages diagnostic logs, mechanic feedback, verification workflow,
and training dataset promotion for continuous model improvement.
"""

import os
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from .schema import FeedbackStatus, DiagnosisFeedbackRequest

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "storage", "bike_doctor")
RECORDS_FILE = os.path.join(STORAGE_DIR, "diagnosis_records.jsonl")
FEEDBACK_FILE = os.path.join(STORAGE_DIR, "feedback_store.jsonl")

def _ensure_storage():
    os.makedirs(STORAGE_DIR, exist_ok=True)
    if not os.path.exists(RECORDS_FILE):
        with open(RECORDS_FILE, "w", encoding="utf-8") as f:
            pass
    if not os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
            pass

def save_diagnosis_record(record: Dict[str, Any]):
    """Appends an anonymous diagnosis record for telemetry and auditing."""
    _ensure_storage()
    with open(RECORDS_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")

def get_diagnosis_record(diagnosis_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a past diagnosis record by ID."""
    _ensure_storage()
    if not os.path.exists(RECORDS_FILE):
        return None
    with open(RECORDS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            if data.get("diagnosis_id") == diagnosis_id:
                return data
    return None

def submit_feedback(fb: DiagnosisFeedbackRequest) -> Dict[str, Any]:
    """Saves user or mechanic repair confirmation feedback."""
    _ensure_storage()
    feedback_id = f"FB-{uuid.uuid4().hex[:8].upper()}"
    status = FeedbackStatus.MECHANIC_CONFIRMED if fb.verified_by_mechanic else FeedbackStatus.UNVERIFIED
    
    # Check if original diagnosis exists to link metadata
    diag = get_diagnosis_record(fb.diagnosis_id) or {}

    entry = {
        "feedback_id": feedback_id,
        "diagnosis_id": fb.diagnosis_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": status.value,
        "was_accurate": fb.was_accurate,
        "actual_fault_component": fb.actual_fault_component,
        "actual_fault_category": fb.actual_fault_category,
        "resolution_notes": fb.resolution_notes or "",
        "verified_by_mechanic": fb.verified_by_mechanic,
        "mechanic_shop_name": fb.mechanic_shop_name or "",
        "replaced_parts": fb.replaced_parts or [],
        "cost_paid": fb.cost_paid,
        "rating": fb.rating,
        "original_symptom": diag.get("reported_symptom", ""),
        "vehicle_summary": diag.get("vehicle_summary", {}),
        "reviewer_notes": ""
    }

    with open(FEEDBACK_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

    return entry

def list_feedback(status: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    """Lists feedback entries with optional filtering."""
    _ensure_storage()
    entries = []
    if not os.path.exists(FEEDBACK_FILE):
        return []
        
    with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            if status is None or data.get("status") == status:
                entries.append(data)

    entries.reverse()  # Latest first
    return entries[:limit]

def review_feedback(feedback_id: str, new_status: FeedbackStatus, reviewer_notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Updates feedback status (e.g. APPROVED_FOR_TRAINING, REJECTED)."""
    _ensure_storage()
    updated_entry = None
    all_entries = []

    with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            if data.get("feedback_id") == feedback_id:
                data["status"] = new_status.value
                if reviewer_notes:
                    data["reviewer_notes"] = reviewer_notes
                data["reviewed_at"] = datetime.now(timezone.utc).isoformat()
                updated_entry = data
            all_entries.append(data)

    if updated_entry:
        with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
            for item in all_entries:
                f.write(json.dumps(item) + "\n")

    return updated_entry

def get_approved_for_training() -> List[Dict[str, Any]]:
    """Returns all verified feedback records approved for training set promotion."""
    return list_feedback(status=FeedbackStatus.APPROVED_FOR_TRAINING.value, limit=1000)
