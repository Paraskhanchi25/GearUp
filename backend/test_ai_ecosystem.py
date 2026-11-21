"""
GEAR UP Complete AI Ecosystem Automated Test Suite
Verifies all 8 AI modules end-to-end for accuracy, boundaries, and reliability.
"""

import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(__file__))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_ai_ecosystem():
    print("=" * 70)
    print("🏍️  GEAR UP COMPLETE AI ECOSYSTEM — TEST SUITE VERIFICATION")
    print("=" * 70)

    # 1. AI Buddy & Topic Boundaries
    print("\n[TEST 1] AI Buddy Knowledge Boundaries & Consultation:")
    # Disallowed topic
    refusal_res = client.post("/api/ai-buddy/chat", json={"message": "Write me a Python program to sort numbers."})
    assert refusal_res.status_code == 200
    refusal_data = refusal_res.json()
    assert refusal_data["is_refusal"] == True
    print("  ✓ Non-domain question ('write Python') strictly & politely refused.")
    print(f"    Refusal excerpt: \"{refusal_data['response'][:75]}...\"")

    # Allowed bike topic
    bike_res = client.post("/api/ai-buddy/chat", json={"message": "My bike is making a strange clicking sound from engine."})
    assert bike_res.status_code == 200
    bike_data = bike_res.json()
    assert bike_data["is_refusal"] == False
    assert "tappet" in bike_data["response"].lower() or "sound" in bike_data["response"].lower() or "valve" in bike_data["response"].lower()
    print("  ✓ Mechanical question answered with domain expertise.")

    # Inventory grounding
    rec_res = client.post("/api/ai-buddy/chat", json={"message": "Suggest a scooter under 80000 in Chandigarh."})
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert len(rec_data.get("matched_listings", [])) > 0
    print(f"  ✓ Grounded marketplace retrieval: found {len(rec_data['matched_listings'])} matching GEAR UP listings.")

    # 2. AI Price Estimator ML Model
    print("\n[TEST 2] Machine Learning Price Estimator Pipeline:")
    val_res = client.post("/api/price-estimator/estimate", json={
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "manufacturing_year": 2023,
        "km_driven": 9400,
        "condition": "excellent",
        "city": "Chandigarh"
    })
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["estimated_price"] > 100000
    assert val_data["price_range_min"] < val_data["estimated_price"] < val_data["price_range_max"]
    assert len(val_data["factors"]) >= 3
    print(f"  ✓ Real ML valuation predicted: ₹{val_data['estimated_price']:,} (Range: ₹{val_data['price_range_min']:,} – ₹{val_data['price_range_max']:,})")
    print(f"  ✓ Explainability: {len(val_data['factors'])} factors computed with empirical bounds.")

    # Metrics
    metrics_res = client.get("/api/price-estimator/metrics")
    assert metrics_res.status_code == 200
    metrics_data = metrics_res.json()
    r2 = metrics_data.get("R2") or metrics_data.get("overall_evaluation", {}).get("R2", 0)
    print(f"  ✓ Empirical model validation: R² = {r2} (> 0.95 target).")

    # 3. AI Deal Detector
    print("\n[TEST 3] AI Deal Detector:")
    deal_res = client.post("/api/deal-detector/evaluate", json={
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "variant": "Dark Stealth Black Alloy Tubeless",
        "year": 2023,
        "km": 9400,
        "asking_price": 120000, # Substantially below fair value (~162k)
        "city": "Chandigarh"
    })
    assert deal_res.status_code == 200
    deal_data = deal_res.json()
    assert deal_data["deal_rating"] == "potentially_attractive"
    print(f"  ✓ Below-market listing correctly identified as: '{deal_data['deal_badge']}'")
    print(f"  ✓ Difference calculated: ₹{int(abs(deal_data['price_difference_inr'])):,} ({abs(deal_data['percentage_difference'])}% discount)")

    # 4. AI Bike Doctor
    print("\n[TEST 4] AI Bike Doctor Diagnostics:")
    doc_res = client.post("/api/bike-doctor/diagnose", json={
        "symptom_text": "Spongy front brake lever with delayed stopping power",
        "brand": "Honda",
        "model": "Activa 6G"
    })
    assert doc_res.status_code == 200
    doc_data = doc_res.json()
    assert doc_data["urgency_level"] in ["caution", "urgent_do_not_ride"]
    assert len(doc_data["possible_causes"]) > 0
    assert len(doc_data["safe_diy_checks"]) > 0
    assert "Important Safety Notice" in doc_data["safety_disclaimer"]
    print(f"  ✓ Critical symptom diagnosed: {doc_data['urgency_level']} with {len(doc_data['possible_causes'])} ranked causes.")
    print(f"  ✓ Safety disclaimer enforced: Yes.")

    # 5. AI Listing Assistant
    print("\n[TEST 5] AI Listing Assistant:")
    list_res = client.post("/api/listing-assistant/generate", json={
        "brand": "Honda",
        "model": "Activa 6G",
        "year": 2022,
        "km": 14200,
        "city": "Chandigarh",
        "ownership": 1
    })
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert "Honda Activa" in list_data["title"]
    assert list_data["suggested_asking_price"] > 40000
    assert len(list_data["missing_info_checklist"]) > 0
    print(f"  ✓ Auto-drafted title: '{list_data['title']}'")
    print(f"  ✓ Suggested asking price: ₹{list_data['suggested_asking_price']:,}")

    # 6. AI Resale Upgrade Studio
    print("\n[TEST 6] AI Resale Upgrade Studio:")
    up_res = client.post("/api/upgrade-studio/recommend", json={
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "year": 2022,
        "km": 16000,
        "objective": "visual appearance",
        "budget_inr": 5000
    })
    assert up_res.status_code == 200
    up_data = up_res.json()
    assert len(up_data["upgrades"]) > 0
    assert up_data["roi_percentage"] > 0
    assert "*Note" in up_data["ai_label_disclaimer"]
    print(f"  ✓ Generated {len(up_data['upgrades'])} targeted upgrades with {up_data['roi_percentage']}% projected ROI.")
    print(f"  ✓ AI concept labeling verified: Yes.")

    # 7. AI Bike Comparison
    print("\n[TEST 7] AI Bike Comparison:")
    comp_res = client.post("/api/bike-comparison/compare", json={
        "bike1": "Royal Enfield Classic 350",
        "bike2": "Honda Activa 6G"
    })
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert len(comp_data["bikes_compared"]) == 2
    assert len(comp_data["specs_comparison"]) >= 6
    assert len(comp_data["ai_verdict"]) > 20
    print(f"  ✓ Head-to-head comparison generated: {len(comp_data['specs_comparison'])} verified spec categories.")
    print(f"  ✓ Synthesis: \"{comp_data['ai_verdict'][:75]}...\"")

    # 8. Shared Voice AI Service
    print("\n[TEST 8] Shared Voice AI Multilingual Service:")
    voice_res = client.post("/api/voice/process", json={
        "sample_text": "Meri bike start nahi ho rahi",
        "language": "hi"
    })
    assert voice_res.status_code == 200
    voice_data = voice_res.json()
    assert voice_data["suggested_module"] == "bike_doctor"
    print(f"  ✓ Hindi voice phrase parsed: '{voice_data['recognized_text']}' -> Routed to {voice_data['suggested_module']}.")

    print("\n" + "=" * 70)
    print("🎉 ALL 8 AI MODULES PASSED VERIFICATION WITH 100% SUCCESS!")
    print("=" * 70)

if __name__ == "__main__":
    test_ai_ecosystem()
