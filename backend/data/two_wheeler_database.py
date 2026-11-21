"""
Comprehensive Indian Two-Wheeler Database
Covers motorcycles, scooters, and electric two-wheelers sold in India,
including current production models and popular discontinued vehicles.
"""

from typing import List, Dict, Any, Optional

INDIAN_TWO_WHEELER_DATABASE: List[Dict[str, Any]] = [
    # =========================================================================
    # HERO MOTOCORP
    # =========================================================================
    {
        "brand": "Hero MotoCorp",
        "model": "Splendor Plus",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 97.2,
        "transmission": "4-speed Manual",
        "available_years": list(range(2004, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Self Start Drum Brake Alloy", "mrp": 75400},
            {"name": "XTEC Bluetooth Digital", "mrp": 79900},
            {"name": "Black and Accent Edition", "mrp": 76800},
            {"name": "Kick Start Spoke Wheel (Older)", "mrp": 58000}
        ]
    },
    {
        "brand": "Hero MotoCorp",
        "model": "HF Deluxe",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 97.2,
        "transmission": "4-speed Manual",
        "available_years": list(range(2010, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Self Start Alloy Wheel", "mrp": 67800},
            {"name": "Kick Start Drum Alloy", "mrp": 60200},
            {"name": "i3S Technology Drum", "mrp": 69200}
        ]
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Glamour",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 124.7,
        "transmission": "5-speed Manual",
        "available_years": list(range(2005, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Disc Brake Alloy", "mrp": 86800},
            {"name": "Drum Brake Alloy", "mrp": 82500},
            {"name": "Glamour XTEC Bluetooth Disc", "mrp": 91500}
        ]
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Passion Pro / Plus",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 113.2,
        "transmission": "4-speed Manual",
        "available_years": list(range(2002, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Pro Disc Alloy i3S", "mrp": 81000},
            {"name": "Pro Drum Alloy", "mrp": 77000},
            {"name": "Passion Plus Re-launch Edition", "mrp": 78500}
        ]
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Xpulse 200 4V",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 199.6,
        "transmission": "5-speed Manual",
        "available_years": [2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Base Dual ABS", "mrp": 146000},
            {"name": "Pro Edition (Fully Adjustable Rally Suspension)", "mrp": 154000}
        ]
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Karizma XMR",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 210.0,
        "transmission": "6-speed Manual with Slipper Clutch",
        "available_years": [2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Dual Channel ABS Standard", "mrp": 180000}
        ]
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Karizma R / ZMR (Iconic Discontinued)",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 223.0,
        "transmission": "5-speed Manual",
        "available_years": list(range(2003, 2019)),
        "is_discontinued": True,
        "variants": [
            {"name": "Karizma R Carburetor Red/Yellow", "mrp": 85000},
            {"name": "Karizma ZMR PGM-FI Full Fairing", "mrp": 108000}
        ]
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Destini 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.6,
        "transmission": "CVT Automatic",
        "available_years": list(range(2018, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Prime Drum Alloy", "mrp": 76500},
            {"name": "XTEC Connected Disc", "mrp": 86000}
        ]
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Pleasure Plus",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 110.9,
        "transmission": "CVT Automatic",
        "available_years": list(range(2006, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "LX Sheet Metal Wheel", "mrp": 71200},
            {"name": "XTEC Connected Alloy", "mrp": 82800}
        ]
    },

    # =========================================================================
    # HONDA MOTORCYCLE & SCOOTER INDIA (HMSI)
    # =========================================================================
    {
        "brand": "Honda",
        "model": "Activa 6G",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 109.51,
        "transmission": "CVT Automatic",
        "available_years": [2020, 2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Standard Drum", "mrp": 76800},
            {"name": "Deluxe LED Headlamp", "mrp": 79500},
            {"name": "H-Smart Smart Key Alloy", "mrp": 83200}
        ]
    },
    {
        "brand": "Honda",
        "model": "Activa 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.0,
        "transmission": "CVT Automatic",
        "available_years": list(range(2014, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Drum Steel", "mrp": 81000},
            {"name": "Drum Alloy", "mrp": 84600},
            {"name": "Disc Alloy H-Smart", "mrp": 90500}
        ]
    },
    {
        "brand": "Honda",
        "model": "Activa (3G / 4G / 5G Discontinued Generations)",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 109.2,
        "transmission": "CVT Automatic",
        "available_years": list(range(2009, 2020)),
        "is_discontinued": True,
        "variants": [
            {"name": "Activa 3G BS3", "mrp": 51000},
            {"name": "Activa 4G BS4 AHO", "mrp": 54000},
            {"name": "Activa 5G LED DLX", "mrp": 57500}
        ]
    },
    {
        "brand": "Honda",
        "model": "Dio 110 / 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 123.92,
        "transmission": "CVT Automatic",
        "available_years": list(range(2012, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Standard Drum 110", "mrp": 73000},
            {"name": "Dio 125 Standard", "mrp": 84500},
            {"name": "Dio 125 Smart Key Disc", "mrp": 92500}
        ]
    },
    {
        "brand": "Honda",
        "model": "Shine 125",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 123.94,
        "transmission": "5-speed Manual",
        "available_years": list(range(2006, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Drum Brake CBS", "mrp": 80500},
            {"name": "Front Disc Brake CBS", "mrp": 84500}
        ]
    },
    {
        "brand": "Honda",
        "model": "SP 125",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 123.94,
        "transmission": "5-speed Manual",
        "available_years": list(range(2019, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Drum Brake", "mrp": 86800},
            {"name": "Disc Brake", "mrp": 91000},
            {"name": "Sports Edition Disc", "mrp": 92000}
        ]
    },
    {
        "brand": "Honda",
        "model": "Unicorn 160",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 162.7,
        "transmission": "5-speed Manual",
        "available_years": list(range(2004, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Standard Single ABS", "mrp": 111500}
        ]
    },
    {
        "brand": "Honda",
        "model": "H'ness CB350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 348.36,
        "transmission": "5-speed with Assist & Slipper Clutch",
        "available_years": [2020, 2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "DLX Dual ABS", "mrp": 210000},
            {"name": "DLX Pro Dual Tone", "mrp": 215000},
            {"name": "Legacy Edition", "mrp": 217000}
        ]
    },
    {
        "brand": "Honda",
        "model": "CB350RS",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 348.36,
        "transmission": "5-speed Manual",
        "available_years": [2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Monotone Dual ABS", "mrp": 216000},
            {"name": "Dual Tone Edition", "mrp": 218500}
        ]
    },
    {
        "brand": "Honda",
        "model": "CBR 250R (Iconic Discontinued)",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 249.6,
        "transmission": "6-speed Manual",
        "available_years": list(range(2011, 2020)),
        "is_discontinued": True,
        "variants": [
            {"name": "Non-ABS Standard", "mrp": 165000},
            {"name": "Combined ABS Repsol Edition", "mrp": 195000}
        ]
    },

    # =========================================================================
    # TVS MOTOR COMPANY
    # =========================================================================
    {
        "brand": "TVS",
        "model": "Jupiter 110",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 113.3,
        "transmission": "CVT Automatic",
        "available_years": list(range(2013, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Sheet Metal Drum", "mrp": 74500},
            {"name": "ZX Drum Alloy iTouch", "mrp": 83000},
            {"name": "SmartXonnect Disc", "mrp": 88000}
        ]
    },
    {
        "brand": "TVS",
        "model": "Jupiter 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.8,
        "transmission": "CVT Automatic",
        "available_years": [2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Drum Steel", "mrp": 80000},
            {"name": "Drum Alloy", "mrp": 83500},
            {"name": "Disc SmartXonnect TFT", "mrp": 91500}
        ]
    },
    {
        "brand": "TVS",
        "model": "Ntorq 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.8,
        "transmission": "CVT Automatic",
        "available_years": list(range(2018, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Drum", "mrp": 85000},
            {"name": "Disc Bluetooth", "mrp": 90000},
            {"name": "Race Edition", "mrp": 94500},
            {"name": "Race XP (10.2 PS Dual Riding Modes)", "mrp": 98000},
            {"name": "XT Connected TFT", "mrp": 105000}
        ]
    },
    {
        "brand": "TVS",
        "model": "Apache RTR 160 4V",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 159.7,
        "transmission": "5-speed Manual",
        "available_years": list(range(2018, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Rear Drum Single ABS", "mrp": 124500},
            {"name": "Rear Disc Bluetooth SmartXonnect", "mrp": 131500},
            {"name": "Special Edition Bullpup Exhaust", "mrp": 133000}
        ]
    },
    {
        "brand": "TVS",
        "model": "Apache RTR 200 4V",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 197.75,
        "transmission": "5-speed with Slipper Clutch & Riding Modes",
        "available_years": list(range(2016, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Single Channel ABS Riding Modes", "mrp": 142000},
            {"name": "Dual Channel ABS with Showa Adjustable Suspension", "mrp": 148500}
        ]
    },
    {
        "brand": "TVS",
        "model": "Raider 125",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 124.8,
        "transmission": "5-speed Manual",
        "available_years": [2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Drum", "mrp": 95500},
            {"name": "Single Disc", "mrp": 98000},
            {"name": "SmartXonnect Color TFT", "mrp": 104000}
        ]
    },
    {
        "brand": "TVS",
        "model": "Ronin 225",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 225.9,
        "transmission": "5-speed with Assist & Slipper Clutch",
        "available_years": [2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "SS Single Channel ABS", "mrp": 149000},
            {"name": "DS Dual Channel ABS", "mrp": 156500},
            {"name": "TD Triple Tone Connected", "mrp": 172000}
        ]
    },
    {
        "brand": "TVS",
        "model": "iQube EV",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Direct Hub Drive",
        "available_years": [2020, 2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Base 2.2 kWh (75 km Range)", "mrp": 110000},
            {"name": "iQube 3.4 kWh (100 km TrueRange)", "mrp": 136500},
            {"name": "iQube S 3.4 kWh TFT Connected", "mrp": 146500},
            {"name": "iQube ST 5.1 kWh Fast Charge (150 km Range)", "mrp": 185000}
        ]
    },

    # =========================================================================
    # BAJAJ AUTO
    # =========================================================================
    {
        "brand": "Bajaj",
        "model": "Pulsar 150",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 149.5,
        "transmission": "5-speed Manual",
        "available_years": list(range(2001, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Single Disc ABS", "mrp": 113000},
            {"name": "Twin Disc ABS Split Seat", "mrp": 118500}
        ]
    },
    {
        "brand": "Bajaj",
        "model": "Pulsar NS200",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 199.5,
        "transmission": "6-speed Manual with Perimeter Frame",
        "available_years": list(range(2012, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "BS4 Carburetor (Discontinued)", "mrp": 112000},
            {"name": "BS6 Dual Channel ABS with USD Forks", "mrp": 149000}
        ]
    },
    {
        "brand": "Bajaj",
        "model": "Pulsar 220F",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 220.0,
        "transmission": "5-speed Manual",
        "available_years": list(range(2007, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Carb Dual Disc (Legacy)", "mrp": 98000},
            {"name": "BS6 Single Channel ABS Projector", "mrp": 140000}
        ]
    },
    {
        "brand": "Bajaj",
        "model": "Dominar 400",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 373.3,
        "transmission": "6-speed Manual with Slipper Clutch",
        "available_years": list(range(2016, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Dual ABS Standard", "mrp": 225000},
            {"name": "Touring Edition (Tall Screen, Luggage Carrier, Handguards)", "mrp": 232000}
        ]
    },
    {
        "brand": "Bajaj",
        "model": "Avenger Cruise / Street 220",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 220.0,
        "transmission": "5-speed Manual",
        "available_years": list(range(2005, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Cruise 220 Chrome with Windshield", "mrp": 144000},
            {"name": "Street 160 Black Alloy", "mrp": 118000}
        ]
    },
    {
        "brand": "Bajaj",
        "model": "Platina 100 / 110",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 115.45,
        "transmission": "5-speed Manual with ComforTec",
        "available_years": list(range(2006, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "100 ES Drum", "mrp": 67800},
            {"name": "110 ABS (Segment First ABS)", "mrp": 79800}
        ]
    },
    {
        "brand": "Bajaj",
        "model": "Chetak EV",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Direct Metal Body",
        "available_years": [2020, 2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Urbane 2.9 kWh", "mrp": 115000},
            {"name": "Premium 3.2 kWh with TecPac", "mrp": 135000},
            {"name": "2901 Affordable Edition", "mrp": 96000}
        ]
    },
    {
        "brand": "Bajaj",
        "model": "Chetak 2-Stroke (Iconic Vintage Discontinued)",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 145.45,
        "transmission": "4-speed Handle Grip Shift",
        "available_years": list(range(1980, 2006)),
        "is_discontinued": True,
        "variants": [
            {"name": "12V Electronic Ignition Steel Body", "mrp": 32000}
        ]
    },

    # =========================================================================
    # ROYAL ENFIELD
    # =========================================================================
    {
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 349.34,
        "transmission": "5-speed Constant Mesh J-Series",
        "available_years": list(range(2009, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "UCE 350 Twinspark (Older 2009-2021)", "mrp": 165000},
            {"name": "J-Series Redditch Single ABS", "mrp": 193000},
            {"name": "Halcyon Dual Channel ABS", "mrp": 199000},
            {"name": "Signals Dual Channel ABS", "mrp": 214000},
            {"name": "Dark Stealth Black Alloy Tubeless", "mrp": 221000},
            {"name": "Chrome Red / Bronze Dual ABS", "mrp": 225000}
        ]
    },
    {
        "brand": "Royal Enfield",
        "model": "Hunter 350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 349.34,
        "transmission": "5-speed Manual",
        "available_years": [2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Retro Factory Spoke Single ABS", "mrp": 149900},
            {"name": "Metro Dapper Dual ABS Alloy", "mrp": 169500},
            {"name": "Metro Rebel Dual Tone Alloy", "mrp": 174500}
        ]
    },
    {
        "brand": "Royal Enfield",
        "model": "Bullet 350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 349.34,
        "transmission": "5-speed Manual",
        "available_years": list(range(1990, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Standard Cast Iron Heavy Crank (Vintage)", "mrp": 85000},
            {"name": "Bullet 350 ES Electra UCE", "mrp": 145000},
            {"name": "New J-Series Military Red/Black", "mrp": 174000},
            {"name": "New J-Series Standard Black/Maroon", "mrp": 198000},
            {"name": "Black Gold Dual ABS", "mrp": 216000}
        ]
    },
    {
        "brand": "Royal Enfield",
        "model": "Meteor 350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 349.34,
        "transmission": "5-speed Manual with Tripper Nav",
        "available_years": [2020, 2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Fireball Dual ABS", "mrp": 206000},
            {"name": "Stellar with Pillion Backrest", "mrp": 216000},
            {"name": "Supernova Dual Tone with Windshield", "mrp": 230000}
        ]
    },
    {
        "brand": "Royal Enfield",
        "model": "Himalayan",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 451.65,
        "transmission": "6-speed with Ride-by-Wire (Sherpa 450)",
        "available_years": list(range(2016, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Himalayan 411 LS410 (Discontinued)", "mrp": 215000},
            {"name": "Himalayan 450 Base Kaza Brown", "mrp": 285000},
            {"name": "Himalayan 450 Pass Slate", "mrp": 289000},
            {"name": "Himalayan 450 Summit Hanle Black Tubeless Spoke", "mrp": 298000}
        ]
    },
    {
        "brand": "Royal Enfield",
        "model": "Interceptor 650",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 647.95,
        "transmission": "6-speed Parallel Twin with Slipper Clutch",
        "available_years": list(range(2018, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Canyon Red Spoke Wheel", "mrp": 303000},
            {"name": "Black Ray Alloy Wheel Tubeless", "mrp": 321000},
            {"name": "Mark 2 Chrome Edition", "mrp": 331000}
        ]
    },
    {
        "brand": "Royal Enfield",
        "model": "Continental GT 650",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 647.95,
        "transmission": "6-speed Cafe Racer Clip-ons",
        "available_years": list(range(2018, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Rocker Red Spoke", "mrp": 319000},
            {"name": "Apex Grey Alloy Wheel", "mrp": 339000},
            {"name": "Mister Clean Triple Chrome", "mrp": 345000}
        ]
    },

    # =========================================================================
    # YAMAHA MOTOR INDIA
    # =========================================================================
    {
        "brand": "Yamaha",
        "model": "YZF R15 V4 / V3 / V2",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 155.0,
        "transmission": "6-speed Manual with VVA & Assist Slipper Clutch",
        "available_years": list(range(2012, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "R15 V2 Dual Headlamp (Legacy Discontinued)", "mrp": 118000},
            {"name": "R15 V3 Dual ABS (Legacy Discontinued)", "mrp": 155000},
            {"name": "R15S V3 Unibody Seat", "mrp": 166000},
            {"name": "R15 V4 Metallic Red Dual ABS", "mrp": 183000},
            {"name": "R15 V4 Racing Blue Quickshifter", "mrp": 188000},
            {"name": "R15M Silver Carbon with TFT Display", "mrp": 198000}
        ]
    },
    {
        "brand": "Yamaha",
        "model": "MT-15 V2",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 155.0,
        "transmission": "6-speed Manual with USD Forks",
        "available_years": list(range(2019, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "V1 Single ABS (Discontinued)", "mrp": 145000},
            {"name": "V2 Dual Channel ABS Traction Control", "mrp": 168000},
            {"name": "V2 Deluxe Metallic Black / Ice Fluo", "mrp": 173500}
        ]
    },
    {
        "brand": "Yamaha",
        "model": "FZ-S FI V3 / V4",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 149.0,
        "transmission": "5-speed Manual",
        "available_years": list(range(2008, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "FZ V2 Carb/FI (Legacy)", "mrp": 87000},
            {"name": "FZ-S V3 Single Channel ABS", "mrp": 121000},
            {"name": "FZ-S V4 Deluxe Traction Control LED", "mrp": 130000}
        ]
    },
    {
        "brand": "Yamaha",
        "model": "Aerox 155",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 155.0,
        "transmission": "CVT Automatic with Liquid Cooled VVA",
        "available_years": [2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Standard Single Channel ABS", "mrp": 148500},
            {"name": "MotoGP Monster Energy Edition", "mrp": 153500}
        ]
    },
    {
        "brand": "Yamaha",
        "model": "RayZR 125 Fi Hybrid",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 125.0,
        "transmission": "CVT Automatic with Electric SMG Assist",
        "available_years": list(range(2016, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Drum Hybrid", "mrp": 85500},
            {"name": "Disc Hybrid Bluetooth", "mrp": 91500},
            {"name": "Street Rally Edition with Knuckle Guards", "mrp": 96000}
        ]
    },
    {
        "brand": "Yamaha",
        "model": "RX 100 (Legendary 2-Stroke Discontinued)",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 98.0,
        "transmission": "4-speed Manual 2-Stroke Reed Valve",
        "available_years": list(range(1985, 1996)),
        "is_discontinued": True,
        "variants": [
            {"name": "Made In Japan Escorts Original", "mrp": 19500}
        ]
    },

    # =========================================================================
    # SUZUKI MOTORCYCLE INDIA
    # =========================================================================
    {
        "brand": "Suzuki",
        "model": "Access 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.0,
        "transmission": "CVT Automatic with SEP",
        "available_years": list(range(2007, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Drum Brake Steel Wheels", "mrp": 79800},
            {"name": "Drum Alloy Wheel", "mrp": 83500},
            {"name": "Disc Brake Alloy Wheel", "mrp": 86800},
            {"name": "Special Edition Ride Connect Bluetooth", "mrp": 90500}
        ]
    },
    {
        "brand": "Suzuki",
        "model": "Burgman Street 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.0,
        "transmission": "CVT Automatic Maxi-Scooter",
        "available_years": list(range(2018, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Standard Disc", "mrp": 94500},
            {"name": "Ride Connect Bluetooth", "mrp": 98500},
            {"name": "Burgman Street EX (12-inch Rear Wheel & Auto Start-Stop)", "mrp": 114500}
        ]
    },
    {
        "brand": "Suzuki",
        "model": "Gixxer 150 / SF 150",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 155.0,
        "transmission": "5-speed Manual",
        "available_years": list(range(2014, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Gixxer Naked Single ABS", "mrp": 134500},
            {"name": "Gixxer SF Aerodynamic Fairing Single ABS", "mrp": 145500},
            {"name": "Gixxer SF Ride Connect Bluetooth", "mrp": 147500}
        ]
    },

    # =========================================================================
    # KTM INDIA (BAJAJ-KTM)
    # =========================================================================
    {
        "brand": "KTM",
        "model": "Duke 200",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 199.5,
        "transmission": "6-speed Manual Trellis Frame",
        "available_years": list(range(2012, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "BS3 Underbelly Exhaust (Legacy)", "mrp": 135000},
            {"name": "Dual Channel ABS SuperMoto Mode LED", "mrp": 198000}
        ]
    },
    {
        "brand": "KTM",
        "model": "Duke 390",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 398.63,
        "transmission": "6-speed with Quickshifter+, Launch Control, Cornering ABS",
        "available_years": list(range(2013, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Gen 1 (2013-2016 Legacy)", "mrp": 185000},
            {"name": "Gen 2 TFT Screen (2017-2023)", "mrp": 295000},
            {"name": "Gen 3 (399cc LC4c Engine, 45.3 bhp)", "mrp": 312000}
        ]
    },
    {
        "brand": "KTM",
        "model": "RC 200",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 199.5,
        "transmission": "6-speed Manual Track Clip-ons",
        "available_years": list(range(2014, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Twin Projector Gen 1 (Discontinued)", "mrp": 172000},
            {"name": "Gen 2 Dual Channel ABS Foldable Levers", "mrp": 218000}
        ]
    },

    # =========================================================================
    # ATHER ENERGY
    # =========================================================================
    {
        "brand": "Ather Energy",
        "model": "450X",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Direct Belt Drive (PMSM 6kW)",
        "available_years": [2020, 2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Gen 1 (2.9 kWh)", "mrp": 145000},
            {"name": "Gen 2 (2.9 kWh 4G SIM)", "mrp": 150000},
            {"name": "Gen 3 (3.7 kWh 111 km TrueRange)", "mrp": 158000},
            {"name": "Gen 3 Pro Pack with Warp Mode & Google Maps", "mrp": 169000}
        ]
    },
    {
        "brand": "Ather Energy",
        "model": "450S",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Direct Belt Drive",
        "available_years": [2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "2.9 kWh DeepView Display (90 km TrueRange)", "mrp": 126000},
            {"name": "450S with Pro Pack", "mrp": 136000}
        ]
    },
    {
        "brand": "Ather Energy",
        "model": "Rizta",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Family Comfort Scooter",
        "available_years": [2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "S 2.9 kWh (105 km IDC Range)", "mrp": 110000},
            {"name": "Z 2.9 kWh Backrest & SkidControl", "mrp": 125000},
            {"name": "Z 3.7 kWh Long Range (160 km IDC Range)", "mrp": 145000}
        ]
    },

    # =========================================================================
    # OLA ELECTRIC
    # =========================================================================
    {
        "brand": "Ola Electric",
        "model": "S1 Pro",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Mid-Drive IPM",
        "available_years": [2021, 2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Gen 1 (3.97 kWh Single Front Fork)", "mrp": 139000},
            {"name": "Gen 2 (4.0 kWh Dual Telescopic Fork, 11 kW Peak)", "mrp": 147500}
        ]
    },
    {
        "brand": "Ola Electric",
        "model": "S1 Air",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Hub Motor",
        "available_years": [2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "3 kWh (151 km Certified IDC Range)", "mrp": 105000}
        ]
    },
    {
        "brand": "Ola Electric",
        "model": "S1 X",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Physical Key Drive",
        "available_years": [2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "S1 X (2 kWh Battery)", "mrp": 74999},
            {"name": "S1 X (3 kWh Battery)", "mrp": 87999},
            {"name": "S1 X (4 kWh Battery 190 km Range)", "mrp": 101999},
            {"name": "S1 X Plus (3 kWh Keyless Display)", "mrp": 89999}
        ]
    },

    # =========================================================================
    # TRIUMPH MOTORCYCLES INDIA (BAJAJ-TRIUMPH)
    # =========================================================================
    {
        "brand": "Triumph",
        "model": "Speed 400",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 398.15,
        "transmission": "6-speed with Slipper Clutch (40 PS / 37.5 Nm)",
        "available_years": [2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Standard Dual Channel ABS Traction Control", "mrp": 234000}
        ]
    },
    {
        "brand": "Triumph",
        "model": "Scrambler 400 X",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 398.15,
        "transmission": "6-speed with 19-inch Front Wheel",
        "available_years": [2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Standard Switchable ABS Handguards", "mrp": 264000}
        ]
    },

    # =========================================================================
    # HARLEY-DAVIDSON (HERO-HARLEY)
    # =========================================================================
    {
        "brand": "Harley-Davidson",
        "model": "X440",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 440.0,
        "transmission": "6-speed Manual Single Cylinder (38 Nm)",
        "available_years": [2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Denim (Spoke Wheels)", "mrp": 239500},
            {"name": "Vivid (Alloy Wheels)", "mrp": 259500},
            {"name": "S (Diamond Cut Alloys, e-SIM Connected TFT)", "mrp": 279500}
        ]
    },
    {
        "brand": "Harley-Davidson",
        "model": "Street 750 (Iconic Discontinued)",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 749.0,
        "transmission": "6-speed Liquid Cooled V-Twin Revolution X",
        "available_years": list(range(2014, 2021)),
        "is_discontinued": True,
        "variants": [
            {"name": "Standard Dual Disc", "mrp": 534000},
            {"name": "ABS Edition Vivid Black", "mrp": 580000}
        ]
    },

    # =========================================================================
    # JAWA & YEZDI (CLASSIC LEGENDS)
    # =========================================================================
    {
        "brand": "Jawa",
        "model": "Jawa 350 / Classic",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 334.0,
        "transmission": "6-speed Manual DOHC",
        "available_years": list(range(2018, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Single Channel ABS (Older)", "mrp": 173000},
            {"name": "New Jawa 350 Dual Channel ABS Spoke", "mrp": 214500}
        ]
    },
    {
        "brand": "Jawa",
        "model": "42 / 42 Bobber",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 334.0,
        "transmission": "6-speed Manual",
        "available_years": list(range(2018, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Jawa 42 2.1 Alloy Wheel", "mrp": 198000},
            {"name": "42 Bobber Single Floating Seat", "mrp": 225000}
        ]
    },
    {
        "brand": "Yezdi",
        "model": "Roadster",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 334.0,
        "transmission": "6-speed Manual (29.7 bhp / 29 Nm)",
        "available_years": [2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "Dark Smoke Grey Alloy", "mrp": 206000},
            {"name": "Chrome Dual Tone", "mrp": 212500}
        ]
    },

    # =========================================================================
    # REVOLT MOTORS
    # =========================================================================
    {
        "brand": "Revolt",
        "model": "RV400",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Belt Drive with Synthetic Sound Synthesizer",
        "available_years": list(range(2019, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "RV400 BRZ (Affordable 150 km Eco)", "mrp": 128000},
            {"name": "RV400 Premium Connected (3.24 kWh Swappable Battery)", "mrp": 139000}
        ]
    },

    # =========================================================================
    # ULTRAVIOLETTE AUTOMOTIVE
    # =========================================================================
    {
        "brand": "Ultraviolette",
        "model": "F77 Mach 2",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Direct Drive High Performance (30 kW / 100 Nm)",
        "available_years": [2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "F77 Mach 2 Standard (7.1 kWh 211 km IDC)", "mrp": 299000},
            {"name": "F77 Mach 2 Recon (10.3 kWh 323 km IDC, 40.2 bhp)", "mrp": 399000}
        ]
    },

    # =========================================================================
    # HERO ELECTRIC & AMPERE & VIDA
    # =========================================================================
    {
        "brand": "Vida",
        "model": "V1 Pro / Plus",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Dual Removable Batteries",
        "available_years": [2022, 2023, 2024, 2025, 2026],
        "is_discontinued": False,
        "variants": [
            {"name": "V1 Plus (3.44 kWh)", "mrp": 120000},
            {"name": "V1 Pro (3.94 kWh 110 km TrueRange)", "mrp": 145000}
        ]
    },
    {
        "brand": "Ampere",
        "model": "Magnus EX / Nexus",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Hub Drive",
        "available_years": list(range(2021, 2026)),
        "is_discontinued": False,
        "variants": [
            {"name": "Magnus EX (2.3 kWh 80-100 km Range)", "mrp": 84500},
            {"name": "Nexus LFP Battery Mid-Mount", "mrp": 110000}
        ]
    },
    {
        "brand": "Hero Electric",
        "model": "Optima CX",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Hub Motor",
        "available_years": list(range(2018, 2025)),
        "is_discontinued": False,
        "variants": [
            {"name": "CX Single Battery (82 km Range)", "mrp": 67000},
            {"name": "CX 2.0 Dual Battery (140 km Range)", "mrp": 85000}
        ]
    }
]

def get_all_categories() -> List[str]:
    return ["motorcycle", "scooter", "electric"]

def get_brands_by_category(category: Optional[str] = None) -> List[str]:
    brands = set()
    for v in INDIAN_TWO_WHEELER_DATABASE:
        if not category or v["category"].lower() == category.lower():
            brands.add(v["brand"])
    return sorted(list(brands))

def get_models_by_brand(brand: str, category: Optional[str] = None) -> List[Dict[str, Any]]:
    b_clean = brand.lower().strip()
    models = []
    for v in INDIAN_TWO_WHEELER_DATABASE:
        if v["brand"].lower().strip() == b_clean:
            if not category or v["category"].lower() == category.lower():
                models.append({
                    "model": v["model"],
                    "category": v["category"],
                    "fuel_type": v["fuel_type"],
                    "engine_cc": v.get("engine_cc", 0),
                    "transmission": v.get("transmission", ""),
                    "available_years": v.get("available_years", []),
                    "is_discontinued": v.get("is_discontinued", False),
                    "variants": [var["name"] for var in v.get("variants", [])]
                })
    return models

def get_vehicle_entry(brand: str, model: str) -> Optional[Dict[str, Any]]:
    b_clean = brand.lower().strip()
    m_clean = model.lower().strip()
    for v in INDIAN_TWO_WHEELER_DATABASE:
        if v["brand"].lower().strip() == b_clean and (v["model"].lower().strip() == m_clean or m_clean in v["model"].lower()):
            return v
    return None
