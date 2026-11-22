"""
Deterministic Safety Assessment Engine for Two-Wheeler Diagnostics.
Evaluates high-risk indicators (brake failures, steering instability, fuel leaks,
EV thermal anomalies, wheel locks) and enforces strict non-probabilistic safety overrides.
"""

import re
from typing import Tuple, Optional
from .schema import SeverityLevel, UrgencyLevel, SafetyAssessment

CRITICAL_PATTERNS = [
    {
        "hazard": "BRAKE_HYDRAULIC_FAILURE",
        "keywords": [
            r"\bbrake\s*fail", r"\bno\s*brake", r"\bzero\s*brake", r"\blever\s*(hits|touches)\s*handlebar",
            r"\bbrake\s*fluid\s*leak", r"\bmaster\s*cylinder\s*leak", r"\bcaliper\s*locked",
            r"\bpedal\s*goes\s*to\s*floor", r"\bfree\s*fall\s*brake", r"\bbrakes?\s*not\s*working\b"
        ],
        "warning": "CRITICAL BRAKE HAZARD: Loss of hydraulic braking pressure detected. Operating this two-wheeler poses an imminent collision risk.",
        "urgency": UrgencyLevel.URGENT_DO_NOT_RIDE,
        "severity": SeverityLevel.CRITICAL
    },
    {
        "hazard": "PETROL_LEAK_FIRE_RISK",
        "keywords": [
            r"\bpetrol\s*(leak|dripping|spilling|smell|odor|spray)", r"\bfuel\s*(leak|dripping|spill|odor)",
            r"\bcarburetor\s*overflow\b", r"\bfire\s*hazard", r"\bpetrol\s*pipe\s*broken",
            r"\bsmell\s*of\s*petrol\b"
        ],
        "warning": "CRITICAL FIRE HAZARD: Raw fuel leak detected near hot engine/exhaust headers. Do NOT start the engine or turn on electrical ignition.",
        "urgency": UrgencyLevel.URGENT_DO_NOT_RIDE,
        "severity": SeverityLevel.CRITICAL
    },
    {
        "hazard": "STEERING_WHEEL_DETACHMENT_COLLAPSE",
        "keywords": [
            r"\btank\s*slapper\b", r"\bdeath\s*wobble\b", r"\bhandle\s*shaking\s*violently",
            r"\bwheel\s*(loose|detaching|falling|jammed|locked)", r"\baxle\s*(nut|loose|broken)",
            r"\brim\s*cracked\b", r"\btyre\s*(burst|bulge|cut|blowout)", r"\bchassis\s*crack"
        ],
        "warning": "CRITICAL STRUCTURAL/STEERING HAZARD: Severe mechanical instability or wheel/chassis failure. Riding at any speed risks immediate loss of control.",
        "urgency": UrgencyLevel.URGENT_DO_NOT_RIDE,
        "severity": SeverityLevel.CRITICAL
    },
    {
        "hazard": "EV_BATTERY_THERMAL_RUNAWAY",
        "keywords": [
            r"\bbattery\s*(swollen|swelling|bulging|burning|smoke|smoking|fuming)",
            r"\bbms\s*thermal\b", r"\bbattery\s*overheat\b", r"\belectric\s*shock\b",
            r"\bspark\s*from\s*battery", r"\bbattery\s*acid\s*smell\b", r"\bbattery\s*fire\b"
        ],
        "warning": "CRITICAL EV HIGH-VOLTAGE/THERMAL RUNAWAY RISK: EV lithium battery anomaly or smoke detected. Park in an open outdoor space away from structures immediately.",
        "urgency": UrgencyLevel.URGENT_DO_NOT_RIDE,
        "severity": SeverityLevel.CRITICAL
    },
    {
        "hazard": "ENGINE_SEIZURE_CHAIN_SNAP",
        "keywords": [
            r"\bengine\s*(seized|seizure|jammed|locked)", r"\bchain\s*(snapped|broken|jammed\s*wheel)",
            r"\brear\s*wheel\s*skidded\s*and\s*locked", r"\bpiston\s*seized\b"
        ],
        "warning": "CRITICAL TRANSMISSION/POWERTRAIN LOCK: Wheel seizure hazard. Vehicle cannot be ridden safely without roadside recovery.",
        "urgency": UrgencyLevel.URGENT_DO_NOT_RIDE,
        "severity": SeverityLevel.CRITICAL
    }
]

HIGH_RISK_PATTERNS = [
    {
        "hazard": "MODERATE_BRAKE_OR_TIRE_ANOMALY",
        "keywords": [
            r"\bspongy\s*brake", r"\bdelayed\s*braking", r"\bsoft\s*lever",
            r"\bwobble\b", r"\bshaking\s*at\s*high\s*speed", r"\bfork\s*oil\s*leak\s*on\s*disc",
            r"\bbraking\s*distance\s*increased", r"\btyre\s*slipping", r"\babs\s*light\s*flashing"
        ],
        "warning": "HIGH RISK: Braking or traction compromise detected. Maximum speed should not exceed 25 km/h directly to nearest certified workshop.",
        "urgency": UrgencyLevel.CAUTION_VISIT_SOON,
        "severity": SeverityLevel.HIGH
    },
    {
        "hazard": "ENGINE_OIL_DEPRIVATION_OVERHEATING",
        "keywords": [
            r"\boil\s*pressure\s*light", r"\bzero\s*oil", r"\bno\s*engine\s*oil",
            r"\bengine\s*overheating\b", r"\bcoolant\s*boiling\b", r"\bwhite\s*smoke\s*dense",
            r"\bengine\s*shutting\s*off\s*hot"
        ],
        "warning": "HIGH RISK: Severe engine oil depletion or thermal emergency. Continuing to run the engine will cause catastrophic piston/cylinder bore seizure.",
        "urgency": UrgencyLevel.CAUTION_VISIT_SOON,
        "severity": SeverityLevel.HIGH
    }
]

MODERATE_RISK_PATTERNS = [
    {
        "hazard": "MECHANICAL_OR_ELECTRICAL_WEAR",
        "keywords": [
            r"\bvibrat", r"\bticking", r"\bclicking", r"\bknocking", r"\bchain\s*noise",
            r"\bsqueak", r"\bstarting\s*problem", r"\bmis\s*fire", r"\bpickup\s*drop",
            r"\bjerking", r"\bclutch\s*slip", r"\brange\s*drop"
        ],
        "warning": "MODERATE WEAR: Operational performance degradation detected. Diagnostic inspection recommended within next 100–300 km.",
        "urgency": UrgencyLevel.CAUTION_VISIT_SOON,
        "severity": SeverityLevel.MODERATE
    }
]

def evaluate_safety(symptom_text: str, fuel_type: str = "petrol") -> SafetyAssessment:
    """
    Performs deterministic regex matching on customer complaint text.
    Critical safety conditions override any downstream machine learning scores.
    """
    text = symptom_text.lower()
    
    # Check Critical Hazards
    for pattern in CRITICAL_PATTERNS:
        for kw in pattern["keywords"]:
            if re.search(kw, text):
                return SafetyAssessment(
                    severity=pattern["severity"],
                    urgency=pattern["urgency"],
                    is_safe_to_ride=False,
                    risk_summary=f"CRITICAL SAFETY ALERT ({pattern['hazard']}): Immediate mechanical risk identified.",
                    critical_warning=pattern["warning"]
                )
                
    # Check High Hazards
    for pattern in HIGH_RISK_PATTERNS:
        for kw in pattern["keywords"]:
            if re.search(kw, text):
                return SafetyAssessment(
                    severity=pattern["severity"],
                    urgency=pattern["urgency"],
                    is_safe_to_ride=False,
                    risk_summary=f"HIGH RISK ADVISORY ({pattern['hazard']}): Safety-compromised operation.",
                    critical_warning=pattern["warning"]
                )

    # Check Moderate Hazards
    for pattern in MODERATE_RISK_PATTERNS:
        for kw in pattern["keywords"]:
            if re.search(kw, text):
                return SafetyAssessment(
                    severity=pattern["severity"],
                    urgency=pattern["urgency"],
                    is_safe_to_ride=True,
                    risk_summary=f"Operational warning ({pattern['hazard']}): Safe for short low-speed transit, but requires prompt service.",
                    critical_warning=pattern["warning"]
                )

    # Default Routine Assessment
    return SafetyAssessment(
        severity=SeverityLevel.LOW,
        urgency=UrgencyLevel.ROUTINE_SERVICE,
        is_safe_to_ride=True,
        risk_summary="Standard vehicle maintenance diagnostic. No immediate life-safety hazards flagged.",
        critical_warning=None
    )
