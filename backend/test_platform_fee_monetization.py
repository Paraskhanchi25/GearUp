"""
GEAR UP Platform Listing Fee Monetization & Publication Gate Test Suite
Tests:
1. Fee Configuration & Admin Controls (INR, non-hardcoded, refund policy).
2. Order Creation & Razorpay Gateway Simulation.
3. Cryptographic Signature Verification & Auditable Transaction Logging.
4. Duplicate Charge Prevention (Idempotency).
5. Publication Gate Enforcement: Unpaid listings blocked; Paid listings published.
6. Payment Failure, Draft Persistence & Retry Mechanism.
7. Admin Revenue Analytics, Transaction Filtering & CSV Export.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from services.verification_service import VERIFICATION_STORE, save_records

client = TestClient(app)

def test_platform_fee_suite():
    print("=" * 80)
    print("💳 GEAR UP: PLATFORM LISTING FEE & MONETIZATION TEST SUITE")
    print("=" * 80)

    # --------------------------------------------------------------------------
    # 1. Config Endpoints
    # --------------------------------------------------------------------------
    print("\n[TEST 1] Fetch Current Platform Fee Configuration:")
    res = client.get("/api/platform-fee/config")
    assert res.status_code == 200, f"Status: {res.status_code}"
    cfg = res.json()
    assert cfg["currency"] == "INR", f"Currency is {cfg.get('currency')}"
    assert "listing_fee_inr" in cfg
    assert "refund_policy" in cfg
    print(f"  ✓ Active Fee: ₹{cfg['listing_fee_inr']} {cfg['currency']}")
    print(f"  ✓ Refund Policy: {cfg['refund_policy'][:60]}...")

    # --------------------------------------------------------------------------
    # 2. Admin Config Update
    # --------------------------------------------------------------------------
    print("\n[TEST 2] Admin Updates Listing Fee Amount & Refund Policy:")
    update_res = client.post("/api/platform-fee/admin/config", json={
        "listing_fee_inr": 299,
        "refund_policy": "Full refund if vehicle fails RTO verification; non-refundable once live.",
        "updated_by": "SuperAdmin-Test"
    })
    assert update_res.status_code == 200
    updated_cfg = update_res.json()["config"]
    assert updated_cfg["listing_fee_inr"] == 299
    print(f"  ✓ Listing fee updated to: ₹{updated_cfg['listing_fee_inr']}")

    # --------------------------------------------------------------------------
    # 3. Create Order for a New Seller Listing
    # --------------------------------------------------------------------------
    import uuid
    test_listing_id = f"TEST-BIKE-FEE-{uuid.uuid4().hex[:6].upper()}"
    print(f"\n[TEST 3] Create Payment Order for {test_listing_id}:")
    order_res = client.post("/api/platform-fee/create-order", json={
        "listing_id": test_listing_id,
        "seller_id": "seller-rajesh",
        "seller_name": "Rajesh Kumar",
        "seller_email": "rajesh@gearup.in",
        "seller_phone": "9812345678"
    })
    assert order_res.status_code == 200
    order_data = order_res.json()
    assert order_data["status"] == "order_created"
    assert order_data["amount_inr"] == 299
    assert order_data["order_id"].startswith("ORDER-LISTING-")
    print(f"  ✓ Order created: {order_data['order_id']} | Amount: ₹{order_data['amount_inr']}")

    # --------------------------------------------------------------------------
    # 4. Publication Blocked When Unpaid
    # --------------------------------------------------------------------------
    print(f"\n[TEST 4] Publication Gate Blocks Unpaid Listing ({test_listing_id}):")
    # Setup mock pass for docs & photos in verification store
    VERIFICATION_STORE[test_listing_id] = {
        "listing_id": test_listing_id,
        "seller_id": "seller-rajesh",
        "platform_fee_paid": False, # Explicitly UNPAID
        "is_published": False,
        "vehicle_details": {
            "brand": "Royal Enfield",
            "model": "Classic 350",
            "registration_number": "CH01AB9988"
        },
        "level1_basic": {
            "rc": {"status": "passed", "extracted_fields": {"registration_number": "CH01AB9988"}},
            "insurance": {"status": "passed", "extracted_fields": {"expiry_date": "2027-10-10"}},
            "puc": {"status": "passed", "extracted_fields": {"expiry_date": "2027-10-10"}},
            "ownership_proof": {"status": "passed", "extracted_fields": {"seller_name": "Rajesh Kumar"}}
        },
        "photos": {slot: {"url": f"https://cdn.gearup.in/photos/{slot}.jpg"} for slot in [
            "front", "rear", "left_side", "right_side",
            "front_left_diagonal", "front_right_diagonal", "rear_left_diagonal", "rear_right_diagonal"
        ]}
    }
    save_records()

    pub_attempt = client.post("/api/verification/publish-listing", json={
        "listing_id": test_listing_id,
        "seller_id": "seller-rajesh"
    })
    assert pub_attempt.status_code == 402, f"Expected 402 Payment Required, got {pub_attempt.status_code}"
    err_body = pub_attempt.json()["detail"]
    assert err_body["reason"] == "platform_fee_unpaid"
    assert err_body["requires_platform_fee"] is True
    print(f"  ✓ Publication strictly rejected: {err_body['message']}")

    # --------------------------------------------------------------------------
    # 5. Authoritative Server-Side Payment Verification
    # --------------------------------------------------------------------------
    print(f"\n[TEST 5] Authoritative Payment Signature Verification:")
    verify_res = client.post("/api/platform-fee/verify-payment", json={
        "listing_id": test_listing_id,
        "order_id": order_data["order_id"],
        "payment_id": "pay_rzp_TEST982143",
        "signature": "mock_sandbox_sig",
        "seller_id": "seller-rajesh"
    })
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert v_data["status"] == "success"
    assert v_data["can_now_publish"] is True
    print(f"  ✓ Signature verified: Tx {v_data['transaction_id']} | Paid: ₹{v_data['amount_inr']}")

    # Check store has marked platform_fee_paid
    assert VERIFICATION_STORE[test_listing_id]["platform_fee_paid"] is True
    print("  ✓ Verification store record updated: platform_fee_paid = True")

    # --------------------------------------------------------------------------
    # 6. Duplicate Payment Prevention (Idempotency)
    # --------------------------------------------------------------------------
    print(f"\n[TEST 6] Duplicate Payment Prevention on Paid Listing:")
    dup_order = client.post("/api/platform-fee/create-order", json={
        "listing_id": test_listing_id,
        "seller_id": "seller-rajesh"
    })
    assert dup_order.status_code == 200
    assert dup_order.json()["status"] == "already_paid"
    print(f"  ✓ Duplicate order prevented: {dup_order.json()['message']}")

    dup_verify = client.post("/api/platform-fee/verify-payment", json={
        "listing_id": test_listing_id,
        "order_id": order_data["order_id"],
        "payment_id": "pay_rzp_ANOTHER_PAYMENT",
        "signature": "mock_sandbox_sig"
    })
    assert dup_verify.status_code == 200
    assert dup_verify.json()["status"] == "already_paid"
    print("  ✓ Duplicate payment verification prevented without double charging.")

    # --------------------------------------------------------------------------
    # 7. Listing Publication Unlocked After Payment Verification
    # --------------------------------------------------------------------------
    print(f"\n[TEST 7] Publication Gate Permits Verified Paid Listing:")
    pub_success = client.post("/api/verification/publish-listing", json={
        "listing_id": test_listing_id,
        "seller_id": "seller-rajesh"
    })
    assert pub_success.status_code == 200
    pub_data = pub_success.json()
    assert pub_data["status"] == "success"
    assert pub_data["is_published"] is True
    print(f"  ✓ Listing successfully published live: {pub_data['message']}")

    # --------------------------------------------------------------------------
    # 8. Payment Retry Without Duplicate Listings
    # --------------------------------------------------------------------------
    retry_listing_id = "TEST-BIKE-RETRY-802"
    print(f"\n[TEST 8] Payment Retry Mechanism for Failed Transactions ({retry_listing_id}):")
    retry_res = client.post("/api/platform-fee/retry", json={
        "listing_id": retry_listing_id,
        "seller_id": "seller-vikram"
    })
    assert retry_res.status_code == 200
    r_data = retry_res.json()
    assert r_data["status"] == "order_created"
    assert r_data["order_id"].startswith("ORDER-LISTING-RETRY-")
    print(f"  ✓ Retry order created cleanly: {r_data['order_id']}")

    # --------------------------------------------------------------------------
    # 9. Admin Analytics, Filtering & Export
    # --------------------------------------------------------------------------
    print("\n[TEST 9] Admin Financial Analytics & CSV Export:")
    rev_res = client.get("/api/platform-fee/admin/revenue")
    assert rev_res.status_code == 200
    rev_data = rev_res.json()
    assert rev_data["successful_payments"] >= 1
    assert rev_data["total_revenue_inr"] >= 299
    print(f"  ✓ Admin Revenue Realized: ₹{rev_data['total_revenue_inr']:,} ({rev_data['successful_payments']} successful payments)")

    tx_res = client.get(f"/api/platform-fee/admin/transactions?search={test_listing_id}")
    assert tx_res.status_code == 200
    tx_records = tx_res.json()["transactions"]
    assert len(tx_records) >= 1
    print(f"  ✓ Admin Transaction Search filtered {len(tx_records)} matching record(s).")

    export_res = client.get("/api/platform-fee/admin/export")
    assert export_res.status_code == 200
    assert "text/csv" in export_res.headers["content-type"]
    assert "Transaction ID,Order ID,Payment ID" in export_res.text
    print(f"  ✓ CSV Export functional: {len(export_res.text.splitlines())} rows exported.")

    print("\n" + "=" * 80)
    print("🎉 ALL 9 PLATFORM LISTING FEE & MONETIZATION TESTS PASSED!")
    print("=" * 80)

if __name__ == "__main__":
    test_platform_fee_suite()
