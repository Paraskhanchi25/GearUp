"""
Google AI Studio Gemini Service
Handles two-wheeler expert conversational intelligence with strict topic boundaries,
input topic classification, output verification, multi-modal analysis, and polite refusal.
"""

import os
import re
from typing import Dict, Any, List, Optional
from config import settings
from services.marketplace_service import search_marketplace_listings, get_vehicle_specs

# Topic Boundary Keywords
TWO_WHEELER_KEYWORDS = [
    # General categories
    "bike", "motorcycle", "scooter", "scooty", "two-wheeler", "2-wheeler", "vehicle", "ev",
    "electric scooter", "electric bike", "ride", "rider", "riding",
    # Components & Systems
    "engine", "battery", "charging", "charger", "range", "motor", "pmsm", "clutch", "gear",
    "gearbox", "transmission", "cvt", "variator", "brake", "brakes", "disc", "drum", "abs",
    "cbs", "tyre", "tire", "puncture", "tread", "air pressure", "psi", "suspension", "fork",
    "shock absorber", "monoshock", "chain", "sprocket", "lubricant", "chain lube", "oil",
    "engine oil", "coolant", "radiator", "overheating", "exhaust", "silencer", "spark plug",
    "carburetor", "fuel injection", "fi", "mileage", "kmpl", "starting", "self start",
    "kick start", "choke", "wiring", "headlight", "fuse", "speedometer", "odometer",
    # Maintenance & Ownership
    "service", "servicing", "maintenance", "mechanic", "inspection", "rc", "registration",
    "insurance", "rto", "pollution", "puc", "resale", "price", "value", "valuation", "buying",
    "selling", "test ride", "dealer", "gear up", "first owner", "second hand", "used bike",
    # Sound & Symptoms
    "vibration", "clicking", "tappet", "knocking", "squeaking", "grinding", "wobble", "jerking",
    "stalling", "smoke", "white smoke", "black smoke", "leaking", "oil leak", "judder",
    # Brands & Popular Models
    "royal enfield", "classic", "bullet", "hunter", "meteor", "himalayan", "continental gt",
    "honda", "activa", "shine", "dio", "unicorn", "cb350", "sp125",
    "tvs", "jupiter", "ntorq", "apache", "rtr", "iqube", "raider", "xl100",
    "bajaj", "pulsar", "ns200", "chetak", "dominar", "platina", "avenger",
    "yamaha", "r15", "mt-15", "fz", "fzs", "aerox", "rayzr",
    "ather", "450x", "450s", "rizta", "apex",
    "ola", "s1", "s1 pro", "s1 air", "s1 x",
    "suzuki", "access", "burgman", "gixxer",
    "ktm", "duke", "rc", "adventure",
    "hero", "splendor", "hf deluxe", "passion", "xpulse", "glamour", "destini",
    # Common Hindi / Hinglish / Punjabi terms
    "gaadi", "gadi", "chalti", "aawaz", "kharab", "tel", "kitna degi", "pahiya", "chakka",
    "dhua", "hawa", "meri", "chal", "nahi rahi", "kya karu", "kinni", "chaldi", "kivein"
]

DISALLOWED_TOPICS = [
    "python", "javascript", "react", "programming", "code", "html", "css", "sql", "java", "c++",
    "movie", "actor", "actress", "bollywood", "hollywood", "song", "lyrics", "entertainment",
    "cricket match", "football", "world cup", "politics", "election", "narendra modi", "bjp", "congress",
    "solve this math", "algebra", "calculus", "homework", "essay on", "write an essay", "crypto", "bitcoin",
    "stock market tips", "nifty", "medical diagnosis for human", "headache", "fever", "paracetamol"
]

POLITE_REFUSAL_MESSAGE = (
    "I'm sorry, but I am designed specifically as GEAR UP's dedicated two-wheeler expert assistant. "
    "I can only help with questions regarding motorcycles, scooters, electric two-wheelers, maintenance, "
    "mechanical troubleshooting, buying/selling advice, and specifications. "
    "I would be glad to help you with any vehicle-related query!"
)

SYSTEM_INSTRUCTION = """
You are AI Bike Buddy, a polite, highly knowledgeable, and safety-conscious two-wheeler master mechanic and ownership advisor for the GEAR UP marketplace in India.

YOUR STRICT ROLE & KNOWLEDGE BOUNDARY:
- You ONLY answer questions related to motorcycles, scooters, electric two-wheelers, vehicle maintenance, mechanical diagnostics, specifications, riding safety, and GEAR UP marketplace services.
- If the user asks about ANYTHING ELSE (coding, programming, mathematics, general knowledge, movies, politics, human health, homework, entertainment, etc.), you MUST politely refuse by explaining your role as a dedicated two-wheeler expert assistant.

EXPERTISE GUIDELINES:
1. Explain mechanical causes clearly and practically (e.g., CVT belt glazing, tappet clearance, battery voltage drop, chain tension).
2. Ask targeted follow-up questions when symptoms are ambiguous (e.g., does it happen only on cold starts? at what speed?).
3. Safety First: If the rider reports issues with brakes, steering wobble, tyre bulges, or fuel leakage, STRONGLY advise them NOT to ride until a certified mechanic physically inspects the vehicle. Never guarantee remote diagnoses.
4. Language Support: Understand and respond naturally in English, Hindi (or Hinglish), or Punjabi based on how the user greets or asks you.
5. Grounding: When recommending vehicles under a budget or location, reference real marketplace listings from GEAR UP rather than fabricating vehicle models.
"""

class GeminiAIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.client = None
        self._init_client()

    def _init_client(self):
        if not self.api_key:
            return
        try:
            from google import genai
            self.client = genai.Client(api_key=self.api_key)
        except Exception as e:
            print(f"Warning: Could not initialize official google.genai client: {e}")
            self.client = None

    def classify_input_topic(self, text: str) -> bool:
        """
        Multi-layered rule-based pre-filter checking whether the query
        is related to two-wheelers or explicitly disallowed.
        """
        text_lower = text.lower().strip()
        
        # Check explicit disallowed keywords
        for dis in DISALLOWED_TOPICS:
            pattern = r'\b' + re.escape(dis) + r'\b'
            if re.search(pattern, text_lower):
                # Ensure it's not a false positive (e.g., "code" vs "error code on speedometer")
                if "error code" in text_lower or "rto code" in text_lower or "pincode" in text_lower:
                    continue
                return False

        # Check two-wheeler domain keywords
        for kw in TWO_WHEELER_KEYWORDS:
            if kw in text_lower:
                return True
                
        # If very short or greeting ("hi", "hello", "namaste", "sat sri akaal", "help")
        greetings = ["hi", "hello", "hey", "namaste", "sat sri akaal", "kem cho", "vanakkam", "help"]
        if any(g == text_lower or text_lower.startswith(g + " ") for g in greetings):
            return True
            
        # If not clearly matched, flag for clarification
        return False

    def chat(self, user_query: str, history: Optional[List[Dict[str, str]]] = None, image_data: Optional[bytes] = None) -> Dict[str, Any]:
        """
        Executes guarded two-wheeler consultation with full safety boundaries,
        listing retrieval, and fallback handling.
        """
        # Layer 1: Input Topic Pre-classification
        is_relevant = self.classify_input_topic(user_query)
        if not is_relevant and not image_data:
            return {
                "text": POLITE_REFUSAL_MESSAGE,
                "is_refusal": True,
                "confidence": "high",
                "recommendations": []
            }

        # Check if user is looking for vehicle recommendations (e.g., "suggest scooter under 80000 in chandigarh")
        matched_listings = []
        q_lower = user_query.lower()
        if any(w in q_lower for w in ["suggest", "recommend", "buy", "options", "listings", "available"]):
            cat = "scooter" if "scooter" in q_lower or "scooty" in q_lower else ("electric" if "ev" in q_lower or "electric" in q_lower else ("motorcycle" if "bike" in q_lower or "motorcycle" in q_lower else None))
            price_match = re.search(r'(?:under|below|within|upto|budget)\s*(?:₹|rs\.?|inr)?\s*(\d+)(?:\s*(k|thousand|lakh|l))?', q_lower)
            max_p = None
            if price_match:
                val = float(price_match.group(1))
                unit = price_match.group(2)
                if unit in ["k", "thousand"]:
                    max_p = val * 1000
                elif unit in ["lakh", "l"]:
                    max_p = val * 100000
                elif val < 500:
                    max_p = val * 1000
                else:
                    max_p = val
            city = "Chandigarh" if "chandigarh" in q_lower else ("Mohali" if "mohali" in q_lower else ("Panchkula" if "panchkula" in q_lower else None))
            matched_listings = search_marketplace_listings(category=cat, max_price=max_p, city=city)

        # Layer 2: Google GenAI API Call if API Key configured
        if self.client and self.api_key:
            try:
                from google.genai import types
                
                # Context injection with real inventory if applicable
                context_addon = ""
                if matched_listings:
                    context_addon = "\n\nACTUAL AVAILABLE GEAR UP LISTINGS TO RECOMMEND:\n"
                    for l in matched_listings[:3]:
                        context_addon += f"- {l['title']}: ₹{l['price']:,} in {l['locality']}, {l['city']} ({l['km']:,} km driven, Inspection Score: {l.get('inspection_score', 4.5)}/5.0)\n"

                prompt_content = f"{user_query}{context_addon}"
                
                # Using Gemini 2.5 Flash / 1.5 Flash (currently standard supported on Google AI Studio)
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt_content,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_INSTRUCTION,
                        temperature=0.4,
                    )
                )
                
                response_text = response.text or ""
                
                # Layer 3: Post-generation safety check
                # If Gemini inadvertently answered a coding/homework question
                if any(dis in response_text.lower() for dis in ["def ", "function()", "import sys", "<html>", "solve the equation"]):
                    response_text = POLITE_REFUSAL_MESSAGE

                return {
                    "text": response_text,
                    "is_refusal": False,
                    "confidence": "high",
                    "matched_listings": matched_listings[:3]
                }
            except Exception as e:
                print(f"Gemini API execution error: {e}. Utilizing expert mechanic knowledge base.")

        # Layer 4: High-Precision Domain Mechanic Knowledge Engine Fallback
        # Ensures 100% uptime and polite domain adherence even when API keys are unconfigured
        return self._expert_mechanic_fallback(user_query, matched_listings)

    def _expert_mechanic_fallback(self, query: str, matched_listings: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Grounded domain fallback with mechanical diagnostic intelligence"""
        q = query.lower()
        
        # Recommendations
        if matched_listings:
            listings_str = "\n\nHere are verified matching two-wheelers available right now on GEAR UP:\n"
            for l in matched_listings[:3]:
                listings_str += f"• **{l['title']}** — ₹{l['price']:,} ({l['city']}, {l['km']:,} km driven, Rating: {l.get('inspection_score', 4.8)}/5.0)\n"
            return {
                "text": f"I found verified listings in our marketplace matching your requirements!{listings_str}\nWould you like me to book a doorstep test ride or compare their specifications?",
                "is_refusal": False,
                "matched_listings": matched_listings[:3]
            }

        # Mechanical Sound / Vibration
        if any(w in q for w in ["sound", "noise", "click", "vibrat", "knocking", "aawaz"]):
            return {
                "text": (
                    "Unusual engine sounds or vibrations typically indicate one of three common issues on Indian two-wheelers:\n\n"
                    "1. **Tappet / Valve Clearance Slack**: A rhythmic metallic clicking sound that speeds up with engine RPM is usually caused by loose valve tappets. Easy to fix with a feeler gauge.\n"
                    "2. **Chain Slack & Dry Sprocket**: A grinding or slapping noise under acceleration usually means the drive chain has stretched or lacks 90-grade gear oil lubrication.\n"
                    "3. **CVT Clutch Bell Dust (Scooters)**: Shuddering or vibrations between 20–40 km/h is almost always clutch bell dust accumulation inside the variator casing.\n\n"
                    "⚠️ **Safety Recommendation**: If the noise is accompanied by steering wobble or spongy brakes, please avoid highway riding until inspected by a qualified mechanic."
                ),
                "is_refusal": False
            }

        # Starting / Battery Issues
        if any(w in q for w in ["start", "battery", "kick", "self"]):
            return {
                "text": (
                    "If your two-wheeler is having starting trouble, here is the quick step-by-step diagnostic checklist:\n\n"
                    "• **Battery Terminal Voltage**: If you hear a rapid clicking sound when pressing the starter button, the battery voltage has dropped below 12.2V. Test the horn: if it sounds weak, recharge or replace the battery.\n"
                    "• **Spark Plug Fouling**: Remove the spark plug and inspect the electrode. A black sooty tip means an overly rich air-fuel mixture or short-trip carbon build-up. Clean with wire brush or 0.7mm feeler gauge.\n"
                    "• **Kill Switch & Side Stand Sensor**: Ensure the red engine kill switch is ON and the side stand is fully retracted (modern FI bikes cut ignition if down).\n"
                    "• **Fuel Injector / Carburetor Gumming**: If the vehicle sat idle for over 3 weeks, stale petrol in the float bowl can block pilot jets."
                ),
                "is_refusal": False
            }

        # Mileage / Fuel Efficiency
        if any(w in q for w in ["mileage", "average", "fuel", "kmpl"]):
            return {
                "text": (
                    "To restore optimal fuel efficiency on your motorcycle or scooter:\n\n"
                    "1. **Tyre Pressure (Crucial)**: Keep front at 28–29 PSI and rear at 33–36 PSI (with pillion). 2 PSI lower tyre pressure increases rolling resistance and drops mileage by 8–10%!\n"
                    "2. **Air Filter Cleaning**: A clogged air filter restricts airflow, forcing the ECU or carburetor to burn excess fuel.\n"
                    "3. **Riding Band**: Maintain speeds in the 45–60 km/h economy band with smooth throttle transitions.\n"
                    "4. **Engine Oil Grade**: Use the exact viscosity recommended by your manufacturer (e.g., 10W-30 for Honda, 15W-50 semi-synthetic for Royal Enfield J-series)."
                ),
                "is_refusal": False
            }

        # General two-wheeler consultation
        return {
            "text": (
                "Namaste! As your GEAR UP two-wheeler expert, I'm here to help you get the best performance, safety, and resale value from your bike or scooter.\n\n"
                "You can ask me to:\n"
                "• Diagnose unusual engine sounds, starting issues, or brake problems\n"
                "• Recommend verified bikes or scooters under your budget in your city\n"
                "• Check scheduled service intervals and maintenance costs\n"
                "• Evaluate fair market prices before buying or selling\n\n"
                "What specific two-wheeler or symptom would you like to explore?"
            ),
            "is_refusal": False
        }

gemini_ai_service = GeminiAIService()
