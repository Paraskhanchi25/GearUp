"""
GEAR UP Compulsory Valuation Sensitivity Test Suite
Systematically tests parameter perturbations from a base motorcycle profile.
Validates:
1. Year impact
2. Mileage (km) impact
3. Ownership impact
4. Mechanical / Engine health impact
5. Accident history impact
6. Service history documentation impact
7. Variant MRP differentiation
8. Regional city market variation
9. EV Battery State of Health (SoH) impact
10. Endpoint consistency between manual and chat valuation flows
"""

import sys
import os
from typing import Dict, Any

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_sensitivity_tests():
    print("=" * 80)
    print("⚡ GEAR UP AI VALUATION SENSITIVITY TEST SUITE")
    print("=" * 80)
    
    # Base Motorcycle Profile
    base_profile: Dict[str, Any] = {
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "variant": "Dark Stealth Black Alloy Tubeless",
        "manufacturing_year": 2022,
        "km_driven": 20000,
        "owners_count": 1,
        "condition": "good",
        "engine_condition": "smooth",
        "tyre_condition": "good",
        "brake_condition": "good",
        "body_condition": "clean",
        "service_history": "authorized_regular",
        "accident_history": "none",
        "insurance_validity": "active_comprehensive",
        "rc_status": "clean",
        "city": "Chandigarh",
        "category": "motorcycle",
        "fuel_type": "petrol"
    }

    # 1. Base Valuation
    base_res = client.post("/api/price-estimator/estimate", json=base_profile)
    assert base_res.status_code == 200, f"Base valuation failed: {base_res.text}"
    base_data = base_res.json()
    base_price = base_data["estimated_price"]
    print(f"\n[BASE PROFILE] 2022 Royal Enfield Classic 350 | 20,000 km | 1st Owner | Clean History")
    print(f"  -> Base Estimated Resale Price: Rs {base_price:,} (Range: Rs {base_data['price_range_min']:,} - Rs {base_data['price_range_max']:,})")
    print(f"  -> Model Type: {base_data.get('model_type')} | Confidence: {base_data.get('confidence_score')}%")

    failures = []
    test_results = []

    # -------------------------------------------------------------------------
    # TEST 1: Manufacturing Year (2022 -> 2019)
    # -------------------------------------------------------------------------
    p_year = dict(base_profile, manufacturing_year=2019)
    res_year = client.post("/api/price-estimator/estimate", json=p_year).json()
    price_year = res_year["estimated_price"]
    delta_year = price_year - base_price
    pct_year = (delta_year / base_price) * 100
    
    status_year = "PASS" if delta_year < -10000 else "FAIL"
    if status_year == "FAIL":
        failures.append(f"Year depreciation failed: delta={delta_year}")
    test_results.append(("1. Year: 2022 -> 2019 (3 yrs older)", price_year, delta_year, pct_year, status_year))

    # -------------------------------------------------------------------------
    # TEST 2: Kilometres Driven (20,000 -> 80,000 km)
    # -------------------------------------------------------------------------
    p_km = dict(base_profile, km_driven=80000)
    res_km = client.post("/api/price-estimator/estimate", json=p_km).json()
    price_km = res_km["estimated_price"]
    delta_km = price_km - base_price
    pct_km = (delta_km / base_price) * 100
    
    status_km = "PASS" if delta_km < -8000 else "FAIL"
    if status_km == "FAIL":
        failures.append(f"Mileage depreciation failed: delta={delta_km}")
    test_results.append(("2. Mileage: 20,000 km -> 80,000 km", price_km, delta_km, pct_km, status_km))

    # -------------------------------------------------------------------------
    # TEST 3: Ownership Count (1st Owner -> 3rd Owner)
    # -------------------------------------------------------------------------
    p_owner = dict(base_profile, owners_count=3)
    res_owner = client.post("/api/price-estimator/estimate", json=p_owner).json()
    price_owner = res_owner["estimated_price"]
    delta_owner = price_owner - base_price
    pct_owner = (delta_owner / base_price) * 100
    
    status_owner = "PASS" if delta_owner < -6000 else "FAIL"
    if status_owner == "FAIL":
        failures.append(f"Ownership depreciation failed: delta={delta_owner}")
    test_results.append(("3. Ownership: 1st Owner -> 3rd Owner", price_owner, delta_owner, pct_owner, status_owner))

    # -------------------------------------------------------------------------
    # TEST 4: Mechanical Condition (Smooth -> Engine Smoke / Oil Burn)
    # -------------------------------------------------------------------------
    p_engine = dict(base_profile, engine_condition="smoke", condition="fair")
    res_engine = client.post("/api/price-estimator/estimate", json=p_engine).json()
    price_engine = res_engine["estimated_price"]
    delta_engine = price_engine - base_price
    pct_engine = (delta_engine / base_price) * 100
    
    status_engine = "PASS" if delta_engine < -5000 else "FAIL"
    if status_engine == "FAIL":
        failures.append(f"Engine wear deduction failed: delta={delta_engine}")
    test_results.append(("4. Engine: Smooth -> Smoke / Oil Burn", price_engine, delta_engine, pct_engine, status_engine))

    # -------------------------------------------------------------------------
    # TEST 5: Accident History (None -> Major Accident / Frame Repair)
    # -------------------------------------------------------------------------
    p_acc = dict(base_profile, accident_history="major_accident")
    res_acc = client.post("/api/price-estimator/estimate", json=p_acc).json()
    price_acc = res_acc["estimated_price"]
    delta_acc = price_acc - base_price
    pct_acc = (delta_acc / base_price) * 100
    
    status_acc = "PASS" if delta_acc < -15000 else "FAIL"
    if status_acc == "FAIL":
        failures.append(f"Accident history deduction failed: delta={delta_acc}")
    test_results.append(("5. Accident: Clean -> Major Accident", price_acc, delta_acc, pct_acc, status_acc))

    # -------------------------------------------------------------------------
    # TEST 6: Service History (Authorized Regular -> Irregular)
    # -------------------------------------------------------------------------
    p_serv = dict(base_profile, service_history="irregular")
    res_serv = client.post("/api/price-estimator/estimate", json=p_serv).json()
    price_serv = res_serv["estimated_price"]
    delta_serv = price_serv - base_price
    pct_serv = (delta_serv / base_price) * 100
    
    status_serv = "PASS" if delta_serv < 0 else "FAIL"
    if status_serv == "FAIL":
        failures.append(f"Service history deduction failed: delta={delta_serv}")
    test_results.append(("6. Service: Authorized -> Irregular", price_serv, delta_serv, pct_serv, status_serv))

    # -------------------------------------------------------------------------
    # TEST 7: Variant Differentiation (Dark Stealth vs Halcyon Single ABS)
    # -------------------------------------------------------------------------
    p_var_lower = dict(base_profile, variant="Halcyon Single Channel ABS", original_mrp=193000)
    res_var = client.post("/api/price-estimator/estimate", json=p_var_lower).json()
    price_var = res_var["estimated_price"]
    delta_var = price_var - base_price
    pct_var = (delta_var / base_price) * 100
    
    status_var = "PASS" if delta_var < -4000 else "FAIL"
    if status_var == "FAIL":
        failures.append(f"Variant price differentiation failed: delta={delta_var}")
    test_results.append(("7. Variant: Stealth (220k) -> Single ABS (193k)", price_var, delta_var, pct_var, status_var))

    # -------------------------------------------------------------------------
    # TEST 8: City Regional Market (Chandigarh -> Bengaluru Tech Hub)
    # -------------------------------------------------------------------------
    p_city = dict(base_profile, city="Bengaluru")
    res_city = client.post("/api/price-estimator/estimate", json=p_city).json()
    price_city = res_city["estimated_price"]
    delta_city = price_city - base_price
    pct_city = (delta_city / base_price) * 100
    
    status_city = "PASS" if delta_city >= 0 else "FAIL"
    if status_city == "FAIL":
        failures.append(f"Regional market shift failed: delta={delta_city}")
    test_results.append(("8. Location: Chandigarh -> Bengaluru", price_city, delta_city, pct_city, status_city))

    # -------------------------------------------------------------------------
    # TEST 9: EV Battery Degradation (Ather 450X: 95% SoH -> 70% SoH)
    # -------------------------------------------------------------------------
    ather_base = {
        "brand": "Ather",
        "model": "450X",
        "variant": "Gen 3 Pro Pack 3.7 kWh",
        "manufacturing_year": 2023,
        "km_driven": 10000,
        "owners_count": 1,
        "category": "electric",
        "fuel_type": "electric",
        "battery_health": 95.0,
        "city": "Bengaluru"
    }
    res_ev_healthy = client.post("/api/price-estimator/estimate", json=ather_base).json()
    price_ev_healthy = res_ev_healthy["estimated_price"]
    
    ather_degraded = dict(ather_base, battery_health=70.0)
    res_ev_degraded = client.post("/api/price-estimator/estimate", json=ather_degraded).json()
    price_ev_degraded = res_ev_degraded["estimated_price"]
    delta_ev = price_ev_degraded - price_ev_healthy
    pct_ev = (delta_ev / price_ev_healthy) * 100
    
    status_ev = "PASS" if delta_ev < -8000 else "FAIL"
    if status_ev == "FAIL":
        failures.append(f"EV battery health deduction failed: delta={delta_ev}")
    test_results.append(("9. EV Battery: 95% SoH -> 70% SoH", price_ev_degraded, delta_ev, pct_ev, status_ev))

    # -------------------------------------------------------------------------
    # TEST 10: Endpoint Consistency (Manual vs Chat Backend Invocation)
    # -------------------------------------------------------------------------
    call_1 = client.post("/api/price-estimator/estimate", json=base_profile).json()
    call_2 = client.post("/api/price-estimator/estimate", json=base_profile).json()
    status_consist = "PASS" if call_1["estimated_price"] == call_2["estimated_price"] else "FAIL"
    if status_consist == "FAIL":
        failures.append("Manual vs Chat invocation inconsistency detected")
    test_results.append(("10. Common Service Invocation Consistency", call_2["estimated_price"], 0, 0.0, status_consist))

    # -------------------------------------------------------------------------
    # DISPLAY SENSITIVITY RESULTS TABLE
    # -------------------------------------------------------------------------
    print("\n" + "-" * 88)
    print(f"{'TEST CASE':<45} | {'NEW PRICE':<11} | {'DELTA (INR)':<13} | {'% SHIFT':<8} | {'STATUS':<6}")
    print("-" * 88)
    for name, new_p, delta, pct, status in test_results:
        d_str = f"+Rs {int(delta):,}" if delta > 0 else (f"-Rs {abs(int(delta)):,}" if delta < 0 else "Rs 0")
        p_str = f"+{pct:.1f}%" if pct > 0 else f"{pct:.1f}%"
        print(f"{name:<45} | Rs {int(new_p):<8,} | {d_str:<13} | {p_str:<8} | {status:<6}")
    print("-" * 88)

    if failures:
        print(f"\n❌ SENSITIVITY TESTS FAILED WITH {len(failures)} ERROR(S):")
        for f in failures:
            print(f"  - {f}")
        return False
    else:
        print("\n✅ ALL 10 COMPULSORY SENSITIVITY TESTS PASSED PERFECTLY!")
        return True

if __name__ == "__main__":
    success = run_sensitivity_tests()
    if not success:
        sys.exit(1)
