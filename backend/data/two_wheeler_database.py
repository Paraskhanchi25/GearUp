"""
Comprehensive Indian Two-Wheeler Database with Canonical Unique Identifiers
Covers 22 manufacturers, 77 vehicles, and 200+ variants across motorcycles,
scooters, and electric two-wheelers sold in India (including iconic discontinued classics).
"""

from typing import List, Dict, Any, Optional

BRAND_ALIASES: Dict[str, str] = {
    "hero": "Hero MotoCorp",
    "hero motocorp": "Hero MotoCorp",
    "hero honda": "Hero MotoCorp",
    "honda": "Honda",
    "tvs": "TVS",
    "bajaj": "Bajaj",
    "royal enfield": "Royal Enfield",
    "re": "Royal Enfield",
    "bullet": "Royal Enfield",
    "yamaha": "Yamaha",
    "suzuki": "Suzuki",
    "ktm": "KTM",
    "kawasaki": "Kawasaki",
    "triumph": "Triumph",
    "harley": "Harley-Davidson",
    "harley davidson": "Harley-Davidson",
    "harley-davidson": "Harley-Davidson",
    "jawa": "Jawa",
    "yezdi": "Yezdi",
    "ather": "Ather Energy",
    "ather energy": "Ather Energy",
    "ola": "Ola Electric",
    "ola electric": "Ola Electric",
    "chetak": "Bajaj",
    "bajaj chetak": "Bajaj",
    "hero electric": "Hero Electric",
    "ampere": "Ampere",
    "vida": "Vida",
    "revolt": "Revolt",
    "ultraviolette": "Ultraviolette",
    "vespa": "Vespa",
    "piaggio": "Vespa",
    "aprilia": "Aprilia",
}

INDIAN_TWO_WHEELER_DATABASE: List[Dict[str, Any]] = [
    {
        "brand": "Hero MotoCorp",
        "model": "Splendor Plus",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 97.2,
        "transmission": "4-speed Manual",
        "available_years": [
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Self Start Drum Brake Alloy",
                "mrp": 75400,
                "id": "hero-motocorp-splendor-plus-self-start-drum-brake-alloy",
                "fuel_type": "petrol",
                "engine_cc": 97.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "XTEC Bluetooth Digital",
                "mrp": 79900,
                "id": "hero-motocorp-splendor-plus-xtec-bluetooth-digital",
                "fuel_type": "petrol",
                "engine_cc": 97.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Black and Accent Edition",
                "mrp": 76800,
                "id": "hero-motocorp-splendor-plus-black-and-accent-edition",
                "fuel_type": "petrol",
                "engine_cc": 97.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Kick Start Spoke Wheel (Older)",
                "mrp": 58000,
                "id": "hero-motocorp-splendor-plus-kick-start-spoke-wheel-older",
                "fuel_type": "petrol",
                "engine_cc": 97.2,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "hero-motocorp-splendor-plus"
    },
    {
        "brand": "Hero MotoCorp",
        "model": "HF Deluxe",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 97.2,
        "transmission": "4-speed Manual",
        "available_years": [
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Self Start Alloy Wheel",
                "mrp": 67800,
                "id": "hero-motocorp-hf-deluxe-self-start-alloy-wheel",
                "fuel_type": "petrol",
                "engine_cc": 97.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Kick Start Drum Alloy",
                "mrp": 60200,
                "id": "hero-motocorp-hf-deluxe-kick-start-drum-alloy",
                "fuel_type": "petrol",
                "engine_cc": 97.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "i3S Technology Drum",
                "mrp": 69200,
                "id": "hero-motocorp-hf-deluxe-i3s-technology-drum",
                "fuel_type": "petrol",
                "engine_cc": 97.2,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "hero-motocorp-hf-deluxe"
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Glamour",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 124.7,
        "transmission": "5-speed Manual",
        "available_years": [
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Disc Brake Alloy",
                "mrp": 86800,
                "id": "hero-motocorp-glamour-disc-brake-alloy",
                "fuel_type": "petrol",
                "engine_cc": 124.7,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Drum Brake Alloy",
                "mrp": 82500,
                "id": "hero-motocorp-glamour-drum-brake-alloy",
                "fuel_type": "petrol",
                "engine_cc": 124.7,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Glamour XTEC Bluetooth Disc",
                "mrp": 91500,
                "id": "hero-motocorp-glamour-glamour-xtec-bluetooth-disc",
                "fuel_type": "petrol",
                "engine_cc": 124.7,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "hero-motocorp-glamour"
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Passion Pro / Plus",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 113.2,
        "transmission": "4-speed Manual",
        "available_years": [
            2002,
            2003,
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Pro Disc Alloy i3S",
                "mrp": 81000,
                "id": "hero-motocorp-passion-pro-plus-pro-disc-alloy-i3s",
                "fuel_type": "petrol",
                "engine_cc": 113.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Pro Drum Alloy",
                "mrp": 77000,
                "id": "hero-motocorp-passion-pro-plus-pro-drum-alloy",
                "fuel_type": "petrol",
                "engine_cc": 113.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Passion Plus Re-launch Edition",
                "mrp": 78500,
                "id": "hero-motocorp-passion-pro-plus-passion-plus-re-launch-edition",
                "fuel_type": "petrol",
                "engine_cc": 113.2,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "hero-motocorp-passion-pro-plus"
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Xpulse 200 4V",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 199.6,
        "transmission": "5-speed Manual",
        "available_years": [
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Base Dual ABS",
                "mrp": 146000,
                "id": "hero-motocorp-xpulse-200-4v-base-dual-abs",
                "fuel_type": "petrol",
                "engine_cc": 199.6,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Pro Edition (Fully Adjustable Rally Suspension)",
                "mrp": 154000,
                "id": "hero-motocorp-xpulse-200-4v-pro-edition-fully-adjustable-rally-suspension",
                "fuel_type": "petrol",
                "engine_cc": 199.6,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "hero-motocorp-xpulse-200-4v"
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Karizma XMR",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 210.0,
        "transmission": "6-speed Manual with Slipper Clutch",
        "available_years": [
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Dual Channel ABS Standard",
                "mrp": 180000,
                "id": "hero-motocorp-karizma-xmr-dual-channel-abs-standard",
                "fuel_type": "petrol",
                "engine_cc": 210.0,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "hero-motocorp-karizma-xmr"
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Karizma R / ZMR (Iconic Discontinued)",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 223.0,
        "transmission": "5-speed Manual",
        "available_years": [
            2003,
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018
        ],
        "is_discontinued": True,
        "variants": [
            {
                "name": "Karizma R Carburetor Red/Yellow",
                "mrp": 85000,
                "id": "hero-motocorp-karizma-r-zmr-iconic-discontinued-karizma-r-carburetor-red-yellow",
                "fuel_type": "petrol",
                "engine_cc": 223.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Karizma ZMR PGM-FI Full Fairing",
                "mrp": 108000,
                "id": "hero-motocorp-karizma-r-zmr-iconic-discontinued-karizma-zmr-pgm-fi-full-fairing",
                "fuel_type": "petrol",
                "engine_cc": 223.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "hero-motocorp-karizma-r-zmr-iconic-discontinued"
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Destini 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.6,
        "transmission": "CVT Automatic",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Prime Drum Alloy",
                "mrp": 76500,
                "id": "hero-motocorp-destini-125-prime-drum-alloy",
                "fuel_type": "petrol",
                "engine_cc": 124.6,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "XTEC Connected Disc",
                "mrp": 86000,
                "id": "hero-motocorp-destini-125-xtec-connected-disc",
                "fuel_type": "petrol",
                "engine_cc": 124.6,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "hero-motocorp-destini-125"
    },
    {
        "brand": "Hero MotoCorp",
        "model": "Pleasure Plus",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 110.9,
        "transmission": "CVT Automatic",
        "available_years": [
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "LX Sheet Metal Wheel",
                "mrp": 71200,
                "id": "hero-motocorp-pleasure-plus-lx-sheet-metal-wheel",
                "fuel_type": "petrol",
                "engine_cc": 110.9,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "XTEC Connected Alloy",
                "mrp": 82800,
                "id": "hero-motocorp-pleasure-plus-xtec-connected-alloy",
                "fuel_type": "petrol",
                "engine_cc": 110.9,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "hero-motocorp-pleasure-plus"
    },
    {
        "brand": "Honda",
        "model": "Activa 6G",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 109.51,
        "transmission": "CVT Automatic",
        "available_years": [
            2020,
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Standard Drum",
                "mrp": 76800,
                "id": "honda-activa-6g-standard-drum",
                "fuel_type": "petrol",
                "engine_cc": 109.51,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Deluxe LED Headlamp",
                "mrp": 79500,
                "id": "honda-activa-6g-deluxe-led-headlamp",
                "fuel_type": "petrol",
                "engine_cc": 109.51,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "H-Smart Smart Key Alloy",
                "mrp": 83200,
                "id": "honda-activa-6g-h-smart-smart-key-alloy",
                "fuel_type": "petrol",
                "engine_cc": 109.51,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "honda-activa-6g"
    },
    {
        "brand": "Honda",
        "model": "Activa 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.0,
        "transmission": "CVT Automatic",
        "available_years": [
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Drum Steel",
                "mrp": 81000,
                "id": "honda-activa-125-drum-steel",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Drum Alloy",
                "mrp": 84600,
                "id": "honda-activa-125-drum-alloy",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Disc Alloy H-Smart",
                "mrp": 90500,
                "id": "honda-activa-125-disc-alloy-h-smart",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "honda-activa-125"
    },
    {
        "brand": "Honda",
        "model": "Activa (3G / 4G / 5G Discontinued Generations)",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 109.2,
        "transmission": "CVT Automatic",
        "available_years": [
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019
        ],
        "is_discontinued": True,
        "variants": [
            {
                "name": "Activa 3G BS3",
                "mrp": 51000,
                "id": "honda-activa-3g-4g-5g-discontinued-generations-activa-3g-bs3",
                "fuel_type": "petrol",
                "engine_cc": 109.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Activa 4G BS4 AHO",
                "mrp": 54000,
                "id": "honda-activa-3g-4g-5g-discontinued-generations-activa-4g-bs4-aho",
                "fuel_type": "petrol",
                "engine_cc": 109.2,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Activa 5G LED DLX",
                "mrp": 57500,
                "id": "honda-activa-3g-4g-5g-discontinued-generations-activa-5g-led-dlx",
                "fuel_type": "petrol",
                "engine_cc": 109.2,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "honda-activa-3g-4g-5g-discontinued-generations"
    },
    {
        "brand": "Honda",
        "model": "Dio 110 / 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 123.92,
        "transmission": "CVT Automatic",
        "available_years": [
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Standard Drum 110",
                "mrp": 73000,
                "id": "honda-dio-110-125-standard-drum-110",
                "fuel_type": "petrol",
                "engine_cc": 123.92,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Dio 125 Standard",
                "mrp": 84500,
                "id": "honda-dio-110-125-dio-125-standard",
                "fuel_type": "petrol",
                "engine_cc": 123.92,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Dio 125 Smart Key Disc",
                "mrp": 92500,
                "id": "honda-dio-110-125-dio-125-smart-key-disc",
                "fuel_type": "petrol",
                "engine_cc": 123.92,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "honda-dio-110-125"
    },
    {
        "brand": "Honda",
        "model": "Shine 125",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 123.94,
        "transmission": "5-speed Manual",
        "available_years": [
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Drum Brake CBS",
                "mrp": 80500,
                "id": "honda-shine-125-drum-brake-cbs",
                "fuel_type": "petrol",
                "engine_cc": 123.94,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Front Disc Brake CBS",
                "mrp": 84500,
                "id": "honda-shine-125-front-disc-brake-cbs",
                "fuel_type": "petrol",
                "engine_cc": 123.94,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "honda-shine-125"
    },
    {
        "brand": "Honda",
        "model": "SP 125",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 123.94,
        "transmission": "5-speed Manual",
        "available_years": [
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Drum Brake",
                "mrp": 86800,
                "id": "honda-sp-125-drum-brake",
                "fuel_type": "petrol",
                "engine_cc": 123.94,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Disc Brake",
                "mrp": 91000,
                "id": "honda-sp-125-disc-brake",
                "fuel_type": "petrol",
                "engine_cc": 123.94,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Sports Edition Disc",
                "mrp": 92000,
                "id": "honda-sp-125-sports-edition-disc",
                "fuel_type": "petrol",
                "engine_cc": 123.94,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "honda-sp-125"
    },
    {
        "brand": "Honda",
        "model": "Unicorn 160",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 162.7,
        "transmission": "5-speed Manual",
        "available_years": [
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Standard Single ABS",
                "mrp": 111500,
                "id": "honda-unicorn-160-standard-single-abs",
                "fuel_type": "petrol",
                "engine_cc": 162.7,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "honda-unicorn-160"
    },
    {
        "brand": "Honda",
        "model": "H'ness CB350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 348.36,
        "transmission": "5-speed with Assist & Slipper Clutch",
        "available_years": [
            2020,
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "DLX Dual ABS",
                "mrp": 210000,
                "id": "honda-h-ness-cb350-dlx-dual-abs",
                "fuel_type": "petrol",
                "engine_cc": 348.36,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "DLX Pro Dual Tone",
                "mrp": 215000,
                "id": "honda-h-ness-cb350-dlx-pro-dual-tone",
                "fuel_type": "petrol",
                "engine_cc": 348.36,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Legacy Edition",
                "mrp": 217000,
                "id": "honda-h-ness-cb350-legacy-edition",
                "fuel_type": "petrol",
                "engine_cc": 348.36,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "honda-h-ness-cb350"
    },
    {
        "brand": "Honda",
        "model": "CB350RS",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 348.36,
        "transmission": "5-speed Manual",
        "available_years": [
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Monotone Dual ABS",
                "mrp": 216000,
                "id": "honda-cb350rs-monotone-dual-abs",
                "fuel_type": "petrol",
                "engine_cc": 348.36,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Dual Tone Edition",
                "mrp": 218500,
                "id": "honda-cb350rs-dual-tone-edition",
                "fuel_type": "petrol",
                "engine_cc": 348.36,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "honda-cb350rs"
    },
    {
        "brand": "Honda",
        "model": "CBR 250R (Iconic Discontinued)",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 249.6,
        "transmission": "6-speed Manual",
        "available_years": [
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019
        ],
        "is_discontinued": True,
        "variants": [
            {
                "name": "Non-ABS Standard",
                "mrp": 165000,
                "id": "honda-cbr-250r-iconic-discontinued-non-abs-standard",
                "fuel_type": "petrol",
                "engine_cc": 249.6,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Combined ABS Repsol Edition",
                "mrp": 195000,
                "id": "honda-cbr-250r-iconic-discontinued-combined-abs-repsol-edition",
                "fuel_type": "petrol",
                "engine_cc": 249.6,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "honda-cbr-250r-iconic-discontinued"
    },
    {
        "brand": "TVS",
        "model": "Jupiter 110",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 113.3,
        "transmission": "CVT Automatic",
        "available_years": [
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Sheet Metal Drum",
                "mrp": 74500,
                "id": "tvs-jupiter-110-sheet-metal-drum",
                "fuel_type": "petrol",
                "engine_cc": 113.3,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "ZX Drum Alloy iTouch",
                "mrp": 83000,
                "id": "tvs-jupiter-110-zx-drum-alloy-itouch",
                "fuel_type": "petrol",
                "engine_cc": 113.3,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "SmartXonnect Disc",
                "mrp": 88000,
                "id": "tvs-jupiter-110-smartxonnect-disc",
                "fuel_type": "petrol",
                "engine_cc": 113.3,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "tvs-jupiter-110"
    },
    {
        "brand": "TVS",
        "model": "Jupiter 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.8,
        "transmission": "CVT Automatic",
        "available_years": [
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Drum Steel",
                "mrp": 80000,
                "id": "tvs-jupiter-125-drum-steel",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Drum Alloy",
                "mrp": 83500,
                "id": "tvs-jupiter-125-drum-alloy",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Disc SmartXonnect TFT",
                "mrp": 91500,
                "id": "tvs-jupiter-125-disc-smartxonnect-tft",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "tvs-jupiter-125"
    },
    {
        "brand": "TVS",
        "model": "Ntorq 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.8,
        "transmission": "CVT Automatic",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Drum",
                "mrp": 85000,
                "id": "tvs-ntorq-125-drum",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Disc Bluetooth",
                "mrp": 90000,
                "id": "tvs-ntorq-125-disc-bluetooth",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Race Edition",
                "mrp": 94500,
                "id": "tvs-ntorq-125-race-edition",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Race XP (10.2 PS Dual Riding Modes)",
                "mrp": 98000,
                "id": "tvs-ntorq-125-race-xp-10-2-ps-dual-riding-modes",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "XT Connected TFT",
                "mrp": 105000,
                "id": "tvs-ntorq-125-xt-connected-tft",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "tvs-ntorq-125"
    },
    {
        "brand": "TVS",
        "model": "Apache RTR 160 4V",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 159.7,
        "transmission": "5-speed Manual",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Rear Drum Single ABS",
                "mrp": 124500,
                "id": "tvs-apache-rtr-160-4v-rear-drum-single-abs",
                "fuel_type": "petrol",
                "engine_cc": 159.7,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Rear Disc Bluetooth SmartXonnect",
                "mrp": 131500,
                "id": "tvs-apache-rtr-160-4v-rear-disc-bluetooth-smartxonnect",
                "fuel_type": "petrol",
                "engine_cc": 159.7,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Special Edition Bullpup Exhaust",
                "mrp": 133000,
                "id": "tvs-apache-rtr-160-4v-special-edition-bullpup-exhaust",
                "fuel_type": "petrol",
                "engine_cc": 159.7,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "tvs-apache-rtr-160-4v"
    },
    {
        "brand": "TVS",
        "model": "Apache RTR 200 4V",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 197.75,
        "transmission": "5-speed with Slipper Clutch & Riding Modes",
        "available_years": [
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Single Channel ABS Riding Modes",
                "mrp": 142000,
                "id": "tvs-apache-rtr-200-4v-single-channel-abs-riding-modes",
                "fuel_type": "petrol",
                "engine_cc": 197.75,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Dual Channel ABS with Showa Adjustable Suspension",
                "mrp": 148500,
                "id": "tvs-apache-rtr-200-4v-dual-channel-abs-with-showa-adjustable-suspension",
                "fuel_type": "petrol",
                "engine_cc": 197.75,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "tvs-apache-rtr-200-4v"
    },
    {
        "brand": "TVS",
        "model": "Raider 125",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 124.8,
        "transmission": "5-speed Manual",
        "available_years": [
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Drum",
                "mrp": 95500,
                "id": "tvs-raider-125-drum",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Single Disc",
                "mrp": 98000,
                "id": "tvs-raider-125-single-disc",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "SmartXonnect Color TFT",
                "mrp": 104000,
                "id": "tvs-raider-125-smartxonnect-color-tft",
                "fuel_type": "petrol",
                "engine_cc": 124.8,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "tvs-raider-125"
    },
    {
        "brand": "TVS",
        "model": "Ronin 225",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 225.9,
        "transmission": "5-speed with Assist & Slipper Clutch",
        "available_years": [
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "SS Single Channel ABS",
                "mrp": 149000,
                "id": "tvs-ronin-225-ss-single-channel-abs",
                "fuel_type": "petrol",
                "engine_cc": 225.9,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "DS Dual Channel ABS",
                "mrp": 156500,
                "id": "tvs-ronin-225-ds-dual-channel-abs",
                "fuel_type": "petrol",
                "engine_cc": 225.9,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "TD Triple Tone Connected",
                "mrp": 172000,
                "id": "tvs-ronin-225-td-triple-tone-connected",
                "fuel_type": "petrol",
                "engine_cc": 225.9,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "tvs-ronin-225"
    },
    {
        "brand": "TVS",
        "model": "iQube EV",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Direct Hub Drive",
        "available_years": [
            2020,
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Base 2.2 kWh (75 km Range)",
                "mrp": 110000,
                "id": "tvs-iqube-ev-base-2-2-kwh-75-km-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "iQube 3.4 kWh (100 km TrueRange)",
                "mrp": 136500,
                "id": "tvs-iqube-ev-iqube-3-4-kwh-100-km-truerange",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "iQube S 3.4 kWh TFT Connected",
                "mrp": 146500,
                "id": "tvs-iqube-ev-iqube-s-3-4-kwh-tft-connected",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "iQube ST 5.1 kWh Fast Charge (150 km Range)",
                "mrp": 185000,
                "id": "tvs-iqube-ev-iqube-st-5-1-kwh-fast-charge-150-km-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "tvs-iqube-ev"
    },
    {
        "brand": "Bajaj",
        "model": "Pulsar 150",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 149.5,
        "transmission": "5-speed Manual",
        "available_years": [
            2001,
            2002,
            2003,
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Single Disc ABS",
                "mrp": 113000,
                "id": "bajaj-pulsar-150-single-disc-abs",
                "fuel_type": "petrol",
                "engine_cc": 149.5,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Twin Disc ABS Split Seat",
                "mrp": 118500,
                "id": "bajaj-pulsar-150-twin-disc-abs-split-seat",
                "fuel_type": "petrol",
                "engine_cc": 149.5,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "bajaj-pulsar-150"
    },
    {
        "brand": "Bajaj",
        "model": "Pulsar NS200",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 199.5,
        "transmission": "6-speed Manual with Perimeter Frame",
        "available_years": [
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "BS4 Carburetor (Discontinued)",
                "mrp": 112000,
                "id": "bajaj-pulsar-ns200-bs4-carburetor-discontinued",
                "fuel_type": "petrol",
                "engine_cc": 199.5,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "BS6 Dual Channel ABS with USD Forks",
                "mrp": 149000,
                "id": "bajaj-pulsar-ns200-bs6-dual-channel-abs-with-usd-forks",
                "fuel_type": "petrol",
                "engine_cc": 199.5,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "bajaj-pulsar-ns200"
    },
    {
        "brand": "Bajaj",
        "model": "Pulsar 220F",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 220.0,
        "transmission": "5-speed Manual",
        "available_years": [
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Carb Dual Disc (Legacy)",
                "mrp": 98000,
                "id": "bajaj-pulsar-220f-carb-dual-disc-legacy",
                "fuel_type": "petrol",
                "engine_cc": 220.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "BS6 Single Channel ABS Projector",
                "mrp": 140000,
                "id": "bajaj-pulsar-220f-bs6-single-channel-abs-projector",
                "fuel_type": "petrol",
                "engine_cc": 220.0,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "bajaj-pulsar-220f"
    },
    {
        "brand": "Bajaj",
        "model": "Dominar 400",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 373.3,
        "transmission": "6-speed Manual with Slipper Clutch",
        "available_years": [
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Dual ABS Standard",
                "mrp": 225000,
                "id": "bajaj-dominar-400-dual-abs-standard",
                "fuel_type": "petrol",
                "engine_cc": 373.3,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Touring Edition (Tall Screen, Luggage Carrier, Handguards)",
                "mrp": 232000,
                "id": "bajaj-dominar-400-touring-edition-tall-screen-luggage-carrier-handguards",
                "fuel_type": "petrol",
                "engine_cc": 373.3,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "bajaj-dominar-400"
    },
    {
        "brand": "Bajaj",
        "model": "Avenger Cruise / Street 220",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 220.0,
        "transmission": "5-speed Manual",
        "available_years": [
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Cruise 220 Chrome with Windshield",
                "mrp": 144000,
                "id": "bajaj-avenger-cruise-street-220-cruise-220-chrome-with-windshield",
                "fuel_type": "petrol",
                "engine_cc": 220.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Street 160 Black Alloy",
                "mrp": 118000,
                "id": "bajaj-avenger-cruise-street-220-street-160-black-alloy",
                "fuel_type": "petrol",
                "engine_cc": 220.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "bajaj-avenger-cruise-street-220"
    },
    {
        "brand": "Bajaj",
        "model": "Platina 100 / 110",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 115.45,
        "transmission": "5-speed Manual with ComforTec",
        "available_years": [
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "100 ES Drum",
                "mrp": 67800,
                "id": "bajaj-platina-100-110-100-es-drum",
                "fuel_type": "petrol",
                "engine_cc": 115.45,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "110 ABS (Segment First ABS)",
                "mrp": 79800,
                "id": "bajaj-platina-100-110-110-abs-segment-first-abs",
                "fuel_type": "petrol",
                "engine_cc": 115.45,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "bajaj-platina-100-110"
    },
    {
        "brand": "Bajaj",
        "model": "Chetak EV",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Direct Metal Body",
        "available_years": [
            2020,
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Urbane 2.9 kWh",
                "mrp": 115000,
                "id": "bajaj-chetak-ev-urbane-2-9-kwh",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Premium 3.2 kWh with TecPac",
                "mrp": 135000,
                "id": "bajaj-chetak-ev-premium-3-2-kwh-with-tecpac",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "2901 Affordable Edition",
                "mrp": 96000,
                "id": "bajaj-chetak-ev-2901-affordable-edition",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "bajaj-chetak-ev"
    },
    {
        "brand": "Bajaj",
        "model": "Chetak 2-Stroke (Iconic Vintage Discontinued)",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 145.45,
        "transmission": "4-speed Handle Grip Shift",
        "available_years": [
            1980,
            1981,
            1982,
            1983,
            1984,
            1985,
            1986,
            1987,
            1988,
            1989,
            1990,
            1991,
            1992,
            1993,
            1994,
            1995,
            1996,
            1997,
            1998,
            1999,
            2000,
            2001,
            2002,
            2003,
            2004,
            2005
        ],
        "is_discontinued": True,
        "variants": [
            {
                "name": "12V Electronic Ignition Steel Body",
                "mrp": 32000,
                "id": "bajaj-chetak-2-stroke-iconic-vintage-discontinued-12v-electronic-ignition-steel-body",
                "fuel_type": "petrol",
                "engine_cc": 145.45,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "bajaj-chetak-2-stroke-iconic-vintage-discontinued"
    },
    {
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 349.34,
        "transmission": "5-speed Constant Mesh J-Series",
        "available_years": [
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "UCE 350 Twinspark (Older 2009-2021)",
                "mrp": 165000,
                "id": "royal-enfield-classic-350-uce-350-twinspark-older-2009-2021",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "J-Series Redditch Single ABS",
                "mrp": 193000,
                "id": "royal-enfield-classic-350-j-series-redditch-single-abs",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Halcyon Dual Channel ABS",
                "mrp": 199000,
                "id": "royal-enfield-classic-350-halcyon-dual-channel-abs",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Signals Dual Channel ABS",
                "mrp": 214000,
                "id": "royal-enfield-classic-350-signals-dual-channel-abs",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Dark Stealth Black Alloy Tubeless",
                "mrp": 221000,
                "id": "royal-enfield-classic-350-dark-stealth-black-alloy-tubeless",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Chrome Red / Bronze Dual ABS",
                "mrp": 225000,
                "id": "royal-enfield-classic-350-chrome-red-bronze-dual-abs",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "royal-enfield-classic-350"
    },
    {
        "brand": "Royal Enfield",
        "model": "Hunter 350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 349.34,
        "transmission": "5-speed Manual",
        "available_years": [
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Retro Factory Spoke Single ABS",
                "mrp": 149900,
                "id": "royal-enfield-hunter-350-retro-factory-spoke-single-abs",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Metro Dapper Dual ABS Alloy",
                "mrp": 169500,
                "id": "royal-enfield-hunter-350-metro-dapper-dual-abs-alloy",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Metro Rebel Dual Tone Alloy",
                "mrp": 174500,
                "id": "royal-enfield-hunter-350-metro-rebel-dual-tone-alloy",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "royal-enfield-hunter-350"
    },
    {
        "brand": "Royal Enfield",
        "model": "Bullet 350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 349.34,
        "transmission": "5-speed Manual",
        "available_years": [
            1990,
            1991,
            1992,
            1993,
            1994,
            1995,
            1996,
            1997,
            1998,
            1999,
            2000,
            2001,
            2002,
            2003,
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Standard Cast Iron Heavy Crank (Vintage)",
                "mrp": 85000,
                "id": "royal-enfield-bullet-350-standard-cast-iron-heavy-crank-vintage",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Bullet 350 ES Electra UCE",
                "mrp": 145000,
                "id": "royal-enfield-bullet-350-bullet-350-es-electra-uce",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "New J-Series Military Red/Black",
                "mrp": 174000,
                "id": "royal-enfield-bullet-350-new-j-series-military-red-black",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "New J-Series Standard Black/Maroon",
                "mrp": 198000,
                "id": "royal-enfield-bullet-350-new-j-series-standard-black-maroon",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Black Gold Dual ABS",
                "mrp": 216000,
                "id": "royal-enfield-bullet-350-black-gold-dual-abs",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "royal-enfield-bullet-350"
    },
    {
        "brand": "Royal Enfield",
        "model": "Meteor 350",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 349.34,
        "transmission": "5-speed Manual with Tripper Nav",
        "available_years": [
            2020,
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Fireball Dual ABS",
                "mrp": 206000,
                "id": "royal-enfield-meteor-350-fireball-dual-abs",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Stellar with Pillion Backrest",
                "mrp": 216000,
                "id": "royal-enfield-meteor-350-stellar-with-pillion-backrest",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Supernova Dual Tone with Windshield",
                "mrp": 230000,
                "id": "royal-enfield-meteor-350-supernova-dual-tone-with-windshield",
                "fuel_type": "petrol",
                "engine_cc": 349.34,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "royal-enfield-meteor-350"
    },
    {
        "brand": "Royal Enfield",
        "model": "Himalayan",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 451.65,
        "transmission": "6-speed with Ride-by-Wire (Sherpa 450)",
        "available_years": [
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Himalayan 411 LS410 (Discontinued)",
                "mrp": 215000,
                "id": "royal-enfield-himalayan-himalayan-411-ls410-discontinued",
                "fuel_type": "petrol",
                "engine_cc": 451.65,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Himalayan 450 Base Kaza Brown",
                "mrp": 285000,
                "id": "royal-enfield-himalayan-himalayan-450-base-kaza-brown",
                "fuel_type": "petrol",
                "engine_cc": 451.65,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Himalayan 450 Pass Slate",
                "mrp": 289000,
                "id": "royal-enfield-himalayan-himalayan-450-pass-slate",
                "fuel_type": "petrol",
                "engine_cc": 451.65,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Himalayan 450 Summit Hanle Black Tubeless Spoke",
                "mrp": 298000,
                "id": "royal-enfield-himalayan-himalayan-450-summit-hanle-black-tubeless-spoke",
                "fuel_type": "petrol",
                "engine_cc": 451.65,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "royal-enfield-himalayan"
    },
    {
        "brand": "Royal Enfield",
        "model": "Interceptor 650",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 647.95,
        "transmission": "6-speed Parallel Twin with Slipper Clutch",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Canyon Red Spoke Wheel",
                "mrp": 303000,
                "id": "royal-enfield-interceptor-650-canyon-red-spoke-wheel",
                "fuel_type": "petrol",
                "engine_cc": 647.95,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Black Ray Alloy Wheel Tubeless",
                "mrp": 321000,
                "id": "royal-enfield-interceptor-650-black-ray-alloy-wheel-tubeless",
                "fuel_type": "petrol",
                "engine_cc": 647.95,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Mark 2 Chrome Edition",
                "mrp": 331000,
                "id": "royal-enfield-interceptor-650-mark-2-chrome-edition",
                "fuel_type": "petrol",
                "engine_cc": 647.95,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "royal-enfield-interceptor-650"
    },
    {
        "brand": "Royal Enfield",
        "model": "Continental GT 650",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 647.95,
        "transmission": "6-speed Cafe Racer Clip-ons",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Rocker Red Spoke",
                "mrp": 319000,
                "id": "royal-enfield-continental-gt-650-rocker-red-spoke",
                "fuel_type": "petrol",
                "engine_cc": 647.95,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Apex Grey Alloy Wheel",
                "mrp": 339000,
                "id": "royal-enfield-continental-gt-650-apex-grey-alloy-wheel",
                "fuel_type": "petrol",
                "engine_cc": 647.95,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Mister Clean Triple Chrome",
                "mrp": 345000,
                "id": "royal-enfield-continental-gt-650-mister-clean-triple-chrome",
                "fuel_type": "petrol",
                "engine_cc": 647.95,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "royal-enfield-continental-gt-650"
    },
    {
        "brand": "Yamaha",
        "model": "YZF R15 V4 / V3 / V2",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 155.0,
        "transmission": "6-speed Manual with VVA & Assist Slipper Clutch",
        "available_years": [
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "R15 V2 Dual Headlamp (Legacy Discontinued)",
                "mrp": 118000,
                "id": "yamaha-yzf-r15-v4-v3-v2-r15-v2-dual-headlamp-legacy-discontinued",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "R15 V3 Dual ABS (Legacy Discontinued)",
                "mrp": 155000,
                "id": "yamaha-yzf-r15-v4-v3-v2-r15-v3-dual-abs-legacy-discontinued",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "R15S V3 Unibody Seat",
                "mrp": 166000,
                "id": "yamaha-yzf-r15-v4-v3-v2-r15s-v3-unibody-seat",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "R15 V4 Metallic Red Dual ABS",
                "mrp": 183000,
                "id": "yamaha-yzf-r15-v4-v3-v2-r15-v4-metallic-red-dual-abs",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "R15 V4 Racing Blue Quickshifter",
                "mrp": 188000,
                "id": "yamaha-yzf-r15-v4-v3-v2-r15-v4-racing-blue-quickshifter",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "R15M Silver Carbon with TFT Display",
                "mrp": 198000,
                "id": "yamaha-yzf-r15-v4-v3-v2-r15m-silver-carbon-with-tft-display",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "yamaha-yzf-r15-v4-v3-v2"
    },
    {
        "brand": "Yamaha",
        "model": "MT-15 V2",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 155.0,
        "transmission": "6-speed Manual with USD Forks",
        "available_years": [
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "V1 Single ABS (Discontinued)",
                "mrp": 145000,
                "id": "yamaha-mt-15-v2-v1-single-abs-discontinued",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "V2 Dual Channel ABS Traction Control",
                "mrp": 168000,
                "id": "yamaha-mt-15-v2-v2-dual-channel-abs-traction-control",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "V2 Deluxe Metallic Black / Ice Fluo",
                "mrp": 173500,
                "id": "yamaha-mt-15-v2-v2-deluxe-metallic-black-ice-fluo",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "yamaha-mt-15-v2"
    },
    {
        "brand": "Yamaha",
        "model": "FZ-S FI V3 / V4",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 149.0,
        "transmission": "5-speed Manual",
        "available_years": [
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "FZ V2 Carb/FI (Legacy)",
                "mrp": 87000,
                "id": "yamaha-fz-s-fi-v3-v4-fz-v2-carb-fi-legacy",
                "fuel_type": "petrol",
                "engine_cc": 149.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "FZ-S V3 Single Channel ABS",
                "mrp": 121000,
                "id": "yamaha-fz-s-fi-v3-v4-fz-s-v3-single-channel-abs",
                "fuel_type": "petrol",
                "engine_cc": 149.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "FZ-S V4 Deluxe Traction Control LED",
                "mrp": 130000,
                "id": "yamaha-fz-s-fi-v3-v4-fz-s-v4-deluxe-traction-control-led",
                "fuel_type": "petrol",
                "engine_cc": 149.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "yamaha-fz-s-fi-v3-v4"
    },
    {
        "brand": "Yamaha",
        "model": "Aerox 155",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 155.0,
        "transmission": "CVT Automatic with Liquid Cooled VVA",
        "available_years": [
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Standard Single Channel ABS",
                "mrp": 148500,
                "id": "yamaha-aerox-155-standard-single-channel-abs",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "MotoGP Monster Energy Edition",
                "mrp": 153500,
                "id": "yamaha-aerox-155-motogp-monster-energy-edition",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "yamaha-aerox-155"
    },
    {
        "brand": "Yamaha",
        "model": "RayZR 125 Fi Hybrid",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 125.0,
        "transmission": "CVT Automatic with Electric SMG Assist",
        "available_years": [
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Drum Hybrid",
                "mrp": 85500,
                "id": "yamaha-rayzr-125-fi-hybrid-drum-hybrid",
                "fuel_type": "petrol",
                "engine_cc": 125.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Disc Hybrid Bluetooth",
                "mrp": 91500,
                "id": "yamaha-rayzr-125-fi-hybrid-disc-hybrid-bluetooth",
                "fuel_type": "petrol",
                "engine_cc": 125.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Street Rally Edition with Knuckle Guards",
                "mrp": 96000,
                "id": "yamaha-rayzr-125-fi-hybrid-street-rally-edition-with-knuckle-guards",
                "fuel_type": "petrol",
                "engine_cc": 125.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "yamaha-rayzr-125-fi-hybrid"
    },
    {
        "brand": "Yamaha",
        "model": "RX 100 (Legendary 2-Stroke Discontinued)",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 98.0,
        "transmission": "4-speed Manual 2-Stroke Reed Valve",
        "available_years": [
            1985,
            1986,
            1987,
            1988,
            1989,
            1990,
            1991,
            1992,
            1993,
            1994,
            1995
        ],
        "is_discontinued": True,
        "variants": [
            {
                "name": "Made In Japan Escorts Original",
                "mrp": 19500,
                "id": "yamaha-rx-100-legendary-2-stroke-discontinued-made-in-japan-escorts-original",
                "fuel_type": "petrol",
                "engine_cc": 98.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "yamaha-rx-100-legendary-2-stroke-discontinued"
    },
    {
        "brand": "Suzuki",
        "model": "Access 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.0,
        "transmission": "CVT Automatic with SEP",
        "available_years": [
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Drum Brake Steel Wheels",
                "mrp": 79800,
                "id": "suzuki-access-125-drum-brake-steel-wheels",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Drum Alloy Wheel",
                "mrp": 83500,
                "id": "suzuki-access-125-drum-alloy-wheel",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Disc Brake Alloy Wheel",
                "mrp": 86800,
                "id": "suzuki-access-125-disc-brake-alloy-wheel",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Special Edition Ride Connect Bluetooth",
                "mrp": 90500,
                "id": "suzuki-access-125-special-edition-ride-connect-bluetooth",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "suzuki-access-125"
    },
    {
        "brand": "Suzuki",
        "model": "Burgman Street 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.0,
        "transmission": "CVT Automatic Maxi-Scooter",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Standard Disc",
                "mrp": 94500,
                "id": "suzuki-burgman-street-125-standard-disc",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Ride Connect Bluetooth",
                "mrp": 98500,
                "id": "suzuki-burgman-street-125-ride-connect-bluetooth",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Burgman Street EX (12-inch Rear Wheel & Auto Start-Stop)",
                "mrp": 114500,
                "id": "suzuki-burgman-street-125-burgman-street-ex-12-inch-rear-wheel-auto-start-stop",
                "fuel_type": "petrol",
                "engine_cc": 124.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "suzuki-burgman-street-125"
    },
    {
        "brand": "Suzuki",
        "model": "Gixxer 150 / SF 150",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 155.0,
        "transmission": "5-speed Manual",
        "available_years": [
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Gixxer Naked Single ABS",
                "mrp": 134500,
                "id": "suzuki-gixxer-150-sf-150-gixxer-naked-single-abs",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Gixxer SF Aerodynamic Fairing Single ABS",
                "mrp": 145500,
                "id": "suzuki-gixxer-150-sf-150-gixxer-sf-aerodynamic-fairing-single-abs",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "Gixxer SF Ride Connect Bluetooth",
                "mrp": 147500,
                "id": "suzuki-gixxer-150-sf-150-gixxer-sf-ride-connect-bluetooth",
                "fuel_type": "petrol",
                "engine_cc": 155.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "suzuki-gixxer-150-sf-150"
    },
    {
        "brand": "KTM",
        "model": "Duke 200",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 199.5,
        "transmission": "6-speed Manual Trellis Frame",
        "available_years": [
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "BS3 Underbelly Exhaust (Legacy)",
                "mrp": 135000,
                "id": "ktm-duke-200-bs3-underbelly-exhaust-legacy",
                "fuel_type": "petrol",
                "engine_cc": 199.5,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Dual Channel ABS SuperMoto Mode LED",
                "mrp": 198000,
                "id": "ktm-duke-200-dual-channel-abs-supermoto-mode-led",
                "fuel_type": "petrol",
                "engine_cc": 199.5,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "ktm-duke-200"
    },
    {
        "brand": "KTM",
        "model": "Duke 390",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 398.63,
        "transmission": "6-speed with Quickshifter+, Launch Control, Cornering ABS",
        "available_years": [
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Gen 1 (2013-2016 Legacy)",
                "mrp": 185000,
                "id": "ktm-duke-390-gen-1-2013-2016-legacy",
                "fuel_type": "petrol",
                "engine_cc": 398.63,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Gen 2 TFT Screen (2017-2023)",
                "mrp": 295000,
                "id": "ktm-duke-390-gen-2-tft-screen-2017-2023",
                "fuel_type": "petrol",
                "engine_cc": 398.63,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Gen 3 (399cc LC4c Engine, 45.3 bhp)",
                "mrp": 312000,
                "id": "ktm-duke-390-gen-3-399cc-lc4c-engine-45-3-bhp",
                "fuel_type": "petrol",
                "engine_cc": 398.63,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "ktm-duke-390"
    },
    {
        "brand": "KTM",
        "model": "RC 200",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 199.5,
        "transmission": "6-speed Manual Track Clip-ons",
        "available_years": [
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Twin Projector Gen 1 (Discontinued)",
                "mrp": 172000,
                "id": "ktm-rc-200-twin-projector-gen-1-discontinued",
                "fuel_type": "petrol",
                "engine_cc": 199.5,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Gen 2 Dual Channel ABS Foldable Levers",
                "mrp": 218000,
                "id": "ktm-rc-200-gen-2-dual-channel-abs-foldable-levers",
                "fuel_type": "petrol",
                "engine_cc": 199.5,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "ktm-rc-200"
    },
    {
        "brand": "Ather Energy",
        "model": "450X",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Direct Belt Drive (PMSM 6kW)",
        "available_years": [
            2020,
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Gen 1 (2.9 kWh)",
                "mrp": 145000,
                "id": "ather-energy-450x-gen-1-2-9-kwh",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Gen 2 (2.9 kWh 4G SIM)",
                "mrp": 150000,
                "id": "ather-energy-450x-gen-2-2-9-kwh-4g-sim",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Gen 3 (3.7 kWh 111 km TrueRange)",
                "mrp": 158000,
                "id": "ather-energy-450x-gen-3-3-7-kwh-111-km-truerange",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Gen 3 Pro Pack with Warp Mode & Google Maps",
                "mrp": 169000,
                "id": "ather-energy-450x-gen-3-pro-pack-with-warp-mode-google-maps",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "ather-energy-450x"
    },
    {
        "brand": "Ather Energy",
        "model": "450S",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Direct Belt Drive",
        "available_years": [
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "2.9 kWh DeepView Display (90 km TrueRange)",
                "mrp": 126000,
                "id": "ather-energy-450s-2-9-kwh-deepview-display-90-km-truerange",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "450S with Pro Pack",
                "mrp": 136000,
                "id": "ather-energy-450s-450s-with-pro-pack",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "ather-energy-450s"
    },
    {
        "brand": "Ather Energy",
        "model": "Rizta",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Family Comfort Scooter",
        "available_years": [
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "S 2.9 kWh (105 km IDC Range)",
                "mrp": 110000,
                "id": "ather-energy-rizta-s-2-9-kwh-105-km-idc-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Z 2.9 kWh Backrest & SkidControl",
                "mrp": 125000,
                "id": "ather-energy-rizta-z-2-9-kwh-backrest-skidcontrol",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Z 3.7 kWh Long Range (160 km IDC Range)",
                "mrp": 145000,
                "id": "ather-energy-rizta-z-3-7-kwh-long-range-160-km-idc-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "ather-energy-rizta"
    },
    {
        "brand": "Ola Electric",
        "model": "S1 Pro",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Mid-Drive IPM",
        "available_years": [
            2021,
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Gen 1 (3.97 kWh Single Front Fork)",
                "mrp": 139000,
                "id": "ola-electric-s1-pro-gen-1-3-97-kwh-single-front-fork",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Gen 2 (4.0 kWh Dual Telescopic Fork, 11 kW Peak)",
                "mrp": 147500,
                "id": "ola-electric-s1-pro-gen-2-4-0-kwh-dual-telescopic-fork-11-kw-peak",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "ola-electric-s1-pro"
    },
    {
        "brand": "Ola Electric",
        "model": "S1 Air",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Hub Motor",
        "available_years": [
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "3 kWh (151 km Certified IDC Range)",
                "mrp": 105000,
                "id": "ola-electric-s1-air-3-kwh-151-km-certified-idc-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "ola-electric-s1-air"
    },
    {
        "brand": "Ola Electric",
        "model": "S1 X",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Physical Key Drive",
        "available_years": [
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "S1 X (2 kWh Battery)",
                "mrp": 74999,
                "id": "ola-electric-s1-x-s1-x-2-kwh-battery",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "S1 X (3 kWh Battery)",
                "mrp": 87999,
                "id": "ola-electric-s1-x-s1-x-3-kwh-battery",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "S1 X (4 kWh Battery 190 km Range)",
                "mrp": 101999,
                "id": "ola-electric-s1-x-s1-x-4-kwh-battery-190-km-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "S1 X Plus (3 kWh Keyless Display)",
                "mrp": 89999,
                "id": "ola-electric-s1-x-s1-x-plus-3-kwh-keyless-display",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "ola-electric-s1-x"
    },
    {
        "brand": "Triumph",
        "model": "Speed 400",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 398.15,
        "transmission": "6-speed with Slipper Clutch (40 PS / 37.5 Nm)",
        "available_years": [
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Standard Dual Channel ABS Traction Control",
                "mrp": 234000,
                "id": "triumph-speed-400-standard-dual-channel-abs-traction-control",
                "fuel_type": "petrol",
                "engine_cc": 398.15,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "triumph-speed-400"
    },
    {
        "brand": "Triumph",
        "model": "Scrambler 400 X",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 398.15,
        "transmission": "6-speed with 19-inch Front Wheel",
        "available_years": [
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Standard Switchable ABS Handguards",
                "mrp": 264000,
                "id": "triumph-scrambler-400-x-standard-switchable-abs-handguards",
                "fuel_type": "petrol",
                "engine_cc": 398.15,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "triumph-scrambler-400-x"
    },
    {
        "brand": "Harley-Davidson",
        "model": "X440",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 440.0,
        "transmission": "6-speed Manual Single Cylinder (38 Nm)",
        "available_years": [
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Denim (Spoke Wheels)",
                "mrp": 239500,
                "id": "harley-davidson-x440-denim-spoke-wheels",
                "fuel_type": "petrol",
                "engine_cc": 440.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Vivid (Alloy Wheels)",
                "mrp": 259500,
                "id": "harley-davidson-x440-vivid-alloy-wheels",
                "fuel_type": "petrol",
                "engine_cc": 440.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "S (Diamond Cut Alloys, e-SIM Connected TFT)",
                "mrp": 279500,
                "id": "harley-davidson-x440-s-diamond-cut-alloys-e-sim-connected-tft",
                "fuel_type": "petrol",
                "engine_cc": 440.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "harley-davidson-x440"
    },
    {
        "brand": "Harley-Davidson",
        "model": "Street 750 (Iconic Discontinued)",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 749.0,
        "transmission": "6-speed Liquid Cooled V-Twin Revolution X",
        "available_years": [
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020
        ],
        "is_discontinued": True,
        "variants": [
            {
                "name": "Standard Dual Disc",
                "mrp": 534000,
                "id": "harley-davidson-street-750-iconic-discontinued-standard-dual-disc",
                "fuel_type": "petrol",
                "engine_cc": 749.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "ABS Edition Vivid Black",
                "mrp": 580000,
                "id": "harley-davidson-street-750-iconic-discontinued-abs-edition-vivid-black",
                "fuel_type": "petrol",
                "engine_cc": 749.0,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "harley-davidson-street-750-iconic-discontinued"
    },
    {
        "brand": "Jawa",
        "model": "Jawa 350 / Classic",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 334.0,
        "transmission": "6-speed Manual DOHC",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Single Channel ABS (Older)",
                "mrp": 173000,
                "id": "jawa-jawa-350-classic-single-channel-abs-older",
                "fuel_type": "petrol",
                "engine_cc": 334.0,
                "battery_kwh": 0,
                "has_abs": True
            },
            {
                "name": "New Jawa 350 Dual Channel ABS Spoke",
                "mrp": 214500,
                "id": "jawa-jawa-350-classic-new-jawa-350-dual-channel-abs-spoke",
                "fuel_type": "petrol",
                "engine_cc": 334.0,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "jawa-jawa-350-classic"
    },
    {
        "brand": "Jawa",
        "model": "42 / 42 Bobber",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 334.0,
        "transmission": "6-speed Manual",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Jawa 42 2.1 Alloy Wheel",
                "mrp": 198000,
                "id": "jawa-42-42-bobber-jawa-42-2-1-alloy-wheel",
                "fuel_type": "petrol",
                "engine_cc": 334.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "42 Bobber Single Floating Seat",
                "mrp": 225000,
                "id": "jawa-42-42-bobber-42-bobber-single-floating-seat",
                "fuel_type": "petrol",
                "engine_cc": 334.0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "jawa-42-42-bobber"
    },
    {
        "brand": "Yezdi",
        "model": "Roadster",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 334.0,
        "transmission": "6-speed Manual (29.7 bhp / 29 Nm)",
        "available_years": [
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Dark Smoke Grey Alloy",
                "mrp": 206000,
                "id": "yezdi-roadster-dark-smoke-grey-alloy",
                "fuel_type": "petrol",
                "engine_cc": 334.0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Chrome Dual Tone",
                "mrp": 212500,
                "id": "yezdi-roadster-chrome-dual-tone",
                "fuel_type": "petrol",
                "engine_cc": 334.0,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "yezdi-roadster"
    },
    {
        "brand": "Revolt",
        "model": "RV400",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Belt Drive with Synthetic Sound Synthesizer",
        "available_years": [
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "RV400 BRZ (Affordable 150 km Eco)",
                "mrp": 128000,
                "id": "revolt-rv400-rv400-brz-affordable-150-km-eco",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "RV400 Premium Connected (3.24 kWh Swappable Battery)",
                "mrp": 139000,
                "id": "revolt-rv400-rv400-premium-connected-3-24-kwh-swappable-battery",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "revolt-rv400"
    },
    {
        "brand": "Ultraviolette",
        "model": "F77 Mach 2",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Direct Drive High Performance (30 kW / 100 Nm)",
        "available_years": [
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "F77 Mach 2 Standard (7.1 kWh 211 km IDC)",
                "mrp": 299000,
                "id": "ultraviolette-f77-mach-2-f77-mach-2-standard-7-1-kwh-211-km-idc",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "F77 Mach 2 Recon (10.3 kWh 323 km IDC, 40.2 bhp)",
                "mrp": 399000,
                "id": "ultraviolette-f77-mach-2-f77-mach-2-recon-10-3-kwh-323-km-idc-40-2-bhp",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "ultraviolette-f77-mach-2"
    },
    {
        "brand": "Vida",
        "model": "V1 Pro / Plus",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Dual Removable Batteries",
        "available_years": [
            2022,
            2023,
            2024,
            2025,
            2026
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "V1 Plus (3.44 kWh)",
                "mrp": 120000,
                "id": "vida-v1-pro-plus-v1-plus-3-44-kwh",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "V1 Pro (3.94 kWh 110 km TrueRange)",
                "mrp": 145000,
                "id": "vida-v1-pro-plus-v1-pro-3-94-kwh-110-km-truerange",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "vida-v1-pro-plus"
    },
    {
        "brand": "Ampere",
        "model": "Magnus EX / Nexus",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Hub Drive",
        "available_years": [
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "Magnus EX (2.3 kWh 80-100 km Range)",
                "mrp": 84500,
                "id": "ampere-magnus-ex-nexus-magnus-ex-2-3-kwh-80-100-km-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "Nexus LFP Battery Mid-Mount",
                "mrp": 110000,
                "id": "ampere-magnus-ex-nexus-nexus-lfp-battery-mid-mount",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            }
        ],
        "id": "ampere-magnus-ex-nexus"
    },
    {
        "brand": "Hero Electric",
        "model": "Optima CX",
        "category": "electric",
        "fuel_type": "electric",
        "engine_cc": 0,
        "transmission": "Automatic Hub Motor",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024
        ],
        "is_discontinued": False,
        "variants": [
            {
                "name": "CX Single Battery (82 km Range)",
                "mrp": 67000,
                "id": "hero-electric-optima-cx-cx-single-battery-82-km-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": False
            },
            {
                "name": "CX 2.0 Dual Battery (140 km Range)",
                "mrp": 85000,
                "id": "hero-electric-optima-cx-cx-2-0-dual-battery-140-km-range",
                "fuel_type": "electric",
                "engine_cc": 0,
                "battery_kwh": 0,
                "has_abs": True
            }
        ],
        "id": "hero-electric-optima-cx"
    },
    {
        "id": "kawasaki-ninja-300",
        "brand": "Kawasaki",
        "model": "Ninja 300",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 296.0,
        "transmission": "6-speed Manual with Slipper Clutch",
        "available_years": [
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "id": "kawasaki-ninja-300-dual-abs",
                "name": "Dual Channel ABS Standard",
                "mrp": 343000,
                "fuel_type": "petrol",
                "engine_cc": 296.0,
                "has_abs": True
            },
            {
                "id": "kawasaki-ninja-300-special-edition",
                "name": "KRT Special Edition Graphics",
                "mrp": 355000,
                "fuel_type": "petrol",
                "engine_cc": 296.0,
                "has_abs": True
            }
        ]
    },
    {
        "id": "kawasaki-z650",
        "brand": "Kawasaki",
        "model": "Z650",
        "category": "motorcycle",
        "fuel_type": "petrol",
        "engine_cc": 649.0,
        "transmission": "6-speed Manual",
        "available_years": [
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "id": "kawasaki-z650-standard",
                "name": "Standard Dual Channel ABS",
                "mrp": 665000,
                "fuel_type": "petrol",
                "engine_cc": 649.0,
                "has_abs": True
            }
        ]
    },
    {
        "id": "vespa-vxl-125",
        "brand": "Vespa",
        "model": "VXL 125",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 124.5,
        "transmission": "CVT Automatic",
        "available_years": [
            2015,
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "id": "vespa-vxl-125-disc-cbs",
                "name": "Front Disc CBS Alloy",
                "mrp": 132000,
                "fuel_type": "petrol",
                "engine_cc": 124.5,
                "has_abs": False
            },
            {
                "id": "vespa-vxl-125-drum",
                "name": "Drum Brake Alloy",
                "mrp": 122000,
                "fuel_type": "petrol",
                "engine_cc": 124.5,
                "has_abs": False
            }
        ]
    },
    {
        "id": "vespa-sxl-150",
        "brand": "Vespa",
        "model": "SXL 150",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 149.5,
        "transmission": "CVT Automatic",
        "available_years": [
            2016,
            2017,
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "id": "vespa-sxl-150-abs",
                "name": "Single Channel ABS Alloy",
                "mrp": 148000,
                "fuel_type": "petrol",
                "engine_cc": 149.5,
                "has_abs": True
            },
            {
                "id": "vespa-sxl-150-racing-sixties",
                "name": "Racing Sixties Special Edition",
                "mrp": 156000,
                "fuel_type": "petrol",
                "engine_cc": 149.5,
                "has_abs": True
            }
        ]
    },
    {
        "id": "aprilia-sr-160",
        "brand": "Aprilia",
        "model": "SR 160",
        "category": "scooter",
        "fuel_type": "petrol",
        "engine_cc": 160.0,
        "transmission": "CVT Automatic",
        "available_years": [
            2018,
            2019,
            2020,
            2021,
            2022,
            2023,
            2024,
            2025
        ],
        "is_discontinued": False,
        "variants": [
            {
                "id": "aprilia-sr-160-standard-abs",
                "name": "Single Channel ABS Alloy",
                "mrp": 132000,
                "fuel_type": "petrol",
                "engine_cc": 160.0,
                "has_abs": True
            },
            {
                "id": "aprilia-sr-160-carbon",
                "name": "Carbon Special Edition ABS",
                "mrp": 138000,
                "fuel_type": "petrol",
                "engine_cc": 160.0,
                "has_abs": True
            }
        ]
    }
]

def normalize_brand(brand_input: str) -> str:
    clean = str(brand_input or "").strip().lower()
    return BRAND_ALIASES.get(clean, brand_input.strip() if brand_input else "Royal Enfield")

def get_all_categories() -> List[str]:
    return ["motorcycle", "scooter", "electric"]

def get_brands_by_category(category: Optional[str] = None) -> List[str]:
    brands = set()
    cat_clean = category.lower().strip() if category and category != "all" else None
    for v in INDIAN_TWO_WHEELER_DATABASE:
        if not cat_clean or v["category"].lower() == cat_clean:
            brands.add(v["brand"])
    return sorted(list(brands))

def get_models_by_brand(brand: str, category: Optional[str] = None) -> List[Dict[str, Any]]:
    canonical_brand = normalize_brand(brand).lower()
    cat_clean = category.lower().strip() if category and category != "all" else None
    models = []
    seen_model_names = set()
    for v in INDIAN_TWO_WHEELER_DATABASE:
        v_brand_norm = normalize_brand(v["brand"]).lower()
        if v_brand_norm == canonical_brand or canonical_brand in v_brand_norm:
            if not cat_clean or v["category"].lower() == cat_clean:
                if v["model"] not in seen_model_names:
                    seen_model_names.add(v["model"])
                    models.append({
                        "id": v.get("id", ""),
                        "model": v["model"],
                        "brand": v["brand"],
                        "category": v["category"],
                        "fuel_type": v["fuel_type"],
                        "engine_cc": v.get("engine_cc", 0),
                        "transmission": v.get("transmission", ""),
                        "available_years": v.get("available_years", []),
                        "is_discontinued": v.get("is_discontinued", False),
                        "variants": v.get("variants", [])
                    })
    return models

def get_vehicle_by_id(vehicle_id: str) -> Optional[Dict[str, Any]]:
    vid = str(vehicle_id or "").strip().lower()
    for v in INDIAN_TWO_WHEELER_DATABASE:
        if v.get("id", "").lower() == vid:
            return v
    return None

def get_vehicle_entry(brand: str, model: str) -> Optional[Dict[str, Any]]:
    b_norm = normalize_brand(brand).lower()
    m_clean = str(model or "").lower().strip()
    for v in INDIAN_TWO_WHEELER_DATABASE:
        v_brand_norm = normalize_brand(v["brand"]).lower()
        v_model_norm = v["model"].lower().strip()
        if (v_brand_norm == b_norm or b_norm in v_brand_norm) and (v_model_norm == m_clean or m_clean in v_model_norm or v_model_norm in m_clean):
            return v
    return None

def lookup_variant_mrp(brand: str, model: str, variant: Optional[str] = None) -> float:
    entry = get_vehicle_entry(brand, model)
    if entry:
        variants = entry.get("variants", [])
        if variant:
            v_clean = variant.lower().strip()
            for var in variants:
                if var.get("id", "").lower() == v_clean or v_clean in var["name"].lower() or var["name"].lower() in v_clean:
                    return float(var.get("mrp", 100000))
        if variants:
            return float(variants[0].get("mrp", 100000))
    return 115000.0
