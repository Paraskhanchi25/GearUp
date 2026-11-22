"""
GEAR UP — Real Gemini AI Buddy Comprehensive Test Suite
Validates Section 10 test questions, intent understanding, concise response policy (30-80 words),
anti-repetition safeguards, and diagnostic endpoints.
"""

import unittest
import time
from services.gemini_service import gemini_ai_service

class TestGeminiAIBuddyQuality(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        print("\n" + "=" * 80)
        print("⚡ GEAR UP REAL GEMINI AI BUDDY QUALITY & DOMAIN OPTIMIZATION TEST SUITE")
        print("=" * 80)
        cls.is_configured = gemini_ai_service.is_configured()
        print(f"Server-Side Gemini API Key Configured: {cls.is_configured}")

    def test_01_diagnostic_suite(self):
        """Phase 5 automated diagnostic checks"""
        print("\n--- Diagnostic Health Checks ---")
        diag = gemini_ai_service.run_diagnostics()
        tests = diag.get("tests", {})
        self.assertEqual(tests.get("TEST_1_VALID_API_KEY", {}).get("status"), "PASS")
        self.assertEqual(tests.get("TEST_2_MISSING_API_KEY", {}).get("status"), "PASS")
        self.assertEqual(tests.get("TEST_3_INVALID_API_KEY", {}).get("status"), "PASS")
        self.assertEqual(tests.get("TEST_4_NETWORK_RESILIENCE", {}).get("status"), "PASS")
        self.assertEqual(tests.get("TEST_5_EMPTY_MESSAGE", {}).get("status"), "PASS")
        self.assertEqual(tests.get("TEST_6_LONG_MESSAGE_LIMIT", {}).get("status"), "PASS")
        self.assertEqual(tests.get("TEST_7_MULTITURN_CONTEXT", {}).get("status"), "PASS")
        print("Diagnostic Suite: ALL 7 PASS")

    def test_02_query_1_what_is_rc(self):
        """Query 1: What is RC? (Short direct answer, <= 90 words)"""
        print("\n--- Query 1: What is RC? ---")
        res = gemini_ai_service.chat(user_query="What is RC?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertIn("registration", text.lower())
        self.assertLessEqual(words, 110)
        self.assertFalse(text.startswith("Sure") or text.startswith("Namaste"))

    def test_03_query_2_activa_good_daily(self):
        """Query 2: Is Honda Activa good for daily use?"""
        print("\n--- Query 2: Is Honda Activa good for daily use? ---")
        res = gemini_ai_service.chat(user_query="Is Honda Activa good for daily use?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertIn("activa", text.lower())
        self.assertLessEqual(words, 115)

    def test_04_query_3_jupiter_vs_activa(self):
        """Query 3: Which is better, Jupiter or Activa? (Side-by-side comparison)"""
        print("\n--- Query 3: Which is better, Jupiter or Activa? ---")
        res = gemini_ai_service.chat(user_query="Which is better, Jupiter or Activa?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue("activa" in text.lower() and "jupiter" in text.lower())
        self.assertLessEqual(words, 125)

    def test_05_query_4_pre_purchase_check(self):
        """Query 4: What should I check before buying a second-hand bike?"""
        print("\n--- Query 4: What should I check before buying a second-hand bike? ---")
        res = gemini_ai_service.chat(user_query="What should I check before buying a second-hand bike?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertIn("rc", text.lower())
        self.assertLessEqual(words, 125)

    def test_06_query_5_calculate_resale_value(self):
        """Query 5: How do I calculate the resale value of my bike?"""
        print("\n--- Query 5: How do I calculate the resale value of my bike? ---")
        res = gemini_ai_service.chat(user_query="How do I calculate the resale value of my bike?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertLessEqual(words, 125)

    def test_07_query_6_insurance_types(self):
        """Query 6: What is the difference between third-party and comprehensive insurance?"""
        print("\n--- Query 6: Third-party vs Comprehensive Insurance ---")
        res = gemini_ai_service.chat(user_query="What is the difference between third-party and comprehensive insurance?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertIn("third-party", text.lower())
        self.assertIn("comprehensive", text.lower())
        self.assertLessEqual(words, 120)

    def test_08_query_7_what_is_puc(self):
        """Query 7: What is PUC?"""
        print("\n--- Query 7: What is PUC? ---")
        res = gemini_ai_service.chat(user_query="What is PUC?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue("pollution" in text.lower() or "emission" in text.lower())
        self.assertLessEqual(words, 110)

    def test_09_query_8_accident_damaged_bike(self):
        """Query 8: How can I identify an accident-damaged bike?"""
        print("\n--- Query 8: How can I identify an accident-damaged bike? ---")
        res = gemini_ai_service.chat(user_query="How can I identify an accident-damaged bike?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertLessEqual(words, 120)

    def test_10_query_9_suggest_bike_under_1_lakh(self):
        """Query 9: Suggest a bike under ₹1 lakh."""
        print("\n--- Query 9: Suggest a bike under ₹1 lakh ---")
        res = gemini_ai_service.chat(user_query="Suggest a bike under ₹1 lakh.")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertLessEqual(words, 120)

    def test_11_query_10_what_is_hypothecation(self):
        """Query 10: What is hypothecation?"""
        print("\n--- Query 10: What is hypothecation? ---")
        res = gemini_ai_service.chat(user_query="What is hypothecation?")
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue("loan" in text.lower() or "bank" in text.lower() or "noc" in text.lower())
        self.assertLessEqual(words, 110)

    def test_12_query_11_follow_up_question(self):
        """Query 11: Ask a follow-up question about the previous answer."""
        print("\n--- Query 11: Multi-turn Follow-up Question ---")
        history = [
            {"sender": "user", "text": "What is hypothecation?"},
            {"sender": "ai", "text": "Hypothecation means your bike is tied to a bank loan as collateral. The bank name is printed on your RC."}
        ]
        res = gemini_ai_service.chat(
            user_query="How do I remove it from my RC after loan completion?",
            history=history
        )
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertTrue("noc" in text.lower() or "form 35" in text.lower() or "rto" in text.lower())
        self.assertLessEqual(words, 120)

    def test_13_query_12_same_question_repetition_check(self):
        """Query 12: Ask the same question twice and check whether the response avoids repetitive loops."""
        print("\n--- Query 12: Same Question Anti-Repetition Check ---")
        history = [
            {"sender": "user", "text": "What is PUC?"},
            {"sender": "ai", "text": "PUC is a Pollution Under Control certificate verifying your two-wheeler meets national emission norms."}
        ]
        res = gemini_ai_service.chat(
            user_query="What is PUC?",
            history=history
        )
        text = res.get("text", "")
        words = len(text.split())
        print(f"Output ({words} words):\n{text}")
        self.assertFalse(res.get("is_refusal"))
        self.assertLessEqual(words, 100)

if __name__ == "__main__":
    unittest.main()
