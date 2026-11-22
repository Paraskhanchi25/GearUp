"""
Comprehensive In-Process Test Suite for Bike Doctor ML Intelligence Engine using FastAPI TestClient.
Tests:
  1. ML Status endpoint
  2. Routine mechanical diagnosis (Noise / Tappets)
  3. Scooter CVT Judder diagnosis (Activa)
  4. EV Battery BMS anomaly (Ather 450X)
  5. Critical Safety Override: Hydraulic Brake Failure
  6. Critical Safety Override: Petrol Leak Fire Hazard
  7. Continuous Learning Feedback submission
  8. Feedback Review (Approval workflow)
  9. Automated Retraining Pipeline & Model Version Bump
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("🚀 RUNNING BIKE DOCTOR ML ENGINE IN-PROCESS TEST SUITE")
    print("=" * 60)

    # 1. Test ML Status
    print("\n--- [TEST 1] GET /api/bike-doctor/ml-status ---")
    resp = client.get("/api/bike-doctor/ml-status")
    assert resp.status_code == 200, f"Status code: {resp.status_code}, error: {resp.text}"
    status = resp.json()
    print(f"Status: {status['status']}")
    print(f"Model Version: {status['model_version']}")
    print(f"Dataset Size: {status['dataset_records_count']}")
    print(f"Symptom Classifier F1: {status['symptom_classifier_metrics']['f1_macro']}")
    print(f"Fault Predictor F1: {status['fault_predictor_metrics']['f1_macro']}")
    assert status["status"] == "active_in_memory"
    assert status["dataset_records_count"] >= 300
    print("✅ TEST 1 PASSED: ML Status active with trained models.")

    # 2. Test Routine Mechanical Diagnosis (Royal Enfield Clicking Noise)
    print("\n--- [TEST 2] POST /api/bike-doctor/diagnose - Valvetrain Tappet Noise ---")
    resp = client.post("/api/bike-doctor/diagnose", json={
        "symptom_text": "Metallic clicking or ticking sound from cylinder head that doubles with throttle acceleration",
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "category": "motorcycle",
        "year": 2022,
        "km": 24000,
        "fuel_type": "petrol"
    })
    assert resp.status_code == 200, f"Error: {resp.text}"
    d1 = resp.json()
    print(f"Diagnosis ID: {d1['diagnosis_id']}")
    print(f"Primary Fault Category: {d1['primary_fault_category']}")
    print(f"Severity: {d1['safety_assessment']['severity']}")
    print(f"Is Safe To Ride: {d1['safety_assessment']['is_safe_to_ride']}")
    print(f"Top Ranked Cause: {d1['ranked_causes'][0]['component']} ({d1['ranked_causes'][0]['confidence_label']})")
    print(f"Safe DIY Checks: {len(d1['safe_diy_checks'])} steps provided")
    print(f"Repair Cost: ₹{d1['estimated_repair_cost']['min_inr']} - ₹{d1['estimated_repair_cost']['max_inr']}")
    assert d1["primary_fault_category"] == "valvetrain_tappet_noise"
    assert len(d1["ranked_causes"]) >= 1
    assert len(d1["safe_diy_checks"]) >= 1
    print("✅ TEST 2 PASSED: Accurately categorized valvetrain tappet fault.")

    # 3. Test Scooter CVT Judder (Honda Activa)
    print("\n--- [TEST 3] POST /api/bike-doctor/diagnose - Scooter CVT Judder ---")
    resp = client.post("/api/bike-doctor/diagnose", json={
        "symptom_text": "Scooter judders heavily and vibrates through the footboard when moving from 0 to 20 km/h",
        "brand": "Honda",
        "model": "Activa 6G",
        "category": "scooter",
        "year": 2023,
        "km": 16000,
        "fuel_type": "petrol"
    })
    assert resp.status_code == 200, f"Error: {resp.text}"
    d2 = resp.json()
    print(f"Primary Fault Category: {d2['primary_fault_category']}")
    print(f"Top Cause: {d2['ranked_causes'][0]['component']}")
    assert d2["primary_fault_category"] == "cvt_judder_scooter"
    assert "Clutch" in d2["ranked_causes"][0]["component"] or "Variator" in d2["ranked_causes"][0]["component"]
    print("✅ TEST 3 PASSED: Scooter CVT clutch glaze correctly predicted.")

    # 4. Test EV Battery Anomaly (Ather 450X)
    print("\n--- [TEST 4] POST /api/bike-doctor/diagnose - EV Battery BMS Thermal Anomaly ---")
    resp = client.post("/api/bike-doctor/diagnose", json={
        "symptom_text": "Ather battery percentage suddenly dropped from 50% to 15% and thermal warning appeared on dashboard",
        "brand": "Ather",
        "model": "450X",
        "category": "electric_scooter",
        "year": 2023,
        "km": 18000,
        "fuel_type": "electric"
    })
    assert resp.status_code == 200, f"Error: {resp.text}"
    d3 = resp.json()
    print(f"Primary Fault Category: {d3['primary_fault_category']}")
    print(f"Top Cause: {d3['ranked_causes'][0]['component']}")
    print(f"Model Nuance: {d3['model_specific_notes'][0]}")
    assert d3["primary_fault_category"] == "ev_battery_bms_thermal"
    print("✅ TEST 4 PASSED: EV powertrain anomaly accurately classified.")

    # 5. Test Critical Safety Override: Hydraulic Brake Failure
    print("\n--- [TEST 5] POST /api/bike-doctor/diagnose - Critical Hydraulic Brake Failure ---")
    resp = client.post("/api/bike-doctor/diagnose", json={
        "symptom_text": "Brake failed completely, brake fluid is leaking onto tyre and lever touches handlebar with zero bite",
        "brand": "Bajaj",
        "model": "Pulsar 150",
        "category": "motorcycle",
        "year": 2021,
        "km": 30000,
        "fuel_type": "petrol"
    })
    assert resp.status_code == 200, f"Error: {resp.text}"
    d4 = resp.json()
    print(f"Severity: {d4['safety_assessment']['severity']}")
    print(f"Urgency: {d4['safety_assessment']['urgency']}")
    print(f"Safe to ride: {d4['safety_assessment']['is_safe_to_ride']}")
    print(f"Critical Warning: {d4['safety_assessment']['critical_warning']}")
    assert d4["safety_assessment"]["severity"] == "CRITICAL"
    assert d4["safety_assessment"]["is_safe_to_ride"] is False
    assert d4["safety_assessment"]["urgency"] == "urgent_do_not_ride"
    print("✅ TEST 5 PASSED: Deterministic critical safety override blocked riding.")

    # 6. Test Critical Safety Override: Petrol Leak Fire Hazard
    print("\n--- [TEST 6] POST /api/bike-doctor/diagnose - Petrol Leak Fire Hazard ---")
    resp = client.post("/api/bike-doctor/diagnose", json={
        "symptom_text": "Strong petrol smell and fuel is dripping from pipe directly onto the hot exhaust pipe",
        "brand": "Royal Enfield",
        "model": "Bullet 350",
        "category": "motorcycle",
        "year": 2019,
        "km": 40000,
        "fuel_type": "petrol"
    })
    assert resp.status_code == 200, f"Error: {resp.text}"
    d5 = resp.json()
    print(f"Severity: {d5['safety_assessment']['severity']}")
    print(f"Safe to ride: {d5['safety_assessment']['is_safe_to_ride']}")
    print(f"Critical Warning: {d5['safety_assessment']['critical_warning']}")
    assert d5["safety_assessment"]["severity"] == "CRITICAL"
    assert d5["safety_assessment"]["is_safe_to_ride"] is False
    print("✅ TEST 6 PASSED: Fire hazard detected and flagged.")

    # 7. Test Feedback Submission
    print("\n--- [TEST 7] POST /api/bike-doctor/feedback - Mechanic Confirmation ---")
    saved_dx_id = d1["diagnosis_id"]
    resp = client.post("/api/bike-doctor/feedback", json={
        "diagnosis_id": saved_dx_id,
        "actual_fault_component": "Excessive Valve Tappet / Rocker Arm Lash",
        "actual_fault_category": "valvetrain_tappet_noise",
        "was_accurate": True,
        "resolution_notes": "Mechanic verified 0.20mm excessive tappet lash. Reset to 0.08mm cold spec. Ticking gone.",
        "verified_by_mechanic": True,
        "mechanic_shop_name": "Royal Wheels Speed Clinic, Bangalore",
        "replaced_parts": ["Tappet O-ring seal"],
        "cost_paid": 450.0,
        "rating": 5
    })
    assert resp.status_code == 200, f"Error: {resp.text}"
    fb_res = resp.json()
    feedback_id = fb_res["feedback"]["feedback_id"]
    print(f"Submitted Feedback ID: {feedback_id}")
    print(f"Initial Status: {fb_res['feedback']['status']}")
    assert fb_res["status"] == "success"
    assert fb_res["feedback"]["status"] == "MECHANIC_CONFIRMED"
    print("✅ TEST 7 PASSED: Mechanic confirmed feedback stored.")

    # 8. Test Feedback Review Workflow
    print("\n--- [TEST 8] POST /api/bike-doctor/feedback/review - Admin Promotion ---")
    resp = client.post("/api/bike-doctor/feedback/review", json={
        "feedback_id": feedback_id,
        "status": "APPROVED_FOR_TRAINING",
        "reviewer_notes": "Verified genuine workshop invoice and accurate diagnosis."
    })
    assert resp.status_code == 200, f"Error: {resp.text}"
    review_res = resp.json()
    print(f"Updated Status: {review_res['updated_entry']['status']}")
    assert review_res["updated_entry"]["status"] == "APPROVED_FOR_TRAINING"
    print("✅ TEST 8 PASSED: Feedback approved for ML training promotion.")

    # 9. Test Continuous Learning Retraining Pipeline
    print("\n--- [TEST 9] POST /api/bike-doctor/retrain - Model Version Retrain ---")
    old_version = status["model_version"]
    resp = client.post("/api/bike-doctor/retrain")
    assert resp.status_code == 200, f"Error: {resp.text}"
    retrain_res = resp.json()
    new_version = retrain_res["new_metrics"]["model_version"]
    print(f"Previous Version: {old_version} -> New Version: {new_version}")
    print(f"New Cases Added: {retrain_res['new_metrics']['new_cases_added']}")
    print(f"Updated Dataset Size: {retrain_res['new_metrics']['dataset_size']}")
    assert retrain_res["status"] == "success"
    assert new_version != old_version
    print("✅ TEST 9 PASSED: Retraining loop executed and model hot-reloaded.")

    print("\n" + "=" * 60)
    print("🎉 ALL 9 BIKE DOCTOR ML ENGINE IN-PROCESS TESTS PASSED PERFECTLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
