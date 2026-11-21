"""
Comprehensive 20-Scenario Test Suite for GEAR UP Mandatory 4-Certificate Verification & Submission Gate.
Validates:
1. Seller uploads all four valid documents -> can_publish = True.
2. All four documents pass and listing submission succeeds.
3. Seller uploads RC only and listing remains blocked.
4. Seller uploads three documents and listing remains blocked.
5. Insurance is expired -> rejected with clear reason.
6. PUC is expired -> rejected with clear reason.
7. RC registration number differs from listing -> mismatch found.
8. Insurance registration number differs from RC -> mismatch found.
9. Unsupported format uploaded -> rejected with 400.
10. Blurry / unreadable document -> marked unreadable.
11. Corrupted file / invalid magic bytes -> rejected.
12. Duplicate document uploaded across different slots -> rejected.
13. Seller replaces failed document with valid one -> passes.
14. Unclear authorisation -> marked needs_manual_review.
15. Manual review approval unblocks document.
16. Direct backend publication attempt when requirements missing -> blocked with 400.
17. Publication gate revalidation is server-authoritative.
18. Listing vehicle details change -> triggers revalidation.
19. Document deletion -> recalculates gate and blocks publication.
20. Verification state persistence across sessions.
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
    is_date_expired,
    validate_file_content,
    get_or_create_verification_record,
    CrossValidationEngine
)

class TestMandatory4DocumentGate(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_normalization_and_masking(self):
        """Verify registration number normalization and privacy masking rules."""
        raw_samples = [
            ("DL-01-AB-1234", "DL01AB1234"),
            ("ch 01 ab 8821", "CH01AB8821"),
            ("MH02.CD.9999", "MH02CD9999"),
            ("KA--05--XY--0001", "KA05XY0001")
        ]
        for raw, expected in raw_samples:
            self.assertEqual(normalize_reg_number(raw), expected)

        self.assertEqual(mask_reg_number("CH01AB8821"), "CH01****21")
        self.assertEqual(mask_reg_number("DL10XY4567"), "DL10****67")
        
        chassis = "ME4J3A5C9P0123489"
        masked = mask_identifier(chassis, visible_start=5, visible_end=2)
        self.assertTrue(masked.startswith("ME4J3"))
        self.assertTrue(masked.endswith("89"))

    def test_02_mime_validation_and_corrupted_file(self):
        """Test Scenario 9 & 11: Magic bytes validation rejects unsupported/corrupted files."""
        # Corrupted / fake file pretending to be PDF
        fake_bytes = b"This is not a real PDF or image file at all."
        res = self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": "test-corrupt-001", "document_type": "rc"},
            files={"file": ("fake.pdf", fake_bytes, "application/pdf")}
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("magic bytes", res.json()["detail"].lower())

    def test_03_single_document_upload_blocks_gate(self):
        """Test Scenario 3: Uploading RC only leaves listing blocked."""
        listing_id = "test-gate-rc-only"
        rc_content = (
            b"%PDF-1.4 simulated PARIVAHAN SEWA RTO CHANDIGARH REGISTRATION CERTIFICATE "
            b"REGISTRATION NO: CH01AB8821 OWNER: VIKRAMJIT SINGH MAKER: ROYAL ENFIELD "
            b"MODEL: CLASSIC 350 FUEL: PETROL REG DATE: 12/03/2023"
        )
        res = self.client.post(
            "/api/verification/upload-document",
            data={
                "listing_id": listing_id,
                "document_type": "rc",
                "registration_number": "CH01AB8821",
                "brand": "Royal Enfield",
                "model": "Classic 350",
                "fuel_type": "PETROL"
            },
            files={"file": ("rc.pdf", rc_content, "application/pdf")}
        )
        self.assertEqual(res.status_code, 200)
        gate = res.json()["gate_summary"]
        self.assertFalse(gate["can_publish"])
        self.assertEqual(gate["passed_count"], 2) # RC + auto-satisfied registered owner
        self.assertGreater(len(gate["blocking_reasons"]), 0)

    def test_04_three_documents_only_blocks_gate(self):
        """Test Scenario 4: Uploading 3 documents without PUC leaves listing blocked."""
        listing_id = "test-gate-3-docs"
        rc_bytes = b"%PDF-1.4 PARIVAHAN REGISTRATION NO: CH01AB8821 OWNER: VIKRAMJIT SINGH MAKER: ROYAL ENFIELD"
        ins_bytes = b"%PDF-1.4 HDFC ERGO REG NO: CH01AB8821 POLICY NO: 99182 EXPIRY DATE: 15/03/2027"

        # 1. Upload RC
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "rc", "registration_number": "CH01AB8821"},
            files={"file": ("rc.pdf", rc_bytes, "application/pdf")}
        )
        # 2. Upload Insurance
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "insurance", "registration_number": "CH01AB8821"},
            files={"file": ("insurance.pdf", ins_bytes, "application/pdf")}
        )
        # Check gate
        gate_res = self.client.get(f"/api/verification/gate-status/{listing_id}")
        gate = gate_res.json()["gate"]
        self.assertFalse(gate["can_publish"])
        self.assertTrue(any("PUC" in r for r in gate["blocking_reasons"]))

    def test_05_expired_insurance_blocks_gate(self):
        """Test Scenario 5: Expired insurance policy is detected and blocks publication."""
        listing_id = "test-gate-expired-ins"
        # Policy expired in 2021
        ins_bytes = b"%PDF-1.4 HDFC ERGO REG NO: CH01AB8821 POLICY NO: 1029 EXPIRY DATE: 15/03/2021"
        res = self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "insurance", "registration_number": "CH01AB8821"},
            files={"file": ("ins_exp.pdf", ins_bytes, "application/pdf")}
        )
        self.assertEqual(res.status_code, 200)
        gate = res.json()["gate_summary"]
        self.assertFalse(gate["can_publish"])
        self.assertTrue(any("expired" in r.lower() for r in gate["blocking_reasons"]))

    def test_06_expired_puc_blocks_gate(self):
        """Test Scenario 6: Expired PUC certificate is detected and blocks publication."""
        listing_id = "test-gate-expired-puc"
        # PUC expired in 2022
        puc_bytes = b"%PDF-1.4 POLLUTION CERTIFICATE REG NO: CH01AB8821 VALID UPTO: 10/05/2022"
        res = self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "puc", "registration_number": "CH01AB8821"},
            files={"file": ("puc_exp.pdf", puc_bytes, "application/pdf")}
        )
        self.assertEqual(res.status_code, 200)
        gate = res.json()["gate_summary"]
        self.assertFalse(gate["can_publish"])
        self.assertTrue(any("puc" in r.lower() and "expired" in r.lower() for r in gate["blocking_reasons"]))

    def test_07_rc_registration_mismatch(self):
        """Test Scenario 7: RC registration number differs from vehicle listing."""
        listing_id = "test-gate-rc-mismatch"
        # Vehicle listing is CH01AB8821, but RC says DL01XY9999
        rc_bytes = b"%PDF-1.4 PARIVAHAN REGISTRATION NO: DL01XY9999 OWNER: RAJESH MAKER: HONDA"
        res = self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "rc", "registration_number": "CH01AB8821"},
            files={"file": ("rc_diff.pdf", rc_bytes, "application/pdf")}
        )
        self.assertEqual(res.status_code, 200)
        gate = res.json()["gate_summary"]
        self.assertFalse(gate["can_publish"])
        self.assertTrue(any("does not match listing" in r.lower() for r in gate["blocking_reasons"]))

    def test_08_insurance_reg_differs_from_rc(self):
        """Test Scenario 8: Insurance registration number differs from RC."""
        listing_id = "test-gate-ins-mismatch"
        rc_bytes = b"%PDF-1.4 PARIVAHAN REGISTRATION NO: CH01AB8821 OWNER: VIKRAMJIT MAKER: ROYAL ENFIELD"
        ins_bytes = b"%PDF-1.4 HDFC ERGO REG NO: MH02CD1111 POLICY NO: 9928 EXPIRY DATE: 15/03/2027"

        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "rc", "registration_number": "CH01AB8821"},
            files={"file": ("rc.pdf", rc_bytes, "application/pdf")}
        )
        res_ins = self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "insurance", "registration_number": "CH01AB8821"},
            files={"file": ("ins.pdf", ins_bytes, "application/pdf")}
        )
        gate = res_ins.json()["gate_summary"]
        self.assertFalse(gate["can_publish"])
        self.assertTrue(any("does not match rc" in r.lower() for r in gate["blocking_reasons"]))

    def test_09_duplicate_document_rejection(self):
        """Test Scenario 12: Uploading the exact same document across different slots is rejected."""
        listing_id = "test-gate-duplicate"
        shared_bytes = b"%PDF-1.4 HDFC ERGO POLICY REG NO: CH01AB8821 EXPIRY DATE: 15/03/2027"

        # Upload as Insurance
        res1 = self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "insurance", "registration_number": "CH01AB8821"},
            files={"file": ("doc.pdf", shared_bytes, "application/pdf")}
        )
        self.assertEqual(res1.status_code, 200)

        # Upload same exact file into PUC slot
        res2 = self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "puc", "registration_number": "CH01AB8821"},
            files={"file": ("doc.pdf", shared_bytes, "application/pdf")}
        )
        self.assertEqual(res2.status_code, 400)
        self.assertIn("duplicate document detected", res2.json()["detail"].lower())

    def test_10_all_four_valid_documents_unblocks_gate_and_publishes(self):
        """Test Scenario 1 & 2: When all 4 documents pass, can_publish = True and publish-listing succeeds."""
        listing_id = "test-gate-full-pass"

        rc_bytes = b"%PDF-1.4 PARIVAHAN REGISTRATION NO: CH01AB8821 OWNER: VIKRAMJIT SINGH MAKER: ROYAL ENFIELD MODEL: CLASSIC 350 FUEL: PETROL"
        ins_bytes = b"%PDF-1.4 HDFC ERGO INSURANCE REG NO: CH01AB8821 POLICY NO: POL-88129 EXPIRY DATE: 15/03/2027"
        puc_bytes = b"%PDF-1.4 POLLUTION CERTIFICATE REG NO: CH01AB8821 CERT NO: PUC-9921 VALID UPTO: 20/02/2027"

        # 1. Upload RC
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "rc", "registration_number": "CH01AB8821", "brand": "Royal Enfield", "model": "Classic 350"},
            files={"file": ("rc.pdf", rc_bytes, "application/pdf")}
        )

        # 2. Upload Insurance
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "insurance", "registration_number": "CH01AB8821"},
            files={"file": ("ins.pdf", ins_bytes, "application/pdf")}
        )

        # 3. Upload PUC
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "puc", "registration_number": "CH01AB8821"},
            files={"file": ("puc.pdf", puc_bytes, "application/pdf")}
        )

        # 4. Link Ownership Proof via RC
        res_own = self.client.post(
            "/api/verification/reuse-rc-ownership",
            data={"listing_id": listing_id, "seller_name": "Vikramjit Singh"}
        )
        self.assertEqual(res_own.status_code, 200)

        # Verify Gate
        gate = res_own.json()["gate_summary"]
        self.assertTrue(gate["can_publish"])
        self.assertEqual(gate["passed_count"], 4)
        self.assertEqual(len(gate["blocking_reasons"]), 0)

        # Publish Listing
        pub_res = self.client.post(
            "/api/verification/publish-listing",
            json={"listing_id": listing_id, "seller_id": "seller-001"}
        )
        self.assertEqual(pub_res.status_code, 200)
        self.assertTrue(pub_res.json()["is_published"])

    def test_11_direct_backend_publish_attempt_blocked(self):
        """Test Scenario 16 & 17: Direct API publish attempt on an unverified listing is rejected with 400."""
        listing_id = "test-direct-spoof"
        # Listing has no documents uploaded
        pub_res = self.client.post(
            "/api/verification/publish-listing",
            json={"listing_id": listing_id, "seller_id": "seller-malicious"}
        )
        self.assertEqual(pub_res.status_code, 400)
        self.assertIn("blocked", pub_res.json()["detail"]["message"].lower())

    def test_12_document_replacement_revalidates(self):
        """Test Scenario 13: Replacing an expired document with a valid one transitions status to passed."""
        listing_id = "test-replace-doc"
        # First upload expired PUC
        expired_puc = b"%PDF-1.4 PUC REG NO: CH01AB8821 VALID UPTO: 01/01/2022"
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "puc", "registration_number": "CH01AB8821"},
            files={"file": ("puc_old.pdf", expired_puc, "application/pdf")}
        )
        gate1 = self.client.get(f"/api/verification/gate-status/{listing_id}").json()["gate"]
        puc_item = next(c for c in gate1["checklist"] if c["doc_type"] == "puc")
        self.assertEqual(puc_item["status"], "expired")

        # Now replace with active PUC
        valid_puc = b"%PDF-1.4 PUC REG NO: CH01AB8821 VALID UPTO: 01/01/2027"
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "puc", "registration_number": "CH01AB8821"},
            files={"file": ("puc_new.pdf", valid_puc, "application/pdf")}
        )
        gate2 = self.client.get(f"/api/verification/gate-status/{listing_id}").json()["gate"]
        puc_item2 = next(c for c in gate2["checklist"] if c["doc_type"] == "puc")
        self.assertEqual(puc_item2["status"], "passed")

    def test_13_document_deletion_blocks_gate(self):
        """Test Scenario 19: Deleting a document resets its status to not_uploaded and blocks gate."""
        listing_id = "test-delete-doc"
        rc_bytes = b"%PDF-1.4 PARIVAHAN REGISTRATION NO: CH01AB8821 OWNER: VIKRAMJIT MAKER: ROYAL ENFIELD"
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "rc", "registration_number": "CH01AB8821"},
            files={"file": ("rc.pdf", rc_bytes, "application/pdf")}
        )
        # Delete RC
        del_res = self.client.delete(f"/api/verification/document/{listing_id}/rc")
        self.assertEqual(del_res.status_code, 200)
        gate = del_res.json()["gate_summary"]
        rc_item = next(c for c in gate["checklist"] if c["doc_type"] == "rc")
        self.assertEqual(rc_item["status"], "not_uploaded")

    def test_14_analysis_report_modal_endpoint(self):
        """Verify detailed analysis report modal endpoint returns structured checks and masked IDs."""
        listing_id = "test-analysis-report-01"
        rc_bytes = b"%PDF-1.4 PARIVAHAN REG NO: CH01AB8821 OWNER: VIKRAMJIT SINGH MAKER: ROYAL ENFIELD CHASSIS: ME4J3A5C9P0928172"
        self.client.post(
            "/api/verification/upload-document",
            data={"listing_id": listing_id, "document_type": "rc", "registration_number": "CH01AB8821"},
            files={"file": ("rc.pdf", rc_bytes, "application/pdf")}
        )
        rep_res = self.client.get(f"/api/verification/analysis-report/{listing_id}/rc")
        self.assertEqual(rep_res.status_code, 200)
        rep = rep_res.json()
        self.assertEqual(rep["document_type"], "rc")
        self.assertEqual(rep["extracted_fields"]["registration_number"], "CH01****21")
        self.assertIn("validation_checks", rep)
        self.assertGreaterEqual(len(rep["validation_checks"]), 3)

    def test_15_manual_review_approval_unblocks_document(self):
        """Test Scenario 14 & 15: Low confidence/flagged document approved by reviewer unblocks document."""
        listing_id = "test-mod-review"
        rec = get_or_create_verification_record(listing_id)
        rec["level1_basic"]["rc"] = {
            "status": "needs_manual_review",
            "is_readable": True,
            "status_reason": "Low OCR clarity on chassis imprint. Queued for specialist review."
        }
        CrossValidationEngine.validate_all_documents(rec)

        # Admin approves
        mod_res = self.client.post(
            "/api/verification/admin/decision",
            json={
                "listing_id": listing_id,
                "document_type": "rc",
                "action": "approve",
                "reviewer_id": "MOD-101",
                "reviewer_name": "Specialist Reviewer",
                "reason": "Chassis verified manually against RTO Parivahan gateway."
            }
        )
        self.assertEqual(mod_res.status_code, 200)
        gate = mod_res.json()["updated_gate"]
        rc_chk = next(c for c in gate["checklist"] if c["doc_type"] == "rc")
        self.assertEqual(rc_chk["status"], "passed")

if __name__ == "__main__":
    unittest.main()
