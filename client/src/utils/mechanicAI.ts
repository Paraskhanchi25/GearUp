// ==============================================================================
// GEAR UP — Dedicated Two-Wheeler Mechanic & Mobility AI Knowledge Engine
// Specializes exclusively in Motorcycles, Scooters, and Electric Two-Wheelers
// ==============================================================================

export interface MechanicDiagnosis {
  title: string;
  category: 'engine' | 'battery' | 'brakes' | 'clutch' | 'tyres' | 'mileage' | 'cooling' | 'chain' | 'electrical' | 'cvt' | 'ev' | 'servicing' | 'buying';
  symptoms: string[];
  possibleCauses: string[];
  diyChecks: string[];
  professionalAction: string;
  isSafetyCritical: boolean;
  safetyWarning?: string;
  recommendedListings?: string[];
  maintenanceIntervalHint?: string;
}

export interface PersonalizedVehicleProfile {
  brand: string;
  model: string;
  year: number;
  engineCc?: number;
  powertrain: 'carburetor' | 'fuel_injection' | 'electric_hub' | 'electric_belt' | 'cvt';
}

export const POPULAR_PROFILES: PersonalizedVehicleProfile[] = [
  { brand: 'Royal Enfield', model: 'Classic 350', year: 2023, engineCc: 349, powertrain: 'fuel_injection' },
  { brand: 'Honda', model: 'Activa 6G', year: 2022, engineCc: 109, powertrain: 'cvt' },
  { brand: 'TVS', model: 'Jupiter 125', year: 2022, engineCc: 124, powertrain: 'cvt' },
  { brand: 'Ather', model: '450X Gen 3', year: 2023, powertrain: 'electric_belt' },
  { brand: 'Ola Electric', model: 'S1 Pro', year: 2023, powertrain: 'electric_hub' },
  { brand: 'Bajaj', model: 'Pulsar NS200', year: 2021, engineCc: 199, powertrain: 'fuel_injection' },
  { brand: 'Yamaha', model: 'MT-15', year: 2022, engineCc: 155, powertrain: 'fuel_injection' },
  { brand: 'Hero', model: 'Splendor Plus', year: 2022, engineCc: 97, powertrain: 'fuel_injection' },
];

export function diagnoseTwoWheelerQuery(
  userQuery: string,
  vehicleProfile?: PersonalizedVehicleProfile | null,
  hasImageAttachment: boolean = false,
  hasAudioAttachment: boolean = false
): MechanicDiagnosis {
  const q = userQuery.toLowerCase();

  // 1. Engine Clicking Sound & Starting Issues
  if (
    q.includes('clicking') ||
    q.includes('won\'t start') ||
    q.includes('wont start') ||
    q.includes('cranking') ||
    q.includes('start nahi ho') ||
    q.includes('starter')
  ) {
    return {
      title: 'Rapid Clicking Sound or Failure to Crank',
      category: 'battery',
      symptoms: ['Rapid rhythmic clicking from under the seat when pressing starter button', 'Instrument cluster flickers or dims', 'Engine does not turn over'],
      possibleCauses: [
        'Discharged or dead 12V battery (voltage dropped below 11.8V under starter load)',
        'Starter solenoid relay clicking without engaging starter motor brushes',
        'Loose or oxidized battery terminal leads (white sulphur powder buildup)',
        'Faulty side-stand engine cut-off sensor or clutch switch',
      ],
      diyChecks: [
        'Turn on headlight and honk horn: if horn sounds weak and light dims, battery is 100% depleted',
        'Inspect 10A/15A main fuse in the fusebox under the side panel',
        'For kick-start vehicles (e.g. Activa / Splendor / Classic): Switch ignition ON and attempt firm manual kick start',
        'Ensure kill switch is set to "RUN" and side-stand is fully retracted',
      ],
      professionalAction: 'Have a technician test battery health using a multimeter load tester. If over 2.5–3 years old, replace with an OEM Exide/Amaron maintenance-free unit.',
      isSafetyCritical: false,
    };
  }

  // 2. Sudden Mileage or Fuel Efficiency Drop
  if (q.includes('mileage') || q.includes('fuel efficiency') || q.includes('petrol zyada') || q.includes('average drop')) {
    return {
      title: 'Sudden Drop in Fuel Economy',
      category: 'mileage',
      symptoms: ['Bike giving 8–15 kmpl less than usual', 'Heavy exhaust smell or slight black smoke', 'Sluggish low-end pickup'],
      possibleCauses: [
        'Choked or dust-clogged air filter element depriving engine of clean oxygen',
        'Under-inflated tyres (riding on 18–20 PSI increases rolling resistance drastically)',
        'Fouled spark plug with black carbon soot accumulation',
        'Dragging brake pads or misadjusted drum brake shoe free-play',
        'Drive chain running dry, stiff, and over-tightened',
      ],
      diyChecks: [
        'Check tyre cold pressures immediately: 22–25 PSI (Front), 28–32 PSI (Rear solo) / 36 PSI (Pillion)',
        'Open airbox cover and inspect paper/foam filter: replace if dark grey or clogged',
        'Put bike on main stand and spin front and rear wheels by hand: they should rotate freely without friction',
      ],
      professionalAction: 'Clean carburettor jets (if carb model) or run an O2 sensor & throttle body calibration scan at authorized workshop.',
      isSafetyCritical: false,
      maintenanceIntervalHint: 'Air filters should be cleaned every 3,000 km and replaced every 10,000–12,000 km.',
    };
  }

  // 3. Spongy or Weak Brakes / Brake Squeal
  if (q.includes('brake') || q.includes('spongy') || q.includes('squeal') || q.includes('braking') || q.includes('disc')) {
    return {
      title: 'Spongy Brake Lever or Squealing Rotors',
      category: 'brakes',
      symptoms: ['Brake lever pulls all the way to handlebar grip before biting', 'High-pitched metallic squeal when stopping', 'Soft hydraulic pressure'],
      possibleCauses: [
        'Air bubbles trapped inside hydraulic brake fluid lines (requires bleeding)',
        'Worn brake pads down to backing plate (<1.5mm friction material)',
        'Contaminated brake rotor with road grease, chain lube overspray, or wash water',
        'Glazed brake pads from prolonged panic dragging',
      ],
      diyChecks: [
        'Check brake master cylinder fluid reservoir window on handlebar: fluid must be above "MIN" line and clear/amber, not dark brown',
        'Visually inspect brake pad thickness between caliper jaws: if metal backing plate touches rotor, STOP riding immediately',
        'Spray dedicated isopropyl alcohol brake cleaner onto rotor discs',
      ],
      professionalAction: 'Flush and bleed brake lines with fresh DOT-4 fluid. Replace worn brake pads with OEM semi-metallic pads.',
      isSafetyCritical: true,
      safetyWarning: 'CRITICAL SAFETY HAZARD: Do not ride at highway speeds with spongy brakes. Complete loss of hydraulic braking can happen without warning.',
    };
  }

  // 4. Scooter CVT & Drive Belt Vibrations (Activa, Jupiter, Access)
  if (q.includes('scooter') || q.includes('cvt') || q.includes('belt') || q.includes('judder') || q.includes('vibration on pickup') || q.includes('activa') || q.includes('jupiter')) {
    return {
      title: 'CVT Transmission Judder & Pickup Vibration',
      category: 'cvt',
      symptoms: ['Scooter violently shudders or vibrates between 10–25 km/h on gentle acceleration', 'Engine revs high but scooter moves forward slowly', 'Squeaking from rear clutch case'],
      possibleCauses: [
        'Dust accumulation and glaze on centrifugal clutch shoe linings and clutch bell',
        'Worn variator roller weights with flat spots, preventing smooth outward slide',
        'Stretched or cracked Kevlar drive belt slipping on variator pulleys',
        'Worn contra-spring or dried torque-cam slider pins',
      ],
      diyChecks: [
        'Confirm vibration only happens from standstill takeoff (points strictly to CVT clutch dust)',
        'Do not hold brakes while opening throttle (burns and glazes clutch shoes immediately)',
      ],
      professionalAction: 'Have the mechanic open the left-side crankcase cover, clean clutch dust with compressed air, deburr clutch bell with 120-grit emery paper, and inspect roller weights.',
      isSafetyCritical: false,
      maintenanceIntervalHint: 'CVT belt inspection recommended every 12,000 km; replacement mandatory at 20,000–24,000 km.',
    };
  }

  // 5. Electric Two-Wheeler (EV) Battery, Range & Charging (Ather, Ola, Chetak)
  if (q.includes('ev') || q.includes('electric') || q.includes('ather') || q.includes('ola') || q.includes('range') || q.includes('charging') || q.includes('battery health')) {
    return {
      title: 'EV Range Reduction & BMS Diagnostics',
      category: 'ev',
      symptoms: ['True range noticeably lower than dashboard display', 'Scooter goes into limp/turtle mode on steep flyovers', 'Charging stops prematurely at 80–90%'],
      possibleCauses: [
        'Cell imbalance in lithium-ion pack (BMS requires a full slow charge cycle)',
        'Thermal throttling on hot Indian summer afternoons (42°C+ ambient cuts peak current)',
        'Low tyre pressure (EVs have higher kerb weight; soft tyres reduce range by 15–20%)',
        'Aggressive throttle bursts in Warp/Hyper mode',
      ],
      diyChecks: [
        'Perform a BMS Cell Balancing Cycle: Discharge scooter to ~15%, then plug into standard home charger continuously until 100% + leave plugged for 2 hours',
        'Maintain front tyre at 28 PSI and rear at 33 PSI cold',
        'Use Eco or Ride mode with medium regenerative braking enabled in city bumper-to-bumper traffic',
      ],
      professionalAction: 'Book an authorized service center diagnostic scan to read individual cell voltages and verify State-of-Health (SoH).',
      isSafetyCritical: false,
      recommendedListings: ['bike-003', 'bike-005'],
    };
  }

  // 6. Chain Slack, Sprocket Wear & Clatter
  if (q.includes('chain') || q.includes('sprocket') || q.includes('clatter') || q.includes('loose chain') || q.includes('khad khad')) {
    return {
      title: 'Drive Chain Slack & Sprocket Shark-Toothing',
      category: 'chain',
      symptoms: ['Loud metallic clattering over bumps', 'Jerky throttle transitions in 1st/2nd gear', 'Chain slapping against swingarm rubber guard'],
      possibleCauses: [
        'Chain slack exceeds permissible limit (>30–35mm vertical deflection)',
        'Dry, unlubricated O-ring / X-ring links with stiff seized rollers',
        'Rear sprocket teeth worn into curved "shark-fin" profile',
        'Uneven chain stretch due to hard downshifts',
      ],
      diyChecks: [
        'Measure mid-span vertical chain play with a ruler: optimal slack is 20–25mm for streetbikes',
        'Clean chain with kerosene/diesel (avoid harsh petrol on O-rings), brush clean, and spray dedicated high-tack chain lube',
        'Inspect rear sprocket teeth: if teeth are hooked or sharp, chain and sprockets must be replaced together as a set',
      ],
      professionalAction: 'Adjust axle adjusters evenly on both swingarm alignment notches. Replace chain-sprocket kit if adjustment marks are at maximum.',
      isSafetyCritical: true,
      safetyWarning: 'SAFETY WARNING: An excessively loose chain can jump off the sprocket and lock the rear wheel instantly at speed.',
    };
  }

  // 7. Engine Overheating & Coolant Issues
  if (q.includes('heat') || q.includes('overheat') || q.includes('coolant') || q.includes('radiator') || q.includes('garam ho')) {
    return {
      title: 'Engine Overheating & Radiator Cooling Faults',
      category: 'cooling',
      symptoms: ['High temperature warning indicator on dash', 'Burnt oil smell near exhaust head', 'Engine knocking and power loss under load'],
      possibleCauses: [
        'Low or degraded engine oil level (oil serves 40% of engine cooling in 2-wheelers)',
        'Radiator fan failure or blown radiator relay (liquid-cooled bikes like Duke/Pulsar NS/R15)',
        'Mud baked into radiator cooling fins blocking airflow',
        'Air lock or internal coolant leak into head gasket',
      ],
      diyChecks: [
        'Turn off ignition and let engine cool for 20 minutes before inspecting',
        'Check engine oil dipstick / inspection glass window: oil must be between upper and lower markers',
        'Inspect coolant reservoir level: NEVER open radiator cap while hot',
        'Gently spray water through radiator fins from behind to remove baked mud',
      ],
      professionalAction: 'Inspect water pump impeller seal, test radiator thermostat valve opening temperature, and pressure test cooling loop.',
      isSafetyCritical: true,
      safetyWarning: 'CAUTION: Do not open the radiator pressure cap while the engine is hot; boiling coolant can spray out and cause severe burns.',
    };
  }

  // 8. Buying / Recommendation Advice
  if (q.includes('buy') || q.includes('which bike') || q.includes('recommend') || q.includes('budget') || q.includes('lakh') || q.includes('under')) {
    return {
      title: 'Personalized Two-Wheeler Buying Recommendation',
      category: 'buying',
      symptoms: ['Searching for best value, low maintenance, and high resale confidence'],
      possibleCauses: ['Matching user commute distance, ergonomics, pillion needs, and fuel budget'],
      diyChecks: [
        'Determine primary riding split: City commute (60-80%) vs Highway weekend trips (20-40%)',
        'Decide between CVT scooter convenience (Activa/Jupiter), EV savings (Ather/Ola), or motorcycle presence (Classic 350/MT-15)',
        'Always check the GEAR UP 120-point certified inspection report and Parivahan RTO validity before making an offer',
      ],
      professionalAction: 'Book a doorstep test ride through GEAR UP to evaluate clutch feel, brake bite, and suspension plushness before deciding.',
      isSafetyCritical: false,
      recommendedListings: ['bike-001', 'bike-002', 'bike-003', 'bike-007'],
    };
  }

  // General Mechanic & Troubleshooting Fallback
  return {
    title: 'Two-Wheeler Diagnostic Assessment',
    category: 'engine',
    symptoms: ['Symptom requiring systematic diagnostic triage'],
    possibleCauses: [
      'Fuel system contamination or clogged tank vent breather hole',
      'Spark plug gap out of tolerance or electrical grounding fault',
      'Air-fuel mixture variation or low battery reserve capacity',
    ],
    diyChecks: [
      'Check spark plug cap connection and lead wire insulation',
      'Verify clean fuel delivery from fuel cock / fuel pump priming sound on key ON',
      'Confirm battery terminal screw tightness with a Phillips screwdriver',
      'Verify engine oil level and condition on the dipstick',
    ],
    professionalAction: 'Visit a certified GEAR UP partner hub for comprehensive OBD-II code scanning and multi-meter electrical testing.',
    isSafetyCritical: false,
    recommendedListings: ['bike-001', 'bike-002'],
  };
}
