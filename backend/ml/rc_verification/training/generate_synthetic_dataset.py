"""
Synthetic Indian Vehicle Document Dataset Generator for GEAR UP
Generates accurately labeled training, validation, and test datasets for:
- Document Type Classification (RC, Insurance, PUC, Other, Unreadable)
- Document Anomaly & Risk Detection
- Structured Field Extraction Testing

Strict Data Privacy:
All owner names, registration numbers, chassis numbers, and engine numbers
are fictionalized / synthetic to comply with Indian data privacy standards.
"""

import os
import json
import random
import hashlib
from typing import Dict, Any, List

DATASET_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(DATASET_ROOT, "datasets")
RAW_DIR = os.path.join(DATASETS_DIR, "raw")
ANNOTATIONS_DIR = os.path.join(DATASETS_DIR, "annotations")
TRAIN_DIR = os.path.join(DATASETS_DIR, "train")
VAL_DIR = os.path.join(DATASETS_DIR, "validation")
TEST_DIR = os.path.join(DATASETS_DIR, "test")

# Seed for absolute reproducibility
random.seed(42)

INDIAN_STATES = [
    ("CH", "Chandigarh", "RTO Chandigarh Sector 17"),
    ("DL", "Delhi", "RTO Sheikh Sarai South Delhi"),
    ("MH", "Maharashtra", "RTO Andheri Mumbai West"),
    ("KA", "Karnataka", "RTO Indiranagar Bengaluru East"),
    ("TN", "Tamil Nadu", "RTO Chennai Central"),
    ("HR", "Haryana", "RTO Gurugram Sector 32"),
    ("PB", "Punjab", "RTO SAS Nagar Mohali"),
    ("UP", "Uttar Pradesh", "RTO Noida Sector 32"),
    ("TS", "Telangana", "RTO Khairatabad Hyderabad"),
    ("GJ", "Gujarat", "RTO Ahmedabad Subhash Bridge")
]

VEHICLE_CATALOG = [
    {"brand": "Royal Enfield", "model": "Classic 350", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 349},
    {"brand": "Royal Enfield", "model": "Hunter 350", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 349},
    {"brand": "Royal Enfield", "model": "Bullet 350", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 346},
    {"brand": "Hero MotoCorp", "model": "Splendor Plus", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 97},
    {"brand": "Hero MotoCorp", "model": "HF Deluxe", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 97},
    {"brand": "Honda", "model": "Activa 6G", "category": "2W - Scooter", "fuel": "PETROL", "cc": 109},
    {"brand": "Honda", "model": "Shine 125", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 124},
    {"brand": "TVS", "model": "Jupiter 110", "category": "2W - Scooter", "fuel": "PETROL", "cc": 109},
    {"brand": "TVS", "model": "Apache RTR 160 4V", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 159},
    {"brand": "TVS", "model": "Raider 125", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 124},
    {"brand": "Bajaj", "model": "Pulsar 150", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 149},
    {"brand": "Bajaj", "model": "Pulsar NS200", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 199},
    {"brand": "Yamaha", "model": "YZF R15 V4", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 155},
    {"brand": "Yamaha", "model": "MT-15 V2", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 155},
    {"brand": "Suzuki", "model": "Access 125", "category": "2W - Scooter", "fuel": "PETROL", "cc": 124},
    {"brand": "KTM", "model": "Duke 200", "category": "2W - Motorcycle", "fuel": "PETROL", "cc": 199},
    {"brand": "Ather Energy", "model": "450X Gen 3", "category": "2W - Scooter", "fuel": "ELECTRIC", "cc": 0},
    {"brand": "Ola Electric", "model": "S1 Pro Gen 2", "category": "2W - Scooter", "fuel": "ELECTRIC", "cc": 0}
]

FICTIONAL_NAMES = [
    "Vikramjit Singh", "Amit Kumar Sharma", "Pooja Verma", "Rajesh Patel", "Sneha Kulkarni",
    "Mohammed Farhan", "Arjun Nambiar", "Sunita Devi", "Gurpreet Kaur", "Karan Malhotra",
    "Deepak Joshi", "Ritu Sengupta", "Venkatesh Rao", "Manish Tiwari", "Ananya Deshmukh"
]

INSURANCE_PROVIDERS = [
    "HDFC ERGO General Insurance Co. Ltd.",
    "ICICI Lombard General Insurance Co. Ltd.",
    "Bajaj Allianz General Insurance",
    "Go Digit General Insurance Ltd.",
    "Tata AIG General Insurance Co.",
    "Acko General Insurance Ltd.",
    "The New India Assurance Co. Ltd."
]

FINANCIERS = [
    "HDFC BANK LTD", "ICICI BANK LTD", "STATE BANK OF INDIA", "BAJAJ FINANCE LTD",
    "KOTAK MAHINDRA PRIME", "IDFC FIRST BANK", "HERO FINCORP", "TVS CREDIT SERVICES"
]

def generate_random_reg(state_code: str) -> str:
    dist = random.randint(1, 14)
    dist_str = f"{dist:02d}"
    series = "".join(random.choices("ABCDEFGHJKLMNPQRSTUVWXYZ", k=random.choice([1, 2])))
    digits = random.randint(1001, 9999)
    return f"{state_code}{dist_str}{series}{digits}"

def generate_random_chassis() -> str:
    prefix = "".join(random.choices("ABCDEFGHJKLMNPRSTUVWXYZ0123456789", k=8))
    suffix = "".join(random.choices("0123456789", k=6))
    return f"ME4{prefix}{suffix}"

def generate_random_engine() -> str:
    prefix = "".join(random.choices("ABCDEFGHJKLMNPRSTUVWXYZ", k=4))
    suffix = "".join(random.choices("0123456789", k=6))
    return f"{prefix}{suffix}"

def generate_rc_sample(index: int) -> Dict[str, Any]:
    state = random.choice(INDIAN_STATES)
    veh = random.choice(VEHICLE_CATALOG)
    owner = random.choice(FICTIONAL_NAMES)
    reg_no = generate_random_reg(state[0])
    reg_year = random.randint(2017, 2024)
    reg_month = random.randint(1, 12)
    reg_day = random.randint(1, 28)
    reg_date = f"{reg_day:02d}/{reg_month:02d}/{reg_year}"
    chassis = generate_random_chassis()
    engine = generate_random_engine()
    is_hypothecated = random.random() < 0.4
    financier = random.choice(FINANCIERS) if is_hypothecated else "NONE"
    
    # Generate realistic Parivahan / Indian RC text
    text = f"""
    GOVERNMENT OF INDIA
    MINISTRY OF ROAD TRANSPORT & HIGHWAYS
    CERTIFICATE OF REGISTRATION (FORM 23)
    
    REGISTERING AUTHORITY: {state[2].upper()}
    REGISTRATION NO: {reg_no}
    DATE OF REGISTRATION: {reg_date}
    REGISTERED OWNER: {owner.upper()}
    SON/WIFE/DAUGHTER OF: LATE S. SINGH
    PERMANENT ADDRESS: PLOT {random.randint(10, 400)}, SECTOR {random.randint(1, 70)}, {state[1].upper()}
    
    VEHICLE DETAILS:
    VEHICLE CLASS: {veh['category'].upper()}
    MAKER / MANUFACTURER: {veh['brand'].upper()}
    MODEL NAME: {veh['model'].upper()}
    BODY TYPE: TWO WHEELER
    CHASSIS NUMBER: {chassis}
    ENGINE / MOTOR NUMBER: {engine}
    FUEL TYPE: {veh['fuel'].upper()}
    CUBIC CAPACITY (CC): {veh['cc']} CC
    SEATING CAPACITY: 2 (INCLUDING DRIVER)
    UNLADEN WEIGHT: {random.randint(95, 195)} KG
    COLOR: {random.choice(['BLACK', 'RED', 'BLUE', 'SILVER', 'MATTE GREEN', 'WHITE'])}
    MANUFACTURING YEAR: {reg_year}
    FITNESS VALID UPTO: {reg_day:02d}/{reg_month:02d}/{reg_year + 15}
    TAX VALIDITY: ONE TIME LTT PAID
    HYPOTHECATION: {'YES - ' + financier if is_hypothecated else 'NO HYPOTHECATION (CLEAN TITLE)'}
    
    DIGITALLY SIGNED BY REGISTERING AUTHORITY
    PARIVAHAN SEWA VERIFIED e-RC RECORD
    """
    
    return {
        "id": f"DOC-RC-{index:04d}",
        "class": "RC",
        "raw_text": text.strip(),
        "metadata": {
            "registration_number": reg_no,
            "owner_name": owner,
            "manufacturer": veh["brand"],
            "model": veh["model"],
            "fuel_type": veh["fuel"],
            "registration_date": reg_date,
            "registration_year": reg_year,
            "chassis_number": chassis,
            "engine_number": engine,
            "vehicle_class": veh["category"],
            "registering_authority": state[2],
            "hypothecation": financier if is_hypothecated else None
        }
    }

def generate_insurance_sample(index: int) -> Dict[str, Any]:
    state = random.choice(INDIAN_STATES)
    veh = random.choice(VEHICLE_CATALOG)
    owner = random.choice(FICTIONAL_NAMES)
    reg_no = generate_random_reg(state[0])
    provider = random.choice(INSURANCE_PROVIDERS)
    pol_no = f"POL-{random.randint(10000000, 99999999)}/00"
    start_year = random.randint(2023, 2025)
    exp_year = start_year + 1
    
    text = f"""
    {provider.upper()}
    TWO-WHEELER PACKAGE POLICY CERTIFICATE OF INSURANCE
    
    POLICY NUMBER: {pol_no}
    INSURED NAME: {owner.upper()}
    COMMENCEMENT OF INSURANCE: 12/04/{start_year} 00:00 HRS
    EXPIRY OF INSURANCE: 11/04/{exp_year} 23:59 HRS
    
    VEHICLE SCHEDULE:
    REGISTRATION NO: {reg_no}
    MAKE & MODEL: {veh['brand'].upper()} {veh['model'].upper()}
    ENGINE NO: {generate_random_engine()}
    CHASSIS NO: {generate_random_chassis()}
    INSURED DECLARED VALUE (IDV): RS. {random.randint(35000, 185000):,}
    COVERAGE TYPE: COMPREHENSIVE (OWN DAMAGE + COMPULSORY THIRD PARTY)
    NO CLAIM BONUS (NCB): {random.choice([20, 25, 35, 45, 50])}%
    GEOGRAPHICAL AREA: INDIA
    PREMIUM PAID: RS. {random.randint(1200, 4800)}
    AUTHORISED SIGNATORY - {provider}
    """
    
    return {
        "id": f"DOC-INS-{index:04d}",
        "class": "INSURANCE",
        "raw_text": text.strip(),
        "metadata": {
            "policy_number": pol_no,
            "provider": provider,
            "registration_number": reg_no,
            "expiry_date": f"11/04/{exp_year}"
        }
    }

def generate_puc_sample(index: int) -> Dict[str, Any]:
    state = random.choice(INDIAN_STATES)
    reg_no = generate_random_reg(state[0])
    cert_no = f"{state[0]}{random.randint(100000, 999999)}"
    test_date = f"14/06/2025"
    exp_date = f"13/06/2026"
    
    text = f"""
    BHARAT STAGE VI (BS-VI) EMISSION TESTING
    TRANSPORT DEPARTMENT, GOVERNMENT OF {state[1].upper()}
    POLLUTION UNDER CONTROL CERTIFICATE (PUCC)
    
    CERTIFICATE NUMBER: {cert_no}
    TESTING DATE & TIME: {test_date} 11:24:18 AM
    VALID UPTO: {exp_date}
    VEHICLE REGISTRATION NUMBER: {reg_no}
    VEHICLE CLASS: 2-WHEELER (PETROL / MOTORCYCLE)
    MANUFACTURING YEAR: 2022
    CHASSIS NO (LAST 5 DIGITS): {random.randint(10000, 99999)}
    TEST RESULTS:
    CARBON MONOXIDE (CO): 0.18% (STANDARD LIMIT <= 0.50%) - PASS
    HYDRO CARBONS (HC): 142 PPM (STANDARD LIMIT <= 750 PPM) - PASS
    LAMBDA: 1.002 +/- 0.03 - PASS
    OVERALL STATUS: PASSED (FIT TO PLY)
    TESTING CENTER: {state[0]}-AUTO-EMISSION-TEST-{random.randint(101, 999)}
    FEES PAID: RS. 80.00 (INCLUDING GST)
    """
    
    return {
        "id": f"DOC-PUC-{index:04d}",
        "class": "PUC",
        "raw_text": text.strip(),
        "metadata": {
            "certificate_number": cert_no,
            "registration_number": reg_no,
            "expiry_date": exp_date
        }
    }

def generate_other_sample(index: int) -> Dict[str, Any]:
    templates = [
        f"""
        ELECTRICITY BILL - DISCOM UTILITY
        CONSUMER NUMBER: CA-{random.randint(10000000, 99999999)}
        BILL MONTH: OCTOBER 2025
        NAME: {random.choice(FICTIONAL_NAMES)}
        ADDRESS: FLAT {random.randint(101, 804)}, RESIDENCY TOWER, CHANDIGARH
        UNITS CONSUMED: {random.randint(120, 680)} KWH
        CURRENT BILL AMOUNT: RS. {random.randint(850, 4600)}.00
        DUE DATE: 25/10/2025
        """,
        f"""
        TAX INVOICE / CASH MEMO
        AUTHORIZED SERVICE CENTRE
        JOB CARD NO: JC-{random.randint(10000, 99999)}
        CUSTOMER: {random.choice(FICTIONAL_NAMES)}
        ITEMS: ENGINE OIL 10W-30 (1L), AIR FILTER REPLACEMENT, CHAIN LUBRICATION, GENERAL LABOUR
        TOTAL AMOUNT PAYABLE: RS. {random.randint(950, 2800)}.00
        THANK YOU FOR SERVICING YOUR TWO WHEELER WITH US.
        """,
        f"""
        RESIDENTIAL RENT AGREEMENT
        THIS AGREEMENT ENTERED ON 01/01/2025 BETWEEN LANDLORD AND TENANT
        PREMISES: HOUSE NO {random.randint(1, 500)}, SECTOR {random.randint(1, 50)}
        MONTHLY RENT: RS. {random.randint(12000, 35000)}
        SECURITY DEPOSIT: 2 MONTHS ADVANCE
        WITNESS 1 SIGNATURE, WITNESS 2 SIGNATURE
        """
    ]
    return {
        "id": f"DOC-OTH-{index:04d}",
        "class": "OTHER",
        "raw_text": random.choice(templates).strip(),
        "metadata": {}
    }

def generate_unreadable_sample(index: int) -> Dict[str, Any]:
    noise_tokens = [
        "%%#@$", "???", "---", "...~", "xxxxxx", "blurred", "scan_err_01",
        "unreadable_band", "00000", "____", "[[[", "]]]"
    ]
    text = " ".join(random.choices(noise_tokens, k=random.randint(10, 30)))
    return {
        "id": f"DOC-UNR-{index:04d}",
        "class": "UNREADABLE",
        "raw_text": f"DOCUMENT SCAN CORRUPTED: {text} UNRESOLVABLE PIXEL DENSITY",
        "metadata": {}
    }

def build_complete_dataset():
    print("=" * 70)
    print("GENERATING DE-IDENTIFIED SYNTHETIC INDIAN VEHICLE DOCUMENT DATASET")
    print("=" * 70)
    
    samples: List[Dict[str, Any]] = []
    
    # 1. 220 RC documents (diverse states, makes, hypothecations)
    for i in range(1, 221):
        samples.append(generate_rc_sample(i))
        
    # 2. 140 Insurance documents
    for i in range(1, 141):
        samples.append(generate_insurance_sample(i))
        
    # 3. 140 PUC documents
    for i in range(1, 141):
        samples.append(generate_puc_sample(i))
        
    # 4. 80 Other non-vehicle documents
    for i in range(1, 81):
        samples.append(generate_other_sample(i))
        
    # 5. 40 Unreadable / corrupted image text
    for i in range(1, 41):
        samples.append(generate_unreadable_sample(i))

    random.shuffle(samples)
    total = len(samples)
    print(f"Total synthetic documents generated: {total}")
    
    # Stratified Split by Document Class (70% Train, 15% Validation, 15% Test)
    class_buckets: Dict[str, List[Dict[str, Any]]] = {}
    for s in samples:
        c = s["class"]
        class_buckets.setdefault(c, []).append(s)
        
    train_set, val_set, test_set = [], [], []
    for c, items in class_buckets.items():
        random.shuffle(items)
        n = len(items)
        n_train = int(n * 0.70)
        n_val = int(n * 0.15)
        
        train_set.extend(items[:n_train])
        val_set.extend(items[n_train:n_train + n_val])
        test_set.extend(items[n_train + n_val:])
        
    random.shuffle(train_set)
    random.shuffle(val_set)
    random.shuffle(test_set)
    
    print(f"Train Set: {len(train_set)} samples ({len(train_set)/total*100:.1f}%)")
    print(f"Validation Set: {len(val_set)} samples ({len(val_set)/total*100:.1f}%)")
    print(f"Independent Test Set: {len(test_set)} samples ({len(test_set)/total*100:.1f}%)")
    
    # Save sets to disk
    with open(os.path.join(ANNOTATIONS_DIR, "all_samples.json"), "w") as f:
        json.dump(samples, f, indent=2)
        
    with open(os.path.join(TRAIN_DIR, "train_samples.json"), "w") as f:
        json.dump(train_set, f, indent=2)
        
    with open(os.path.join(VAL_DIR, "val_samples.json"), "w") as f:
        json.dump(val_set, f, indent=2)
        
    with open(os.path.join(TEST_DIR, "test_samples.json"), "w") as f:
        json.dump(test_set, f, indent=2)
        
    print(f"✓ Saved datasets to {DATASETS_DIR}")
    return train_set, val_set, test_set

if __name__ == "__main__":
    build_complete_dataset()
