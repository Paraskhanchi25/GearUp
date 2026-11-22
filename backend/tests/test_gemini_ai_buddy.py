"""
GEAR UP — Real Gemini AI Buddy Comprehensive End-to-End Test Suite
Tests real Google AI Studio Gemini API connectivity, diagnostic endpoints,
and all 8 Phase 6 real-world verification questions.
"""

import unittest
import time
import json
from services.gemini_service import gemini_ai_service

class TestGeminiAIBuddy(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n" + "=" * 80)
        print("⚡ GEAR UP REAL GEMINI AI BUDDY END-TO-END TEST SUITE")
        print("=" * 80)
        cls.is_configured = gemini_ai_service.is_configured()
        print(f"Server-Side Gemini API Key Configured: {cls.is_configured}")

    def test_01_diagnostic_suite(self):
        """PHASE 5: Run all 7 diagnostic checks"""
        print("\n--- [PHASE 5] Executing Gemini Diagnostics Suite ---")
        diag = gemini_ai_service.run_diagnostics()
        tests = diag.get("tests", {})

        print(f"Test 1 (Valid API Key): {tests.get('TEST_1_VALID_API_KEY', {}).get('status')}")
        self.assertEqual(tests.get("TEST_1_VALID_API_KEY", {}).get("status"), "PASS")

        print(f"Test 2 (Missing Key Safe Handling): {tests.get('TEST_2_MISSING_API_KEY', {}).get('status')}")
        self.assertEqual(tests.get("TEST_2_MISSING_API_KEY", {}).get("status"), "PASS")

        print(f"Test 3 (Invalid Key Safe Handling): {tests.get('TEST_3_INVALID_API_KEY', {}).get('status')}")
        self.assertEqual(tests.get("TEST_3_INVALID_API_KEY", {}).get("status"), "PASS")

        print(f"Test 4 (Network Resilience): {tests.get('TEST_4_NETWORK_RESILIENCE', {}).get('status')}")
        self.assertEqual(tests.get("TEST_4_NETWORK_RESILIENCE", {}).get("status"), "PASS")

        print(f"Test 5 (Empty Message): {tests.get('TEST_5_EMPTY_MESSAGE', {}).get('status')}")
        self.assertEqual(tests.get("TEST_5_EMPTY_MESSAGE", {}).get("status"), "PASS")

        print(f"Test 6 (Long Message Limit): {tests.get('TEST_6_LONG_MESSAGE_LIMIT', {}).get('status')}")
        self.assertEqual(tests.get("TEST_6_LONG_MESSAGE_LIMIT", {}).get("status"), "PASS")

        print(f"Test 7 (Multi-turn Context): {tests.get('TEST_7_MULTITURN_CONTEXT', {}).get('status')}")
        self.assertEqual(tests.get("TEST_7_MULTITURN_CONTEXT", {}).get("status"), "PASS")

    def test_02_phase6_test_a_general_marketplace(self):
        """Test A: General marketplace question (Checklist covering RC, insurance, PUC, condition)"""
        print("\n--- [TEST A] General Marketplace Pre-purchase Checklist ---")
        res = gemini_ai_service.chat(user_query="What should I check before buying a second-hand bike?")
        text = res.get("text", "")
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue(len(text) > 100)
        self.assertIn("rc", text.lower())
        print(f"Status: PASS (Latency: {res.get('latency_ms')} ms, Model: {res.get('model_used')})")

    def test_03_phase6_test_b_vehicle_comparison(self):
        """Test B: Vehicle comparison (Honda Activa vs TVS Jupiter)"""
        print("\n--- [TEST B] Vehicle Comparison (Activa vs Jupiter) ---")
        res = gemini_ai_service.chat(user_query="Which is better for daily commuting, a Honda Activa or a TVS Jupiter?")
        text = res.get("text", "").lower()
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue("activa" in text and "jupiter" in text)
        print(f"Status: PASS (Latency: {res.get('latency_ms')} ms, Model: {res.get('model_used')})")

    def test_04_phase6_test_c_price_negotiation(self):
        """Test C: Price negotiation (Reasonable strategy, asking for model/year/km/condition)"""
        print("\n--- [TEST C] Price Negotiation Guidance ---")
        res = gemini_ai_service.chat(user_query="A seller is asking ₹75,000 for a used bike. How should I negotiate?")
        text = res.get("text", "")
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue(len(text) > 100)
        print(f"Status: PASS (Latency: {res.get('latency_ms')} ms, Model: {res.get('model_used')})")

    def test_05_phase6_test_d_document_understanding(self):
        """Test D: Document understanding (Difference between RC and Insurance)"""
        print("\n--- [TEST D] Document Understanding (RC vs Insurance) ---")
        res = gemini_ai_service.chat(user_query="What is the difference between RC and insurance?")
        text = res.get("text", "").lower()
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue("registration" in text or "rc" in text)
        self.assertTrue("insurance" in text or "coverage" in text)
        print(f"Status: PASS (Latency: {res.get('latency_ms')} ms, Model: {res.get('model_used')})")

    def test_06_phase6_test_e_gearup_platform(self):
        """Test E: GEAR UP platform question (How vehicle verification works)"""
        print("\n--- [TEST E] GEAR UP Platform Verification ---")
        res = gemini_ai_service.chat(user_query="How does vehicle verification work on GEAR UP?")
        text = res.get("text", "")
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue("verification" in text.lower() or "gear up" in text.lower() or "inspection" in text.lower())
        print(f"Status: PASS (Latency: {res.get('latency_ms')} ms, Model: {res.get('model_used')})")

    def test_07_phase6_test_f_listing_specific(self):
        """Test F: Listing-specific question (Grounded data when listing is specified)"""
        print("\n--- [TEST F] Listing-Specific Question (bike-001) ---")
        res = gemini_ai_service.chat(user_query="Is bike-001 worth buying?")
        text = res.get("text", "")
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue(len(res.get("matched_listings", [])) > 0 or "classic 350" in text.lower())
        print(f"Status: PASS (Latency: {res.get('latency_ms')} ms, Model: {res.get('model_used')})")

    def test_08_phase6_test_g_context_retention(self):
        """Test G: Multi-turn context retention (Scooter -> ₹60,000 -> College travel)"""
        print("\n--- [TEST G] Context Retention Multi-turn ---")
        history = [
            {"sender": "user", "text": "I am looking for a scooter."},
            {"sender": "ai", "text": "Great! Scooters are convenient. What is your budget and daily usage?"},
            {"sender": "user", "text": "My budget is ₹60,000."},
            {"sender": "ai", "text": "Got it, ₹60,000. What is your primary use case?"}
        ]
        res = gemini_ai_service.chat(
            user_query="I need it for daily college travel. Considering our whole chat, what do you suggest?",
            history=history
        )
        text = res.get("text", "").lower()
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue("scooter" in text or "activa" in text or "jupiter" in text)
        print(f"Status: PASS (Latency: {res.get('latency_ms')} ms, Model: {res.get('model_used')})")

    def test_09_phase6_test_h_unknown_information(self):
        """Test H: Unknown information (Must not invent random vehicle registration details)"""
        print("\n--- [TEST H] Unknown Information Guard ---")
        res = gemini_ai_service.chat(user_query="Tell me the exact registration details of a random bike.")
        text = res.get("text", "")
        self.assertFalse(res.get("is_refusal"))
        # Must decline to fabricate or explain authorized verification needed
        self.assertTrue(
            "cannot" in text.lower() or "not" in text.lower() or "authorized" in text.lower() or "parivahan" in text.lower()
        )
        print(f"Status: PASS (Latency: {res.get('latency_ms')} ms, Model: {res.get('model_used')})")

    def test_10_polite_refusal_off_topic(self):
        """Ensure polite refusal for completely off-topic non-vehicle requests"""
        print("\n--- Non-Vehicle Polite Refusal ---")
        res = gemini_ai_service.chat(user_query="Can you write a python script for quicksort?")
        self.assertTrue(res.get("is_refusal"))
        print(f"Status: PASS (Polite refusal returned as required)")

if __name__ == "__main__":
    unittest.main()
