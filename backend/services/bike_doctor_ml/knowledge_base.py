"""
Technical Knowledge Base & Diagnostic Retrieval Repository.
Contains verified workshop procedures, DIY inspection protocols,
mechanic checks, and model-specific nuances across Indian two-wheelers.
"""

from typing import Dict, Any, List, Optional
from .schema import DiagnosticCheck, CostEstimate

DIAGNOSTIC_KNOWLEDGE: Dict[str, Dict[str, Any]] = {
    "engine_starting_failure": {
        "system": "Electrical & Ignition / Fuel System",
        "primary_causes": [
            {
                "component": "Starter Relay / Solenoid or Carbon Brush Wear",
                "explanation": "Weak starter motor brushes or corroded starter relay contacts produce a distinct clicking sound without turning the engine crankshaft over.",
                "parts": ["Starter Relay (₹450–₹750)", "Starter Carbon Brush Kit (₹220–₹400)"],
                "cost": {"min": 500, "max": 1800, "labor": 350, "notes": "Relay replacement or motor armature servicing"}
            },
            {
                "component": "Depleted Lead-Acid / VRLA Battery (Under-voltage)",
                "explanation": "Terminal voltage dropped below 12.2V under load, insufficient to power the starter motor or EFI electronic fuel pump simultaneously.",
                "parts": ["12V 4Ah/5Ah VRLA Battery (₹1,200–₹1,850)", "Terminal connectors (₹60)"],
                "cost": {"min": 1200, "max": 2200, "labor": 150, "notes": "New battery with old battery exchange discount"}
            },
            {
                "component": "Fouled Spark Plug or Corroded High-Tension (HT) Cap",
                "explanation": "Heavy carbon bridging or oil deposits across the spark plug electrode gap preventing strong ignition arc under combustion chamber compression.",
                "parts": ["NGK / Champion Spark Plug (₹120–₹350)", "Resistor HT Cap (₹90–₹160)"],
                "cost": {"min": 200, "max": 600, "labor": 150, "notes": "Plug cleaning, gapping or replacement"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Horn & Headlamp Load Test",
                steps=[
                    "Turn ignition key ON and press the horn button.",
                    "If the horn sounds feeble or headlamp dims heavily when pressing the starter button, the 12V battery is discharged below operating threshold.",
                    "Do not hold starter button for more than 5 consecutive seconds to avoid burning motor windings."
                ],
                safety_precaution="Ensure bike is strictly in neutral with side-stand retracted before attempting start.",
                tools_required=["None"]
            ),
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Kill Switch & Side-Stand Safety Interlock Check",
                steps=[
                    "Toggle the red engine kill switch back and forth 3 times to clean tarnished copper internal contacts.",
                    "Ensure side stand is fully retracted; modern BS6 vehicles cut ignition spark via the magnetic side-stand safety switch."
                ],
                safety_precaution="Keep ignition key turned off while inspecting side-stand sensor wiring.",
                tools_required=["None"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Multi-meter Cranking Voltage Drop & Stator AC Output Test",
                steps=[
                    "Measure battery open-circuit voltage (should be >= 12.6V).",
                    "Crank engine and observe voltage dip; voltage dropping below 9.6V confirms internal cell degradation.",
                    "Measure AC voltage across 3 yellow stator coil wires (should exceed 35V AC at 3000 RPM)."
                ],
                safety_precaution="Wear insulated rubber gloves when probing live high-tension circuits.",
                tools_required=["Digital Multimeter", "OBD-II Diagnostic Scanner"]
            )
        ],
        "clarifying_questions": [
            "Does the starter motor turn the engine vigorously, crank weakly with a click, or make no sound at all?",
            "Did the bike start easily when kick-started (if kick lever is present)?",
            "Was the vehicle parked outside during heavy rain or washed recently?"
        ]
    },

    "engine_stalling_idling": {
        "system": "Fuel Induction & Intake Air Management",
        "primary_causes": [
            {
                "component": "Clogged Carburetor Pilot Jet / Dirty EFI Throttle Body",
                "explanation": "Fuel varnish or carbon film restricting the idle air-fuel passage, starving the engine at closed throttle and causing sudden stalling at traffic stops.",
                "parts": ["Throttle Body Cleaner Spray (₹350)", "Carburetor O-Ring Gasket Kit (₹150–₹280)"],
                "cost": {"min": 400, "max": 1200, "labor": 400, "notes": "Ultrasonic carb cleaning or throttle body decarbonization"}
            },
            {
                "component": "Tight Exhaust Valve Tappet Clearance",
                "explanation": "Zero valve lash as engine heats up causes exhaust valve to remain micro-open under thermal expansion, dropping cylinder compression and killing idle.",
                "parts": ["Valve Cover Gasket (₹120–₹250)"],
                "cost": {"min": 350, "max": 800, "labor": 350, "notes": "Valve lash adjustment with precision feeler gauge"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Air Filter Inspection",
                steps=[
                    "Remove side panel and inspect air filter paper element for dust clogging, moisture or engine oil blow-by.",
                    "Tap filter lightly on cardboard to dislodge loose sand; never wash paper elements in water."
                ],
                safety_precaution="Do not start engine with air filter removed to prevent grit entering cylinder.",
                tools_required=["Phillips screwdriver", "Clean rag"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Intake Manifold Vacuum Leak & Compression Test",
                steps=[
                    "Spray carb cleaner around rubber manifold flange; RPM increase confirms air leak past manifold O-ring.",
                    "Perform dry and wet cylinder compression test (healthy single cylinder should read 140–180 PSI)."
                ],
                safety_precaution="Hot cylinder head hazard.",
                tools_required=["Compression Gauge", "OBD-II Live Data Reader"]
            )
        ],
        "clarifying_questions": [
            "Does the bike stall only when cold or after riding for 15-20 minutes?",
            "Does holding slight throttle prevent the engine from dying?"
        ]
    },

    "acceleration_hesitation": {
        "system": "Fuel Delivery & Secondary Ignition",
        "primary_causes": [
            {
                "component": "In-Tank EFI Fuel Pump Pressure Drop / Clogged Strainer",
                "explanation": "Fuel pump delivering under 2.5 bar pressure under throttle demand, resulting in fuel starvation and lean stumbling on roll-on acceleration.",
                "parts": ["Fuel Pump Motor & Filter Strainer (₹1,800–₹3,800)"],
                "cost": {"min": 1200, "max": 4500, "labor": 600, "notes": "Fuel tank draining, strainer replacement, pump test"}
            },
            {
                "component": "Choked Fuel Injector Nozzle / Contaminated Petrol",
                "explanation": "Microscopic particulates in contaminated fuel disrupting fine spray atomization pattern into coarse fuel droplets.",
                "parts": ["Fuel Injector Cleaner (₹400)", "Fuel Filter (₹250)"],
                "cost": {"min": 600, "max": 1800, "labor": 400, "notes": "Injector bench cleaning and flow pattern testing"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Fuel Prime Whirring Noise Check",
                steps=[
                    "In a quiet space, switch on ignition and listen for the 2-second electric fuel pump hum from underneath the tank.",
                    "A whining, groaning, or absent sound indicates fuel pump cavitation or electrical supply issues."
                ],
                safety_precaution="Ensure no open flames nearby.",
                tools_required=["None"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Fuel Line Pressure Gauge Test",
                steps=[
                    "Connect fuel pressure gauge tee-joint between fuel rail and delivery hose.",
                    "Key ON pressure should hold 2.8 to 3.2 bar without bleeding down."
                ],
                safety_precaution="Wrap rag around fuel line coupling to catch pressurized petrol spray.",
                tools_required=["Fuel Injection Pressure Gauge Kit"]
            )
        ],
        "clarifying_questions": [
            "Does the hesitation happen right after filling fuel from a new petrol pump?",
            "Does the bike jerk violently or gently lag when you twist the throttle beyond half-way?"
        ]
    },

    "engine_overheating": {
        "system": "Cooling System & Lubrication",
        "primary_causes": [
            {
                "component": "Engine Oil Depletion or Viscosity Breakdown",
                "explanation": "Insufficient crankcase oil level depriving piston skirt and cylinder liner of boundary lubrication film, converting friction directly into excessive radiant engine heat.",
                "parts": ["4T Synthetic Engine Oil 10W-40 / 15W-50 (₹450–₹1,100)", "Oil Filter (₹120–₹250)"],
                "cost": {"min": 650, "max": 1600, "labor": 200, "notes": "Complete engine flush, oil drain, and filter change"}
            },
            {
                "component": "Radiator Fan Motor Relay / Thermostat Valve Stuck Closed",
                "explanation": "In liquid-cooled engines, cooling fan failure or thermostat failing to open at 88°C causes coolant boiling and cylinder head thermal warping.",
                "parts": ["Thermostat Valve (₹450–₹950)", "Radiator Fan Motor (₹1,400–₹2,800)", "Coolant Premix 1L (₹280)"],
                "cost": {"min": 1000, "max": 3800, "labor": 500, "notes": "Coolant drain, system burping, and fan switch replacement"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Engine Oil Dipstick & Sight Glass Check",
                steps=[
                    "Park motorcycle upright on level ground on center stand for 10 minutes with engine stopped.",
                    "Unscrew dipstick, wipe with clean rag, insert without screwing in, and verify oil level is between Min and Max notches."
                ],
                safety_precaution="Caution: Hot engine case and exhaust pipe can cause severe skin burns.",
                tools_required=["Clean rag / tissue"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Cooling System Pressure Leakdown & Thermoswitch Test",
                steps=[
                    "Pressurize radiator with cooling tester to 1.1 bar to verify no internal head gasket breach.",
                    "Submerge thermoswitch in heated water to verify continuity at rated trigger temperature."
                ],
                safety_precaution="Never open radiator cap when engine is at operating temperature.",
                tools_required=["Radiator Pressure Tester", "Infrared Thermometer"]
            )
        ],
        "clarifying_questions": [
            "Is the high-temperature warning light blinking on your console?",
            "Do you smell sweet burning coolant or burning engine oil when you stop?"
        ]
    },

    "valvetrain_tappet_noise": {
        "system": "Cylinder Head & Valvetrain",
        "primary_causes": [
            {
                "component": "Excessive Valve Tappet / Rocker Arm Lash",
                "explanation": "Clearance between rocker arm adjuster screw and valve stem tip widened beyond specification (e.g. >0.15mm), hammering the valve stem top at half-engine speed.",
                "parts": ["Cylinder Head Tappet Cover O-rings (₹80–₹180)"],
                "cost": {"min": 350, "max": 750, "labor": 350, "notes": "Cold engine tappet adjustment to manufacturer clearance"}
            },
            {
                "component": "Worn Automatic Cam Chain Tensioner (CCT)",
                "explanation": "Internal ratchet teeth or spring tensioner lost tension, allowing timing chain slack to slap against the plastic guide blades inside the cylinder block.",
                "parts": ["Automatic Cam Chain Tensioner Assembly (₹650–₹1,400)"],
                "cost": {"min": 850, "max": 2000, "labor": 400, "notes": "CCT replacement and cam chain timing alignment check"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Acoustic Stethoscope Screwdriver Test",
                steps=[
                    "Place the tip of a long screwdriver securely against the cylinder head tappet inspection cap and hold the plastic handle to your ear.",
                    "If a rapid metallic ticking doubles proportionally with throttle blips, the valve lash is out of tolerance."
                ],
                safety_precaution="Keep loose clothing and hair completely clear of moving drive components.",
                tools_required=["Long flathead screwdriver"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Feeler Gauge Valve Clearance Calibration",
                steps=[
                    "Rotate crankshaft to Top Dead Center (TDC) on compression stroke aligning flywheel 'T' mark.",
                    "Insert feeler gauge blade between valve tip and rocker arm; set strictly to OEM factory spec (e.g., 0.08mm intake, 0.12mm exhaust)."
                ],
                safety_precaution="Engine must be completely cold (under 35°C) for accurate lash measurement.",
                tools_required=["Angled Feeler Gauge Blades", "Tappet Adjuster Wrench"]
            )
        ],
        "clarifying_questions": [
            "Is the ticking metallic sound louder when the engine is dead cold or after warming up?",
            "Has the bike covered more than 15,000 km since its last valve clearance service?"
        ]
    },

    "clutch_slippage": {
        "system": "Clutch & Primary Drive",
        "primary_causes": [
            {
                "component": "Glazed / Worn Clutch Friction Plates & Weak Springs",
                "explanation": "Friction lining worn below minimum service thickness, failing to lock flywheel torque to transmission main-shaft under high throttle loads.",
                "parts": ["Clutch Friction Plate Set (₹650–₹1,600)", "Clutch Steel Plates (₹350–₹600)", "Clutch Springs (₹180)"],
                "cost": {"min": 1400, "max": 3200, "labor": 600, "notes": "Complete clutch pack replacement, oil change, and cable adjustment"}
            },
            {
                "component": "Clutch Cable Zero Free-play (Overtight)",
                "explanation": "Clutch cable adjusted with no lever free-play keeps the clutch release arm permanently pre-loaded, causing continuous micro-slippage.",
                "parts": ["Clutch Cable (₹150–₹320)"],
                "cost": {"min": 150, "max": 450, "labor": 100, "notes": "Cable barrel adjuster adjustment"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Clutch Lever Free-play Check",
                steps=[
                    "Gently pull clutch lever before feeling resistance; it must move 2–3mm freely at the perch bracket gap before actuating the clutch arm.",
                    "If there is zero free play, back out the knurled barrel adjuster clockwise."
                ],
                safety_precaution="Ensure cable ends are seated properly in lever perch.",
                tools_required=["None"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Clutch Basket Notching & Plate Warpage Inspection",
                steps=[
                    "Drain oil and remove right crankcase clutch cover.",
                    "Inspect clutch housing fingers for notched indentations that catch friction plate tabs.",
                    "Check steel drive plates for thermal blue discoloration and surface warpage on surface plate."
                ],
                safety_precaution="Always replace right crankcase clutch cover paper gasket to prevent oil leaks.",
                tools_required=["Clutch Holding Tool", "Vernier Caliper", "Dial Indicator"]
            )
        ],
        "clarifying_questions": [
            "When you twist the throttle in high gear, does engine RPM climb rapidly without speed increasing?",
            "Is the clutch lever very stiff or does the bike creep forward in gear with clutch pulled?"
        ]
    },

    "cvt_judder_scooter": {
        "system": "Continuously Variable Transmission (CVT)",
        "primary_causes": [
            {
                "component": "Glazed Centrifugal Clutch Shoes & Carbon Contamination",
                "explanation": "Dry centrifugal clutch shoes in scooters glaze over with brake/clutch dust inside the clutch bell drum, causing slippage and violent juddering when pulling away from 0 km/h.",
                "parts": ["Clutch Shoe Weight Assembly (₹550–₹1,100)", "Clutch Bell Sanding (₹150)"],
                "cost": {"min": 450, "max": 1600, "labor": 350, "notes": "CVT case cleaning, clutch shoe deglazing with emery sheet"}
            },
            {
                "component": "Flat-Spotted Variator Rollers & Dry Drive Belt",
                "explanation": "Variator roller weights worn flat causing uneven ramp progression and jerky acceleration up to 40 km/h.",
                "parts": ["Variator Roller Weight Set (₹250–₹450)", "Bando/Gates CVT Drive Belt (₹450–₹850)"],
                "cost": {"min": 850, "max": 1800, "labor": 350, "notes": "Variator guide slider replacement, belt inspection"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Standstill Judder Test",
                steps=[
                    "Put scooter on main stand.",
                    "Sit on the scooter, apply both brakes lightly, and give very gentle throttle.",
                    "If the rear footboard vibrates violently through your feet at initial clutch engagement (1000–2500 RPM), the clutch bell is glazed."
                ],
                safety_precaution="Hold brakes firmly to prevent vehicle jumping forward.",
                tools_required=["None"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="CVT Pulley Disassembly & Belt Width Measurement",
                steps=[
                    "Remove left kick-starter crankcase cover using pneumatic impact wrench.",
                    "Measure drive belt width with vernier caliper (discard if worn more than 1.5mm from nominal).",
                    "Deglaze clutch bell inner contact drum using 120-grit emery paper."
                ],
                safety_precaution="Wear face dust mask to avoid inhaling hazardous clutch friction dust.",
                tools_required=["Impact Wrench", "Variator Locking Tool", "Vernier Caliper"]
            )
        ],
        "clarifying_questions": [
            "Does the shudder or vibration happen strictly when moving from dead stop (0–20 km/h)?",
            "Has the scooter CVT cover been cleaned in the last 6,000 km?"
        ]
    },

    "brake_spongy_delayed": {
        "system": "Hydraulic Disc Braking System",
        "primary_causes": [
            {
                "component": "Moisture-Saturated DOT 4 Fluid / Entrapped Air Bubbles",
                "explanation": "Brake fluid is hygroscopic and absorbs ambient humidity over 2 years, lowering boiling point to ~140°C and vaporizing into compressible steam bubbles, creating a spongy lever.",
                "parts": ["DOT 4 Synthetic Brake Fluid 250ml (₹160–₹280)"],
                "cost": {"min": 350, "max": 750, "labor": 300, "notes": "Complete hydraulic line purge and two-man caliper bleeding"}
            },
            {
                "component": "Master Cylinder Primary Cup Piston Leak / Worn Caliper Seal",
                "explanation": "Internal rubber seals worn allowing pressurized fluid to bypass back into the reservoir instead of clamping the caliper pistons.",
                "parts": ["Master Cylinder Rebuild Piston Kit (₹380–₹750)", "Caliper Square O-rings (₹220)"],
                "cost": {"min": 800, "max": 1800, "labor": 450, "notes": "Cylinder hone and piston rebuild"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Master Cylinder Sight Glass Inspection",
                steps=[
                    "Turn handlebars so the master cylinder reservoir is completely level.",
                    "Inspect the circular glass sight window: fluid level must be above the lower mark, and color should be light amber/clear, not dark coffee brown."
                ],
                safety_precaution="Never open brake fluid reservoir cap in dusty environments; brake fluid strips vehicle paint instantly.",
                tools_required=["None"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Hydraulic Reverse Vacuum Bleeding & Moisture Test",
                steps=[
                    "Use electronic brake fluid pen tester to measure water content (>3% requires complete flush).",
                    "Connect pneumatic vacuum bleeder to caliper bleed nipple and draw fresh DOT 4 fluid until zero micro-bubbles emerge."
                ],
                safety_precaution="Immediately wash any brake fluid spills with copious water.",
                tools_required=["Pneumatic Brake Bleeder", "Brake Fluid Tester Pen"]
            )
        ],
        "clarifying_questions": [
            "Does pumping the brake lever 3 times quickly make it firm again?",
            "Can you pull the lever all the way back until it touches your fingers on the throttle grip?"
        ]
    },

    "brake_squeal_pulsation": {
        "system": "Friction Braking & Rotor Assembly",
        "primary_causes": [
            {
                "component": "Glazed Brake Pads or Worn Past Wear Limit Grooves",
                "explanation": "Friction material calcified from overheating or worn down to the metal backing plate, grinding against steel disc rotor.",
                "parts": ["Front/Rear Sintered / Organic Brake Pads (₹350–₹1,400)"],
                "cost": {"min": 500, "max": 1800, "labor": 200, "notes": "Pad replacement, caliper pin greasing with silicone grease"}
            },
            {
                "component": "Warped Front Brake Disc Rotor (Lateral Runout > 0.15mm)",
                "explanation": "Uneven thermal shock (e.g. cold water splashed on red-hot discs) warping the rotor, causing pulsating feedback through the brake lever.",
                "parts": ["Replacement Disc Rotor (₹1,200–₹2,800)"],
                "cost": {"min": 1500, "max": 3500, "labor": 350, "notes": "Rotor replacement and hub mounting bolt torque check"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Visual Pad Thickness Flashlight Check",
                steps=[
                    "Shine phone flashlight into the caliper slot around the disc rotor.",
                    "Look for the central wear-indicator groove on the pad material; if groove is invisible or material is under 2mm, pads are finished."
                ],
                safety_precaution="Never touch disc rotor immediately after riding.",
                tools_required=["Flashlight"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Dial Indicator Disc Rotor Lateral Runout Check",
                steps=[
                    "Mount magnetic base dial gauge to front fork stanchion with probe perpendicular to rotor outer edge.",
                    "Rotate wheel slowly: total indicated runout (TIR) must be under 0.10mm. Exceeding 0.15mm requires disc rotor replacement."
                ],
                safety_precaution="Ensure caliper mounting bolts are re-torqued with medium strength thread-locker.",
                tools_required=["Dial Indicator with Magnetic Base", "Torque Wrench"]
            )
        ],
        "clarifying_questions": [
            "Does the brake lever pulse or push back rhythmically against your fingers when stopping from 60 km/h?",
            "Is there a harsh metal-on-metal grinding sound?"
        ]
    },

    "steering_wobble_cone_set": {
        "system": "Steering Head & Front Suspension",
        "primary_causes": [
            {
                "component": "Pitted Steering Stem Bearings (Cone Set Dent)",
                "explanation": "Ball bearings pounded indentations into steering race cups after severe pothole impacts, creating a 'notched' dead-center feel and high-speed wobble.",
                "parts": ["Steering Head Ball/Taper Roller Bearing Set (₹380–₹950)", "Bearing Grease (₹120)"],
                "cost": {"min": 850, "max": 1800, "labor": 550, "notes": "Fork removal, bearing race extraction and re-pressing"}
            },
            {
                "component": "Unbalanced Front Wheel / Dented Alloy Rim",
                "explanation": "Rim bend or heavy spot on front tyre rotating without counter-balancing weights creates rhythmic steering wobble between 50–70 km/h.",
                "parts": ["Adhesive Lead Wheel Balance Weights (₹150)", "Rim Straightening Service (₹400–₹800)"],
                "cost": {"min": 350, "max": 1200, "labor": 250, "notes": "Laser wheel balancing and rim runout truing"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Center-Stand Steering Notch Test",
                steps=[
                    "Place bike on center stand with a weight on rear seat so front wheel floats freely in the air.",
                    "Lightly sweep handlebars from full left lock to right lock with fingertip touch.",
                    "If handlebars 'catch' or settle into an indexed notch in the dead-ahead position, the steering cone set is dented and needs replacement."
                ],
                safety_precaution="Do not ride hands-free to test wobble on public roads.",
                tools_required=["None"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Fork Stanchion Truing & Triple Tree Torque Check",
                steps=[
                    "Slide forks into V-blocks to verify straightness using dial gauge.",
                    "Re-torque steering head castle nut using spanner socket to specified preload (typically 35–45 Nm)."
                ],
                safety_precaution="Incorrect steering nut torque can lock steering completely.",
                tools_required=["Castellated Nut Spanner", "Dial Gauge V-blocks"]
            )
        ],
        "clarifying_questions": [
            "Does the handlebar wobble worsen when you decelerate through 60 to 40 km/h with a relaxed grip?",
            "Did the wobble appear after hitting a sharp speed bump or pothole?"
        ]
    },

    "drive_chain_sprocket_wear": {
        "system": "Final Secondary Drive",
        "primary_causes": [
            {
                "component": "Unevenly Stretched Chain & Hooked Sprocket Teeth",
                "explanation": "O-ring dry links and unequal pin pitch causing tight and loose spots as the wheel turns, accompanied by slapping noises against swingarm guide.",
                "parts": ["Roller Chain & Front/Rear Sprocket Kit (₹1,400–₹3,400)"],
                "cost": {"min": 1700, "max": 4200, "labor": 400, "notes": "Complete drive chain & sprocket kit replacement with chain riveter"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Chain Slack & Pull-Off Check",
                steps=[
                    "Check vertical slack at midway of lower chain run: correct play is 20–30mm.",
                    "Grasp chain link at 3 o'clock position on the rear sprocket and pull outward; if link pulls away exposing half a sprocket tooth, chain is completely worn."
                ],
                safety_precaution="Never lubricate or inspect chain while engine is running in gear on the stand.",
                tools_required=["Ruler / Measuring tape"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Laser Chain Alignment & Axle Torque",
                steps=[
                    "Mount laser chain alignment tool on rear sprocket to verify parallel run to countershaft.",
                    "Torque rear axle nut to 85–100 Nm."
                ],
                safety_precaution="Always insert split safety pin in castellated rear axle nuts.",
                tools_required=["Laser Chain Guide Tool", "Heavy Duty Torque Wrench"]
            )
        ],
        "clarifying_questions": [
            "When was the chain last cleaned and lubricated with dedicated chain spray?",
            "Do you hear a loud 'clack-clack' when accelerating in 1st or 2nd gear?"
        ]
    },

    "front_fork_suspension_leak": {
        "system": "Front Suspension & Damping",
        "primary_causes": [
            {
                "component": "Blown Fork Oil Seals / Pitted Chrome Inner Tube",
                "explanation": "Road dirt tore the dual-lip rubber oil seal or pitted rust dots on chrome stanchion allowing fork oil to leak down onto the brake caliper and tyre.",
                "parts": ["Fork Oil Seals (Pair) (₹220–₹550)", "Fork Oil 10W / 15W 350ml (₹250–₹450)", "Fork Dust Caps (₹150)"],
                "cost": {"min": 950, "max": 2400, "labor": 600, "notes": "Fork leg disassembly, flushing, new oil seals, and fresh damping fluid"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="Chrome Stanchion Oil Ring Test",
                steps=[
                    "Wipe the shiny silver/gold fork tube with a clean cloth.",
                    "Hold front brake and vigorously pump front suspension up and down 4 times.",
                    "Inspect chrome tube for wet rings of dark hydraulic oil."
                ],
                safety_precaution="If oil drips near brake disc, DO NOT ride; oil contamination destroys brake pad friction immediately.",
                tools_required=["Clean dry cloth"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="Fork Disassembly, Stanchion Polishing & Oil Height Setting",
                steps=[
                    "Disassemble fork damper rod and clean internals in solvent.",
                    "Polish micro-burrs on chrome using 2000-grit wet sandpaper.",
                    "Measure fork oil level from top of collapsed stanchion without spring to exact mm spec."
                ],
                safety_precaution="Use dedicated seal driver to prevent damaging new seal lip during installation.",
                tools_required=["Fork Seal Driver Tool", "Fork Oil Level Gauge"]
            )
        ],
        "clarifying_questions": [
            "Is the oil leaking onto the left fork leg near the disc brake caliper?",
            "Does the front end bottom out with a metallic thud on normal speed breakers?"
        ]
    },

    "ev_battery_bms_thermal": {
        "system": "High Voltage Traction Battery & BMS (Electric Two-Wheeler)",
        "primary_causes": [
            {
                "component": "BMS Cell Voltage Imbalance / Thermal Throttling",
                "explanation": "Lithium cell delta exceeded 80mV cutoff threshold or thermistor reached 55°C limit, triggering BMS limp-mode to prevent cell degradation.",
                "parts": ["BMS Diagnostics / Cell Balancing Service", "High-Voltage Harness Inspection"],
                "cost": {"min": 800, "max": 3500, "labor": 800, "notes": "Authorized service center computerized cell level calibration"}
            },
            {
                "component": "BLDC / PMSM Motor Controller Hall Sensor Signal Glitch",
                "explanation": "Motor controller losing rotor position feedback from internal hall sensors, resulting in hesitation, vibration at 15 km/h, and 'Motor Error' warnings.",
                "parts": ["Motor Phase Harness (₹850)", "Controller Reprogramming (₹600)"],
                "cost": {"min": 1200, "max": 4500, "labor": 900, "notes": "Controller diagnostic test and harness connector pin cleaning"}
            }
        ],
        "safe_diy_checks": [
            DiagnosticCheck(
                check_type="DIY_SAFE",
                title="EV Charger & Thermal Cool-down Check",
                steps=[
                    "Allow vehicle to rest in shaded, well-ventilated space for 45 minutes before plugging into 15A charging socket.",
                    "Inspect charging connector pins for carbon soot, melting plastic or foreign debris.",
                    "Check mobile app dashboard for battery health percentage (SOH) and error code logs."
                ],
                safety_precaution="Never attempt to open, pierce, or submerge lithium battery packs.",
                tools_required=["None"]
            )
        ],
        "mechanic_checks": [
            DiagnosticCheck(
                check_type="PROFESSIONAL_MECHANIC",
                title="CAN Bus Diagnostic Scan & Cell Delta Analysis",
                steps=[
                    "Connect OEM proprietary diagnostic tablet to vehicle CAN bus port.",
                    "Read Individual Cell Series Voltages (P1 to P14); cell delta must be within 15mV.",
                    "Check insulation resistance between high-voltage bus and chassis ground (>100 Megaohms)."
                ],
                safety_precaution="Mandatory 1000V rated Class 0 insulated gloves required for high voltage systems.",
                tools_required=["OEM CAN-Bus Diagnostic Terminal", "Megaohmmeter"]
            )
        ],
        "clarifying_questions": [
            "Did the vehicle suddenly drop power after riding up a steep incline or fast highway riding?",
            "What is the indicated battery state of charge (SOC) and has it been left uncharged for weeks?"
        ]
    }
}

MODEL_SPECIFIC_NUANCES: Dict[str, List[str]] = {
    "royal enfield": [
        "Royal Enfield Classic/Hunter/Meteor 350 (J-Series engine): Uses overhead cam (OHC) with hydraulic valve lifters requiring no manual tappet adjustments, unlike older UCE pushrod engines.",
        "J-Series engines feature counter-balancer shafts; excessive vibration is usually traced to chassis mounting torque (45 Nm) or wheel balancing rather than engine architecture.",
        "Check fuel pump relay in right electrical box if engine cranks but fails to ignite on Classic 350 EFI models."
    ],
    "honda": [
        "Honda Activa 5G/6G & Dio: Centrifugal dry clutch shoes accumulate friction dust rapidly in city stop-and-go traffic; causes prominent shudder from 0 to 15 km/h.",
        "Activa 6G (BS6 PGM-FI): Features ACG silent starter combined with alternator; starting failure with clicking sounds points directly to 12V battery drain rather than starter motor mechanical wear.",
        "Combi-Brake System (CBS) equalizer cable requires periodic tension equalization so front and rear brakes apply synchronously."
    ],
    "tvs": [
        "TVS Apache RTR 160/200 4V: Equipped with high-revving 4-valve cylinder heads; valve lash must be set precisely with feeler gauge to eliminate top-end ticking.",
        "RTR 200 4V with RT-Slipper clutch: Clutch cable must have strict 2mm lever gap to prevent premature slipper ramp engagement under hard downshifts.",
        "TVS iQube EV: Diagnostic trouble code (DTC) for motor controller thermals can be checked through TVS SmartXonnect console."
    ],
    "bajaj": [
        "Bajaj Pulsar 150 / 180 / NS200: Twin Spark / Triple Spark DTS-i systems require synchronized spark plug electrode gaps (0.7–0.8 mm) for clean throttle response.",
        "Pulsar NS200 (Liquid Cooled): Check coolant expansion reservoir level under side cover; low coolant causes rapid fan running and cylinder head knock.",
        "Bajaj Chetak EV: Solid metal body housing; inspect high-voltage battery connector behind the footboard."
    ],
    "yamaha": [
        "Yamaha R15 V3/V4 & MT-15: Features Variable Valve Actuation (VVA); check VVA solenoid connector if engine feels sluggish above 7,400 RPM.",
        "Water pump mechanical weep hole: Inspect underneath the water pump on right side; green fluid trace indicates mechanical seal wear.",
        "Assist & Slipper clutch: Ultra-light clutch pull requires careful cable adjustment to prevent clutch slip under 6th gear full acceleration."
    ],
    "ather": [
        "Ather 450X / 450S: Uses Gates carbon belt final drive; high pitched belt whine is adjusted using acoustic frequency tension meter (target 65–75 Hz).",
        "Regenerative braking cuts off automatically when battery SOC is >95% to protect lithium chemistry from overcharging.",
        "Hard reboot: Hold both brakes and press start toggle switch for 10 seconds to reboot the Android dashboard computer."
    ],
    "ola": [
        "Ola S1 / S1 Pro: Check side-stand magnetic sensor calibration if vehicle shows 'Side Stand Down' warning and refuses to enter Drive/Hyper mode.",
        "Mid-drive motor and belt alignment: Inspect belt tension and rock guard for trapped stones.",
        "Screen reset: Press and hold Power and Reverse buttons simultaneously for 10 seconds to reboot MoveOS system."
    ],
    "ktm": [
        "KTM Duke 200 / 390: High compression engines (12.6:1) require minimum 91–95 octane fuel; low quality regular petrol causes prominent spark knock under load.",
        "Duke 390 Radiator Fan: Radiator thermo-switch activates curved blade fan; check 15A cooling fan fuse in auxiliary fuse box under rider seat.",
        "Valve clearance uses shim-under-bucket design; adjustments require micrometer measurement of replacement shims."
    ],
    "suzuki": [
        "Suzuki Access 125 / Burgman Street: Uses Suzuki Eco Performance (SEP) CVT transmission; clean CVT air filter sponge located inside left crankcase every 4,000 km.",
        "Access 125 BS6: Inspect fuel pump relay and side-stand switch wiring harness located under footboard."
    ]
}

def get_knowledge_for_fault(category: str, brand: Optional[str] = None) -> Dict[str, Any]:
    """Retrieves technical diagnostic procedures and model-specific nuances."""
    data = DIAGNOSTIC_KNOWLEDGE.get(category, DIAGNOSTIC_KNOWLEDGE["engine_starting_failure"])
    
    brand_notes: List[str] = []
    if brand:
        b_lower = brand.lower()
        for b_key, notes in MODEL_SPECIFIC_NUANCES.items():
            if b_key in b_lower:
                brand_notes.extend(notes)
                
    if not brand_notes:
        brand_notes = [
            "General Maintenance Rule: Always follow manufacturer-specified torque limits on spark plugs, wheel axles, and engine oil drain bolts.",
            "Verify engine oil viscosity meets JASO MA2 standards for wet-clutch motorcycles or JASO MB for automatic scooters."
        ]
        
    return {
        "knowledge": data,
        "brand_notes": brand_notes
    }
