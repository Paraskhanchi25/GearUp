"""
Comprehensive Test Suite for GEAR UP 3-Level Document Verification System.
Validates:
1. Document upload and OCR extraction (RC, Insurance, PUC).
2. Registration number normalization and multi-way consistency checking.
3. Level 2 condition, maintenance, battery health, and accident disclosure.
4. Level 3 ownership relationship and Form 29/30 transfer readiness.
5. Overall listing status computation and audit logging.
6. Public trust summary data privacy (masked identifiers, no raw document leaks).
7. Reviewer Moderation Desk queue, inspection detail, and action audit trail.
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app
from services.verification_service import (
    normalize_reg_number,
    mask_reg_number,
    mask_identifier,
    DocumentExtractionEngine,
    VehicleVerificationService
)

class TestDocumentVerification(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_normalization_and_masking(self):
        """Verify registration number normalization and privacy masking rules."""
        raw_samples = [
            ("DL-01-AB-1234", "DL01AB1234"),
            ("ch 01 ab 8821", "CH01AB8821"),
            ("MH02.CD.9999", "MH02CD9999"),
            ("KA--05--XY--0001", "KA05XY0001")
        ]
        for raw, expected in raw_samples:
            self.assertEqual(normalize_reg_number(raw), expected)

        # Masking tests
        self.assertEqual(mask_reg_number("CH01AB8821"), "CH01****21")
        self.assertEqual(mask_reg_number("DL10XY4567"), "DL10****67")
        
        # Chassis / Engine masking tests
        chassis = "ME4J3A5C9P0123489"
        masked = mask_identifier(chassis, visible_start=5, visible_end=2)
        self.assertTrue(masked.startswith("ME4J3"))
        self.assertTrue(masked.endswith("89"))
        self.assertTrue("*" in masked)

    def test_level1_document_upload_and_ocr(self):
        """Test Level 1: Uploading an RC certificate with OCR extraction and field matching."""
        listing_id = "test-bike-verification-001"

        rc_content = (
            b"PARIVAHAN SEWA RTO CHANDIGARH REGISTRATION CERTIFICATE "
            b"REGISTRATION NO: CH01AB8821 "
            b"OWNER: VIKRAMJIT SINGH "
            b"MAKER: ROYAL ENFIELD CLASSIC 350 "
            b"ENGINE NO: J350E1029384 "
            b"CHASSIS NO: ME4J3A5C9P0928172 "
            b"FUEL: PETROL "
            b"REG DATE: 12/03/2023 "
            b"FINANCIER: NONE"
        )

        response = self.client.post(
            "/api/verification/upload-document",
            data={
                "listing_id": listing_id,
                "document_type": "rc",
                "registration_number": "CH01AB8821",
                "fuel_type": "petrol",
                "brand": "Royal Enfield",
                "model": "Classic 350"
            },
            files={"file": ("rc_test.png", rc_content, "image/png")}
        )

        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["document_type"], "rc")
        self.assertEqual(res_data["result"]["status"], "matched")
        self.assertIn("extracted_fields", res_data["result"])
        self.assertEqual(res_data["result"]["extracted_fields"]["registration_number"], "CH01AB8821")

    def test_level1_insurance_and_puc_upload(self):
        """Test Level 1: Insurance and PUC upload and validity checking."""
        listing_id = "test-bike-verification-001"

        # Insurance
        ins_content = (
            b"HDFC ERGO GENERAL INSURANCE TWO WHEELER CERTIFICATE "
            b"POLICY NO: 2311-98721029-00 "
            b"REG NO: CH01AB8821 "
            b"POLICY START: 12/03/2023 "
            b"EXPIRY DATE: 11/03/2027 "
            b"TYPE: COMPREHENSIVE"
        )

        res_ins = self.client.post(
            "/api/verification/upload-document",
            data={
                "listing_id": listing_id,
                "document_type": "insurance",
                "registration_number": "CH01AB8821",
                "fuel_type": "petrol",
                "brand": "Royal Enfield",
                "model": "Classic 350"
            },
            files={"file": ("insurance_test.png", ins_content, "image/png")}
        )
        self.assertEqual(res_ins.status_code, 200)
        ins_data = res_ins.json()
        self.assertEqual(ins_data["status"], "success")
        self.assertEqual(ins_data["result"]["status"], "matched")

        # PUC
        puc_content = (
            b"TRANSPORT DEPARTMENT GOVT OF NCT DELHI / CHANDIGARH "
            b"POLLUTION UNDER CONTROL CERTIFICATE "
            b"CERTIFICATE NO: CH-01-2025-009182 "
            b"VEHICLE NO: CH01AB8821 "
            b"VALID UPTO: 28/02/2027 "
            b"EMISSION RESULT: PASS COMPLIANT"
        )

        res_puc = self.client.post(
            "/api/verification/upload-document",
            data={
                "listing_id": listing_id,
                "document_type": "puc",
                "registration_number": "CH01AB8821",
                "fuel_type": "petrol",
                "brand": "Royal Enfield",
                "model": "Classic 350"
            },
            files={"file": ("puc_test.png", puc_content, "image/png")}
        )
        self.assertEqual(res_puc.status_code, 200)
        puc_data = res_puc.json()
        self.assertEqual(puc_data["status"], "success")
        self.assertEqual(puc_data["result"]["status"], "matched")

    def test_level2_condition_and_maintenance(self):
        """Test Level 2: Submitting maintenance history, battery health, and accident disclosure."""
        listing_id = "test-bike-verification-001"
        payload = {
            "listing_id": listing_id,
            "service_history": "regular",
            "last_service_date": "15/10/2025",
            "last_service_odometer": 8500,
            "service_centre_name": "Royal Enfield Company Service Centre, Sector 22",
            "tyre_condition": "good",
            "tyre_notes": "4.2mm tread depth, no uneven edge wear",
            "battery_condition": "good",
            "accident_disclosure": "none",
            "accident_notes": "No accidents or chassis impacts."
        }
        response = self.client.post("/api/verification/level2-condition", json=payload)
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertEqual(res["status"], "success")
        self.assertEqual(res["level2_status"], "completed")

    def test_level3_ownership_and_transfer_readiness(self):
        """Test Level 3: Ownership relationship and Form 29/30 transfer readiness."""
        listing_id = "test-bike-verification-001"
        payload = {
            "listing_id": listing_id,
            "seller_full_name": "Vikramjit Singh",
            "relationship_to_owner": "registered_owner",
            "is_registered_owner": True,
            "authorisation_notes": "First registered owner with physical RC available.",
            "loan_status": "no_loan",
            "has_form29": True,
            "has_form30": True
        }
        response = self.client.post("/api/verification/level3-ownership", json=payload)
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertEqual(res["status"], "success")
        self.assertEqual(res["level3_status"], "completed")

    def test_seller_verification_report_and_buyer_trust_summary(self):
        """Test Seller Verification Report and Buyer-Facing Privacy-Preserving Trust Summary."""
        listing_id = "test-bike-verification-001"

        # 1. Full Seller Report
        rep_res = self.client.get(f"/api/verification/report/{listing_id}")
        self.assertEqual(rep_res.status_code, 200)
        rep_data = rep_res.json()
        self.assertEqual(rep_data["listing_id"], listing_id)
        self.assertIn(rep_data["level1_status"], ["completed", "in_progress", "pending"])
        self.assertEqual(rep_data["level2_status"], "completed")
        self.assertEqual(rep_data["level3_status"], "completed")

        # 2. Public Buyer Trust Summary
        pub_res = self.client.get(f"/api/verification/public-summary/{listing_id}")
        self.assertEqual(pub_res.status_code, 200)
        pub_data = pub_res.json()
        # Must have masked registration
        self.assertEqual(pub_data["masked_registration"], "CH01****21")
        # Zero raw document URLs or full personal IDs exposed
        self.assertNotIn("file_path", str(pub_data))
        self.assertNotIn("storage/verification_docs", str(pub_data))
        self.assertGreaterEqual(len(pub_data["verified_checks"]), 4)

    def test_reviewer_queue_and_decision_audit(self):
        """Test Reviewer Moderation Desk queue inspection and decision audit logging."""
        listing_id = "test-bike-verification-001"

        # 1. Inspect queue
        queue_res = self.client.get("/api/verification/admin/queue")
        self.assertEqual(queue_res.status_code, 200)
        queue_data = queue_res.json()
        self.assertGreaterEqual(queue_data["total"], 1)

        # 2. Inspect specific listing details
        detail_res = self.client.get(f"/api/verification/admin/listing/{listing_id}")
        self.assertEqual(detail_res.status_code, 200)
        detail_data = detail_res.json()
        self.assertEqual(detail_data["listing_id"], listing_id)

        # 3. Take reviewer decision
        decision_payload = {
            "listing_id": listing_id,
            "document_type": "rc",
            "action": "approve",
            "reviewer_id": "MOD-TEST-99",
            "reviewer_name": "Chief Moderation Officer",
            "reason": "Test approval: all Parivahan fields match vehicle listing."
        }
        dec_res = self.client.post("/api/verification/admin/decision", json=decision_payload)
        self.assertEqual(dec_res.status_code, 200)
        dec_data = dec_res.json()
        self.assertEqual(dec_data["status"], "success")
        self.assertEqual(dec_data["action_recorded"]["reviewer_id"], "MOD-TEST-99")

        # 4. Check that audit entry is retained in detail
        recheck_res = self.client.get(f"/api/verification/admin/listing/{listing_id}")
        audit_log = recheck_res.json()["record"]["review_audit_log"]
        self.assertTrue(any(a["reviewer_id"] == "MOD-TEST-99" for a in audit_log))

if __name__ == "__main__":
    unittest.main()
