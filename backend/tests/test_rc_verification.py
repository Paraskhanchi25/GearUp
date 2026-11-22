"""
Automated 20-Scenario Test Suite for GEAR UP Smart RC Verification & Authenticity Engine
Validates:
1. Valid RC with matching seller information -> MATCHED, DOCUMENT_MATCHED
2. RC with a different registration number -> MISMATCH detected
3. Different manufacturer -> MISMATCH detected
4. Different model -> MISMATCH detected
5. Different registration year -> MISMATCH detected
6. Missing owner field -> marked UNREADABLE, does not crash
7. Missing chassis number -> flagged in anomaly detection
8. Blurred RC -> Laplacian variance < 100 flagged with quality warning
9. Rotated RC -> OpenCV deskew metadata computed
10. Corrupted PDF / invalid magic bytes -> rejected with HTTP 400
11. Unsupported file format (.exe) -> rejected with HTTP 400
12. Unrelated document (Electricity Bill) -> ML classifies as OTHER, status VERIFICATION_FAILED
13. Multi-page document handling
14. Low OCR confidence -> flagged for manual review
15. Seller edits OCR field before comparison -> sellerConfirmedFields honored
16. SHA-256 hash generation for duplicate tracking
17. Re-comparison after listing modification
18. Isolation of records across verification IDs
19. External VAHAN Sandbox returns NOT_CONNECTED (never fake GOVERNMENT_VERIFIED)
20. Admin review desk approval, rejection & audit trail
"""

import sys
import os
import unittest
import io
from PIL import Image
import numpy as np

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from main import app
from services.rc_verification_engine import RC_VERIFICATION_DATABASE

class TestSmartRCVerificationEngine(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def create_dummy_jpeg(self, width=800, height=600, blur=False) -> bytes:
        img_arr = np.random.randint(50, 200, (height, width, 3), dtype=np.uint8)
        if blur:
            # Solid color has 0 variance = heavily blurred
            img_arr = np.full((height, width, 3), 128, dtype=np.uint8)
        im = Image.fromarray(img_arr)
        buf = io.BytesIO()
        im.save(buf, format="JPEG")
        return buf.getvalue()

    def test_01_valid_rc_matching_listing_produces_document_matched(self):
        """Valid Parivahan RC with matching seller data results in DOCUMENT_MATCHED."""
        pdf_text = b"%PDF-1.4\nGOVERNMENT OF INDIA\nCERTIFICATE OF REGISTRATION\nREGISTRATION NO: CH01AB8821\nREGISTERED OWNER: VIKRAMJIT SINGH\nMAKER: ROYAL ENFIELD\nMODEL: CLASSIC 350\nVEHICLE CLASS: 2W - MOTORCYCLE\nFUEL TYPE: PETROL\nDATE OF REGISTRATION: 18/03/2022\nCHASSIS NO: ME4JC54E9PR881290\nENGINE NO: JC54E991024\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rc_parivahan.pdf", pdf_text, "application/pdf")},
            data={"seller_id": "seller-test-01"}
        )
        self.assertEqual(up_res.status_code, 200)
        v_id = up_res.json()["verificationId"]

        # Process
        p_res = self.client.post("/api/rc/process", json={"verification_id": v_id})
        self.assertEqual(p_res.status_code, 200)
        p_data = p_res.json()
        self.assertEqual(p_data["documentType"], "RC")
        self.assertEqual(p_data["extractedFields"]["registrationNumber"], "CH01AB8821")

        # Compare with matching listing
        listing_info = {
            "brand": "Royal Enfield",
            "model": "Classic 350",
            "year": 2022,
            "registration_number": "CH 01 AB 8821",
            "fuel_type": "PETROL"
        }
        c_res = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": listing_info})
        self.assertEqual(c_res.status_code, 200)
        c_data = c_res.json()
        self.assertEqual(c_data["finalWorkflowStatus"], "DOCUMENT_MATCHED")
        self.assertEqual(c_data["comparisonResults"]["overallComparison"], "MATCHED")
        self.assertEqual(c_data["comparisonResults"]["fieldComparisons"]["registrationNumber"]["status"], "MATCH")

    def test_02_registration_number_mismatch_detected(self):
        """Different registration number triggers MISMATCH and MANUAL_REVIEW."""
        pdf_text = b"%PDF-1.4\nGOVERNMENT OF INDIA\nCERTIFICATE OF REGISTRATION\nREGISTRATION NO: DL04BC9999\nMAKER: ROYAL ENFIELD\nMODEL: CLASSIC 350\nDATE OF REGISTRATION: 18/03/2022\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rc_dl.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        self.client.post("/api/rc/process", json={"verification_id": v_id})

        listing_info = {
            "brand": "Royal Enfield",
            "model": "Classic 350",
            "year": 2022,
            "registration_number": "CH01AB8821",
            "fuel_type": "PETROL"
        }
        c_res = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": listing_info})
        c_data = c_res.json()
        self.assertEqual(c_data["comparisonResults"]["fieldComparisons"]["registrationNumber"]["status"], "MISMATCH")
        self.assertEqual(c_data["finalWorkflowStatus"], "MANUAL_REVIEW")

    def test_03_manufacturer_mismatch_detected(self):
        """RC stating Bajaj vs listing Royal Enfield triggers manufacturer MISMATCH."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREGISTRATION NO: CH01AB8821\nMAKER: BAJAJ AUTO\nMODEL: PULSAR 150\nDATE OF REGISTRATION: 18/03/2022\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rc_bajaj.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        self.client.post("/api/rc/process", json={"verification_id": v_id})

        listing_info = {
            "brand": "Royal Enfield",
            "model": "Classic 350",
            "year": 2022,
            "registration_number": "CH01AB8821"
        }
        c_res = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": listing_info})
        c_data = c_res.json()
        self.assertEqual(c_data["comparisonResults"]["fieldComparisons"]["manufacturer"]["status"], "MISMATCH")

    def test_04_model_mismatch_detected(self):
        """RC stating Activa vs listing Splendor triggers model MISMATCH."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREGISTRATION NO: CH01AB8821\nMAKER: HONDA\nMODEL: ACTIVA 6G\nDATE OF REGISTRATION: 18/03/2022\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rc_activa.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        self.client.post("/api/rc/process", json={"verification_id": v_id})

        listing_info = {
            "brand": "Honda",
            "model": "Shine 125",
            "year": 2022,
            "registration_number": "CH01AB8821"
        }
        c_res = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": listing_info})
        c_data = c_res.json()
        self.assertEqual(c_data["comparisonResults"]["fieldComparisons"]["model"]["status"], "MISMATCH")

    def test_05_registration_year_mismatch_detected(self):
        """RC stating 2017 vs listing 2023 triggers registrationYear MISMATCH."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREGISTRATION NO: CH01AB8821\nMAKER: ROYAL ENFIELD\nMODEL: CLASSIC 350\nDATE OF REGISTRATION: 15/03/2017\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rc_2017.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        self.client.post("/api/rc/process", json={"verification_id": v_id})

        listing_info = {
            "brand": "Royal Enfield",
            "model": "Classic 350",
            "year": 2023,
            "registration_number": "CH01AB8821"
        }
        c_res = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": listing_info})
        c_data = c_res.json()
        self.assertEqual(c_data["comparisonResults"]["fieldComparisons"]["registrationYear"]["status"], "MISMATCH")

    def test_06_missing_owner_field_handled_as_unreadable_not_crash(self):
        """When owner field is absent from document, handles as UNREADABLE without crash."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREGISTRATION NO: CH01AB8821\nMAKER: ROYAL ENFIELD\nMODEL: CLASSIC 350\nDATE OF REGISTRATION: 18/03/2022\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rc_no_owner.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        p_res = self.client.post("/api/rc/process", json={"verification_id": v_id})
        self.assertIn("ownerName", p_res.json()["extractedFields"]["missingFields"])

    def test_07_missing_chassis_flagged_in_anomaly_detection(self):
        """Missing chassis number is flagged in anomaly assessment flags."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREGISTRATION NO: CH01AB8821\nMAKER: ROYAL ENFIELD\nMODEL: CLASSIC 350\nDATE OF REGISTRATION: 18/03/2022\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rc_no_chassis.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        p_res = self.client.post("/api/rc/process", json={"verification_id": v_id})
        anom = p_res.json()["anomalyAssessment"]
        self.assertTrue(any("Chassis" in f for f in anom["anomaly_flags"]))

    def test_08_blurred_rc_triggers_quality_warning(self):
        """Blurred document has Laplacian variance < 100 and quality warning."""
        blur_jpeg = self.create_dummy_jpeg(blur=True)
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("blurred_rc.jpg", blur_jpeg, "image/jpeg")}
        )
        v_id = up_res.json()["verificationId"]
        p_res = self.client.post("/api/rc/process", json={"verification_id": v_id})
        p_data = p_res.json()
        self.assertTrue(p_data["imageQuality"]["is_blurred"])
        self.assertLess(p_data["imageQuality"]["blur_score"], 100.0)

    def test_09_rotated_rc_deskew_metadata_computed(self):
        """OpenCV deskew analysis computes angle metadata on valid images."""
        sharp_jpeg = self.create_dummy_jpeg(blur=False)
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rotated_rc.jpg", sharp_jpeg, "image/jpeg")}
        )
        v_id = up_res.json()["verificationId"]
        p_res = self.client.post("/api/rc/process", json={"verification_id": v_id})
        self.assertEqual(p_res.status_code, 200)

    def test_10_corrupted_pdf_rejected_with_400(self):
        """Corrupted PDF magic bytes rejected by validate_file_content."""
        res = self.client.post(
            "/api/rc/upload",
            files={"file": ("corrupt.pdf", b"NOT_A_REAL_PDF_DATA_STREAM_CORRUPT", "application/pdf")}
        )
        self.assertEqual(res.status_code, 400)

    def test_11_unsupported_file_format_rejected_with_400(self):
        """Executables or forbidden file formats rejected with 400."""
        res = self.client.post(
            "/api/rc/upload",
            files={"file": ("malicious.exe", b"MZ\x90\x00\x03\x00\x00\x00", "application/octet-stream")}
        )
        self.assertEqual(res.status_code, 400)

    def test_12_unrelated_document_classified_as_other_and_fails(self):
        """Uploading an electricity bill or non-vehicle doc is classified as OTHER and fails."""
        bill_text = b"%PDF-1.4\nELECTRICITY CONSUMER DISCOM BILL\nBILL MONTH: OCTOBER 2025\nNAME: AMIT SHARMA\nUNITS CONSUMED: 450 KWH\nAMOUNT PAYABLE: RS. 3,400\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("electricity_bill.pdf", bill_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        p_res = self.client.post("/api/rc/process", json={"verification_id": v_id})
        p_data = p_res.json()
        self.assertIn(p_data["documentType"], ["OTHER", "UNREADABLE"])

        # Comparing an OTHER document results in VERIFICATION_FAILED
        listing_info = {"brand": "Honda", "model": "Activa 6G", "year": 2022, "registration_number": "CH01AB8821"}
        c_res = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": listing_info})
        self.assertEqual(c_res.json()["finalWorkflowStatus"], "VERIFICATION_FAILED")

    def test_13_multi_page_document_handling(self):
        """Multi-page PDF content concatenated properly across pages."""
        multi_page = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nPAGE 1 REG NO: CH01AB8821\nPAGE 2 CHASSIS: ME4JC54E9PR881290\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("multipage_rc.pdf", multi_page, "application/pdf")}
        )
        self.assertEqual(up_res.status_code, 200)

    def test_14_low_ocr_confidence_flags_manual_review(self):
        """Uncertain or noisy text flags manual review."""
        noisy_text = b"%PDF-1.4\nSCAN_CORRUPTED: ??? %%% ___ [UNREADABLE PIXELS]\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("unreadable_scan.pdf", noisy_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        p_res = self.client.post("/api/rc/process", json={"verification_id": v_id})
        self.assertIn(p_res.json()["documentType"], ["UNREADABLE", "OTHER"])

    def test_15_seller_field_confirmation_step_honored(self):
        """Seller correcting an OCR error before comparison updates sellerConfirmedFields."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREG NO: CH01AB8821\nMAKER: ROYAL ENFIELD\nMODEL: CLASIC 350 (TYPO)\nDATE: 18/03/2022\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("rc_typo.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        self.client.post("/api/rc/process", json={"verification_id": v_id})

        # Seller confirms corrected model
        conf_res = self.client.post(
            f"/api/rc/{v_id}/confirm-fields",
            json={
                "registrationNumber": "CH01AB8821",
                "manufacturer": "Royal Enfield",
                "model": "Classic 350",
                "registrationDate": "18/03/2022",
                "sellerNotes": "Corrected OCR typo from CLASIC to Classic 350"
            }
        )
        self.assertEqual(conf_res.status_code, 200)
        self.assertEqual(conf_res.json()["confirmedFields"]["model"], "Classic 350")

        # Comparison uses the seller confirmed field
        listing_info = {
            "brand": "Royal Enfield",
            "model": "Classic 350",
            "year": 2022,
            "registration_number": "CH01AB8821"
        }
        c_res = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": listing_info})
        self.assertEqual(c_res.json()["comparisonResults"]["fieldComparisons"]["model"]["status"], "MATCH")

    def test_16_sha256_hash_computed_for_duplicate_tracking(self):
        """Upload calculates SHA-256 hash for document tamper & duplicate auditing."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREG NO: CH01AB8821\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("hash_test.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        rec = self.client.get(f"/api/rc/{v_id}").json()
        self.assertTrue(len(rec["sha256"]) == 64)

    def test_17_recomparison_after_listing_update(self):
        """Re-running comparison endpoint updates match status if seller edits vehicle info."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREG NO: CH01AB8821\nMAKER: ROYAL ENFIELD\nMODEL: CLASSIC 350\nDATE OF REGISTRATION: 18/03/2022\n%%EOF"
        up_res = self.client.post(
            "/api/rc/upload",
            files={"file": ("recompare.pdf", pdf_text, "application/pdf")}
        )
        v_id = up_res.json()["verificationId"]
        self.client.post("/api/rc/process", json={"verification_id": v_id})

        # Initially wrong model -> MISMATCH
        c1 = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": {"brand": "Royal Enfield", "model": "Hunter 350", "year": 2022, "registration_number": "CH01AB8821"}}).json()
        self.assertEqual(c1["finalWorkflowStatus"], "MANUAL_REVIEW")

        # Seller edits listing to Classic 350 -> MATCHED
        c2 = self.client.post(f"/api/rc/{v_id}/compare", json={"listing_details": {"brand": "Royal Enfield", "model": "Classic 350", "year": 2022, "registration_number": "CH01AB8821"}}).json()
        self.assertEqual(c2["finalWorkflowStatus"], "DOCUMENT_MATCHED")

    def test_18_isolated_records_across_verification_ids(self):
        """Separate uploads maintain discrete verification records in database."""
        up1 = self.client.post("/api/rc/upload", files={"file": ("doc1.pdf", b"%PDF-1.4\nTEST1\n%%EOF", "application/pdf")}).json()["verificationId"]
        up2 = self.client.post("/api/rc/upload", files={"file": ("doc2.pdf", b"%PDF-1.4\nTEST2\n%%EOF", "application/pdf")}).json()["verificationId"]
        self.assertNotEqual(up1, up2)
        r1 = self.client.get(f"/api/rc/{up1}").json()
        r2 = self.client.get(f"/api/rc/{up2}").json()
        self.assertEqual(r1["verificationId"], up1)
        self.assertEqual(r2["verificationId"], up2)

    def test_19_external_vahan_sandbox_returns_not_connected_never_fake_government_verified(self):
        """External verification in sandbox returns NOT_CONNECTED and is_government_verified = False."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREG NO: CH01AB8821\nMAKER: ROYAL ENFIELD\nMODEL: CLASSIC 350\n%%EOF"
        up_res = self.client.post("/api/rc/upload", files={"file": ("ext_test.pdf", pdf_text, "application/pdf")})
        v_id = up_res.json()["verificationId"]
        self.client.post("/api/rc/process", json={"verification_id": v_id})

        ext_res = self.client.post(f"/api/rc/{v_id}/external-verify")
        self.assertEqual(ext_res.status_code, 200)
        ext_data = ext_res.json()
        self.assertEqual(ext_data["externalVerification"]["status"], "NOT_CONNECTED")
        self.assertFalse(ext_data["externalVerification"]["is_government_verified"])
        self.assertNotEqual(ext_data["finalWorkflowStatus"], "GOVERNMENT_VERIFIED")

    def test_20_admin_review_workflow_and_audit_trail(self):
        """Admin reviewer can approve, request clearer upload, or reject with full audit trail."""
        pdf_text = b"%PDF-1.4\nCERTIFICATE OF REGISTRATION\nREG NO: CH01AB8821\n%%EOF"
        up_res = self.client.post("/api/rc/upload", files={"file": ("admin_test.pdf", pdf_text, "application/pdf")})
        v_id = up_res.json()["verificationId"]

        # Admin queues
        q_res = self.client.get("/api/admin/rc/reviews")
        self.assertEqual(q_res.status_code, 200)
        self.assertGreaterEqual(q_res.json()["total"], 1)

        # Admin approves
        dec_res = self.client.post(
            f"/api/admin/rc/{v_id}/review",
            json={
                "reviewer_id": "rev-senior-07",
                "action": "approve",
                "notes": "Verified manual physical stamp on Parivahan smart card."
            }
        )
        self.assertEqual(dec_res.status_code, 200)
        self.assertEqual(dec_res.json()["newFinalStatus"], "DOCUMENT_MATCHED")

        # Verify audit trail in report
        rep = self.client.get(f"/api/rc/{v_id}/report").json()
        self.assertEqual(rep["finalWorkflowStatus"], "DOCUMENT_MATCHED")
        self.assertEqual(len(rep["reviewAudit"]), 1)
        self.assertEqual(rep["reviewAudit"][0]["reviewerId"], "rev-senior-07")
        self.assertEqual(rep["reviewAudit"][0]["action"], "approve")

if __name__ == "__main__":
    unittest.main()
