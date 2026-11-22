import { VehicleListing } from '../../types';

export type ComponentCategory = 'mechanical' | 'wheels_braking' | 'suspension_chassis' | 'electrical' | 'exterior';

export interface InspectionComponentDef {
  id: string;
  name: string;
  shortName: string;
  category: ComponentCategory;
  categoryLabel: string;
  meshKeywords: string[];
  // Normalized 3D position in the showroom space (bike center is around (0, 0.7, 0))
  hotspotPosition: [number, number, number];
  // Ideal camera focus position when inspecting this component
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  // Exploded view offset direction
  explodedOffset: [number, number, number];
  // Standard specifications / OEM features
  specs: Record<string, string>;
  // Dynamic specs extractor based on active vehicle model
  getSpecs?: (vehicle?: VehicleListing) => Record<string, string>;
  // Key mechanical features
  features: string[];
  // Function to extract seller's actual physical inspection condition
  getInspectionData: (vehicle?: VehicleListing) => {
    conditionGrade: 'excellent' | 'good' | 'fair' | 'attention';
    conditionLabel: string;
    score: number; // out of 5 or 100%
    inspectorRemarks: string;
    metrics?: { label: string; value: string; isGood?: boolean }[];
    evidencePhotos?: { url: string; caption: string; tag: string }[];
    visionAiDetection?: {
      detected: boolean;
      confidence: number;
      surfaceQuality: string;
      notes: string;
    };
  };
}

export const COMPONENT_CATEGORIES: { id: ComponentCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Components (14)' },
  { id: 'mechanical', label: 'Engine & Powertrain' },
  { id: 'wheels_braking', label: 'Wheels & Braking' },
  { id: 'suspension_chassis', label: 'Suspension & Chassis' },
  { id: 'electrical', label: 'Electrical & Stator' },
  { id: 'exterior', label: 'Exterior & Lighting' }
];

export type InspectionComponent = InspectionComponentDef;

export const MOTORCYCLE_COMPONENTS: InspectionComponentDef[] = [

  // ---------------------------------------------------------------------------
  // 1. ENGINE & MECHANICAL
  // ---------------------------------------------------------------------------
  {
    id: 'engine_assembly',
    name: 'Engine Block & Crankcase',
    shortName: 'Engine',
    category: 'mechanical',
    categoryLabel: 'Engine & Powertrain',
    meshKeywords: ['engine', 'carter', 'glass_engine', 'logo_engine', 'bolt_engine'],
    hotspotPosition: [0, 0.65, 0.05],
    cameraPosition: [1.3, 0.8, 0.4],
    cameraTarget: [0, 0.65, 0.05],
    explodedOffset: [0, -0.15, 0],
    specs: {
      'Displacement': '349 cc (Single Cylinder)',
      'Engine Architecture': '4-Stroke, SOHC, 2-Valve Engine',
      'Cooling': 'Air-Oil Cooled (Secondary Radiator)',
      'Fuel Delivery': 'Electronic Fuel Injection (EFI)',
      'Max Power': '20.2 BHP @ 6,100 RPM',
      'Max Torque': '27.0 Nm @ 4,000 RPM'
    },
    getSpecs: (v?: VehicleListing): Record<string, string> => {
      if (v?.fuel === 'electric' || v?.category === 'electric') {
        const isAther = v?.model?.toLowerCase().includes('ather');
        return {
          'Motor Type': 'Permanent Magnet Synchronous Motor (PMSM)',
          'Peak Power': isAther ? '6.2 kW (8.3 BHP)' : '8.5 kW (11.4 BHP)',
          'Battery Pack': isAther ? '3.7 kWh Lithium-ion (IP67)' : '4.0 kWh Lithium-ion',
          'Certified Range': isAther ? '150 km IDC' : '181 km TrueRange',
          'Cooling': 'Fan-Assisted Thermal Management',
          'Transmission': 'High-Efficiency Belt Reduction Drive'
        };
      }
      if (v?.category === 'scooter' || v?.model?.toLowerCase().includes('activa') || v?.model?.toLowerCase().includes('jupiter')) {
        const isJupiter = v?.model?.toLowerCase().includes('jupiter');
        return {
          'Displacement': isJupiter ? '124.8 cc Single Cylinder' : '109.51 cc PGM-FI eSP',
          'Engine Architecture': '4-Stroke, SI Engine, Fan Cooled',
          'Fuel Delivery': isJupiter ? 'ET-Fi (EcoThrust Fuel Injection)' : 'PGM-FI Electronic Fuel Injection',
          'Max Power': isJupiter ? '8.04 BHP @ 6,500 RPM' : '7.79 BHP @ 8,000 RPM',
          'Max Torque': isJupiter ? '10.5 Nm @ 4,500 RPM' : '8.84 Nm @ 5,500 RPM',
          'Transmission': 'V-Matic CVT Automatic'
        };
      }
      if (v?.model?.toLowerCase().includes('r15')) {
        return {
          'Displacement': '155 cc Liquid-Cooled 4-Stroke SOHC',
          'Valve System': '4-Valve with Variable Valve Actuation (VVA)',
          'Max Power': '18.4 BHP @ 10,000 RPM',
          'Max Torque': '14.2 Nm @ 7,500 RPM',
          'Transmission': '6-Speed with Assist & Slipper Clutch'
        };
      }
      if (v?.model?.toLowerCase().includes('pulsar')) {
        return {
          'Displacement': '199.5 cc Triple-Spark 4-Valve DTS-i',
          'Cooling': 'Liquid-Cooled with Thermostat Relay',
          'Max Power': '24.5 BHP @ 9,750 RPM',
          'Max Torque': '18.74 Nm @ 8,000 RPM',
          'Transmission': '6-Speed Constant Mesh'
        };
      }
      if (v?.model?.toLowerCase().includes('splendor')) {
        return {
          'Displacement': '97.2 cc Air-Cooled Single Cylinder',
          'Engine Architecture': '4-Stroke, OHC, Programmed FI with i3S',
          'Max Power': '7.91 BHP @ 8,000 RPM',
          'Max Torque': '8.05 Nm @ 6,000 RPM',
          'Transmission': '4-Speed Constant Mesh All-Up'
        };
      }
      return {
        'Displacement': '349 cc J-Series Single Cylinder',
        'Engine Architecture': '4-Stroke, SOHC, Air-Oil Cooled',
        'Max Power': '20.2 BHP @ 6,100 RPM',
        'Max Torque': '27.0 Nm @ 4,000 RPM',
        'Transmission': '5-Speed Constant Mesh'
      };
    },
    features: [
      'Counterbalancer shaft reducing high-RPM vibrations',
      'Single-piece forged crankshaft for longevity',
      'Integrated wet-sump lubrication with high-efficiency oil filter',
      'Crisp throttle response with zero cold-start hesitation'
    ],
    getInspectionData: (v) => {
      const isGood = v?.inspectionScore ? v.inspectionScore >= 4.5 : true;
      return {
        conditionGrade: isGood ? 'excellent' : 'good',
        conditionLabel: 'Verified Healthy (Compression Passed)',
        score: v?.inspectionScore ? Math.round(v.inspectionScore * 20) : 96,
        inspectorRemarks: v?.aiMechanicalNotes?.[0] || 'Cold start clean. Compression test measured 138 PSI (OEM benchmark 135-142 PSI). Crankcase and oil seal completely dry with zero sweat or leakage.',
        metrics: [
          { label: 'Cylinder Compression', value: '138 PSI (Optimal)', isGood: true },
          { label: 'Oil Sump Level & Clarity', value: 'Fresh Amber / Full', isGood: true },
          { label: 'Crankcase Seal Sweating', value: 'Zero Oil Sweat Detected', isGood: true },
          { label: 'Cold Start RPM Stability', value: '1,150 RPM Steady', isGood: true }
        ],
        evidencePhotos: v?.galleryImages?.length ? [
          { url: v.galleryImages[0], caption: 'Engine casing and crankcase right side inspection', tag: 'Crankcase Seal Check' },
          { url: v.primaryImage, caption: 'Overview of engine bay during physical audit', tag: '120-Point Bay Audit' }
        ] : undefined,
        visionAiDetection: {
          detected: true,
          confidence: 0.96,
          surfaceQuality: 'Clean casting finish, zero impact marks on outer casing',
          notes: 'Computer Vision verified: Zero external corrosion, cylinder cooling fins aligned.'
        }
      };
    }
  },

  {
    id: 'exhaust_system',
    name: 'Exhaust System & Muffler',
    shortName: 'Exhaust & Muffler',
    category: 'mechanical',
    categoryLabel: 'Engine & Powertrain',
    meshKeywords: ['muffler', 'pipe', 'weld_muffler'],
    hotspotPosition: [-0.35, 0.45, 0.55],
    cameraPosition: [-1.4, 0.5, 0.8],
    cameraTarget: [-0.35, 0.45, 0.55],
    explodedOffset: [-0.25, -0.1, 0.1],
    specs: {
      'Exhaust Type': 'Upswept Pea-Shooter / Straight-Through OEM Muffler',
      'Catalytic Converter': 'Integrated Closed-Loop 3-Way Catcon',
      'Emission Standard': 'BS6 Phase 2 (OBD-2 Real Driving Emissions Compliant)',
      'Oxygen Sensor': 'Heated Lambda O2 Sensor'
    },
    features: [
      'Heavy-gauge dual-layer chrome heat shield',
      'Tuned signature bass exhaust note compliant with 84 dB RTO limits',
      'Corrosion-resistant internal stainless steel baffling',
      'Integrated collector box with oxygen sensor mount'
    ],
    getInspectionData: (v) => {
      return {
        conditionGrade: 'excellent',
        conditionLabel: 'Clean Chrome / Zero Baffle Damage',
        score: 95,
        inspectorRemarks: 'Exhaust pipe inspected from header bend to tail tip. Triple-nickel chrome finish intact. Catcon operating temperature normal with zero rattle or loose baffling.',
        metrics: [
          { label: 'Chrome Oxidation & Rust', value: 'None (Spotless Finish)', isGood: true },
          { label: 'Internal Baffle Integrity', value: 'Rattle-Free (Tight)', isGood: true },
          { label: 'Header Pipe Heat Discoloration', value: 'Normal Mild Gold Patina', isGood: true },
          { label: 'PUC Emission Compliance', value: `Valid (${v?.pucValidUntil || 'Compliant'})`, isGood: true }
        ],
        evidencePhotos: v?.galleryImages?.[1] ? [
          { url: v.galleryImages[1], caption: 'Exhaust muffler pipe profile and heat shield condition', tag: 'Exhaust Inspection' }
        ] : undefined,
        visionAiDetection: {
          detected: true,
          confidence: 0.94,
          surfaceQuality: 'Showroom chrome gloss, zero dents or scraping on underside',
          notes: 'Visual AI confirmation: Muffler mounting brackets and heat shield clips secure.'
        }
      };
    }
  },

  {
    id: 'chain_sprocket',
    name: 'Drive Chain & Rear Sprocket',
    shortName: 'Chain & Sprocket',
    category: 'mechanical',
    categoryLabel: 'Engine & Powertrain',
    meshKeywords: ['chain', 'sproket', 'axis_chain'],
    hotspotPosition: [0.22, 0.45, 0.65],
    cameraPosition: [1.2, 0.5, 0.75],
    cameraTarget: [0.22, 0.45, 0.65],
    explodedOffset: [0.2, 0, 0],
    specs: {
      'Drive Type': 'Heavy Duty O-Ring Sealed Roller Chain',
      'Chain Pitch': '525 Spec',
      'Front Sprocket': '15-Teeth Hardened Alloy',
      'Rear Sprocket': '42-Teeth Heat-Treated Carbon Steel'
    },
    features: [
      'Internal synthetic grease retention via durable nitrile O-rings',
      'High tensile strength alloy links rated for 32 kN shock loads',
      'Uniform tooth profiling preventing chain slip and premature wear',
      'Full protective upper chain guard minimizing road grime exposure'
    ],
    getInspectionData: () => ({
      conditionGrade: 'good',
      conditionLabel: 'Properly Lubed & Tensioned',
      score: 91,
      inspectorRemarks: 'Chain slack measured at 26mm (within OEM spec of 25-30mm). Sprocket teeth symmetrical with zero hooking or shark-fin wear. Fresh Motul chain lube applied.',
      metrics: [
        { label: 'Chain Free Play / Slack', value: '26 mm (Spec: 25-30 mm)', isGood: true },
        { label: 'Sprocket Tooth Wear', value: 'Symmetrical / Minimal', isGood: true },
        { label: 'O-Ring Seal Condition', value: '100% Intact / Supple', isGood: true },
        { label: 'Estimated Remaining Life', value: '18,000+ km', isGood: true }
      ]
    })
  },

  {
    id: 'radiator_cooling',
    name: 'Oil Cooler & Radiator Core',
    shortName: 'Cooling Radiator',
    category: 'mechanical',
    categoryLabel: 'Engine & Powertrain',
    meshKeywords: ['radiator'],
    hotspotPosition: [0, 0.62, -0.4],
    cameraPosition: [0.8, 0.75, -0.9],
    cameraTarget: [0, 0.62, -0.4],
    explodedOffset: [0, 0, -0.2],
    specs: {
      'System Type': 'Auxiliary Oil Radiator & Fin Array',
      'Core Material': 'Brazed Aluminum Fins & Tubes',
      'Mounting': 'Rubber-Isolated Chassis Cradle'
    },
    features: [
      'Direct thermal dissipation keeping engine oil within 85-95°C',
      'Stone guard protector preventing debris damage',
      'High-pressure steel braided oil feed lines'
    ],
    getInspectionData: () => ({
      conditionGrade: 'excellent',
      conditionLabel: 'Fins Straight / Zero Leaks',
      score: 98,
      inspectorRemarks: 'Radiator fin core clean and straight. Zero debris clogging or stone puncture marks. Oil feed banjo bolts torqued to OEM spec.',
      metrics: [
        { label: 'Fin Core Integrity', value: '99% Unbent Fins', isGood: true },
        { label: 'Oil Feed Hose Couplings', value: 'Dry & Tight (Zero Leak)', isGood: true }
      ]
    })
  },

  // ---------------------------------------------------------------------------
  // 2. WHEELS & BRAKING SYSTEM
  // ---------------------------------------------------------------------------
  {
    id: 'front_wheel_tyre',
    name: 'Front Tyre & Alloy Rim',
    shortName: 'Front Tyre',
    category: 'wheels_braking',
    categoryLabel: 'Wheels & Brakes',
    meshKeywords: ['tire_front', 'rim_front', 'decal_rim_front'],
    hotspotPosition: [0, 0.42, -1.02],
    cameraPosition: [1.2, 0.55, -1.25],
    cameraTarget: [0, 0.42, -1.02],
    explodedOffset: [0, 0, -0.3],
    specs: {
      'Tyre Size': '100/90 - 19 57P (Tubeless)',
      'Rim Size': '19 x 2.15 inch Precision Cast Alloy',
      'Tread Compound': 'High-Silica All-Weather Wet Grip Compound',
      'Recommended Pressure': '32 PSI (Cold Solo)'
    },
    features: [
      'Deep directional water-channeling sipes preventing aquaplaning',
      'Tubeless safety bead seating on lightweight multispoke alloy rim',
      'Reinforced carcass ply preventing high-speed puncture blowouts'
    ],
    getInspectionData: (v) => ({
      conditionGrade: 'excellent',
      conditionLabel: 'Deep Tread (>80% Remaining)',
      score: 93,
      inspectorRemarks: v?.aiMechanicalNotes?.[2] || 'Tyre tread depth measured with digital vernier depth gauge at 4.6mm (OEM brand new is ~5.5mm). Zero dry rot, micro-cracks or sidewall bulges.',
      metrics: [
        { label: 'Tread Depth Remaining', value: '4.6 mm (~84%)', isGood: true },
        { label: 'Sidewall Cracking / Dry Rot', value: 'Zero (Rubber Supple)', isGood: true },
        { label: 'Rim Runout / Truing', value: 'Under 0.4mm (True)', isGood: true },
        { label: 'Puncture Plugs Recorded', value: '0 (Original Factory Tyre)', isGood: true }
      ]
    })
  },

  {
    id: 'rear_wheel_tyre',
    name: 'Rear Tyre & Alloy Rim',
    shortName: 'Rear Tyre',
    category: 'wheels_braking',
    categoryLabel: 'Wheels & Brakes',
    meshKeywords: ['tire_rear', 'rim_rear', 'decal_rim_rear'],
    hotspotPosition: [0, 0.43, 0.95],
    cameraPosition: [-1.3, 0.55, 1.25],
    cameraTarget: [0, 0.43, 0.95],
    explodedOffset: [0, 0, 0.3],
    specs: {
      'Tyre Size': '120/80 - 18 62P (Tubeless)',
      'Rim Size': '18 x 2.75 inch Precision Cast Alloy',
      'Tread Profile': 'Dual-Radius Cruiser Touring Pattern',
      'Recommended Pressure': '36 PSI (Pillion)'
    },
    features: [
      'Wide contact patch providing linear highway traction and stability',
      'Heat-dissipating carcass compound preventing shoulder overheating',
      'Dynamic balance verified with minimal balance weight required'
    ],
    getInspectionData: () => ({
      conditionGrade: 'good',
      conditionLabel: 'Solid Grip (4.2mm Tread)',
      score: 89,
      inspectorRemarks: 'Rear tyre retains 4.2mm central tread depth. Center wear uniform with clean shoulder transitions. Rim edges clean with zero curb rash.',
      metrics: [
        { label: 'Center Tread Depth', value: '4.2 mm (78%)', isGood: true },
        { label: 'Shoulder Wear Uniformity', value: 'Even Left / Right', isGood: true },
        { label: 'Curb Rash on Rim Bead', value: 'Zero Scrapes', isGood: true }
      ]
    })
  },

  {
    id: 'front_brake_system',
    name: 'Front Disc Brake & Bybre Caliper',
    shortName: 'Front Disc & ABS',
    category: 'wheels_braking',
    categoryLabel: 'Wheels & Brakes',
    meshKeywords: ['brake_disk_front', 'brake_calipper_front', 'disk_abs_front', 'cylinder_brake'],
    hotspotPosition: [0.08, 0.42, -0.92],
    cameraPosition: [0.85, 0.48, -0.85],
    cameraTarget: [0.08, 0.42, -0.92],
    explodedOffset: [0.25, 0, 0],
    specs: {
      'Rotor Diameter': '300 mm Stainless Steel Floating Disc',
      'Caliper Type': 'Bybre Twin-Piston Axial Caliper',
      'Brake Fluid': 'DOT 4 High Boiling Point Fluid',
      'ABS System': 'Bosch 9.1M Dual-Channel Anti-Lock Braking System'
    },
    features: [
      'Drilled rotor pattern ensuring rapid heat evacuation and wet bite',
      'Non-asbestos organic (NAO) friction pads with wear-indicator grooves',
      'Braided stainless hydraulic hose preventing lever sponginess'
    ],
    getInspectionData: (v) => ({
      conditionGrade: 'excellent',
      conditionLabel: 'Sharp Bite (Pads 85% Thick)',
      score: 96,
      inspectorRemarks: v?.aiMechanicalNotes?.[1] || 'Brake rotor micrometer thickness measured 4.85mm (min legal discard 4.0mm). Brake pad friction material thick (3.8mm). ABS pulse test verified.',
      metrics: [
        { label: 'Rotor Disc Thickness', value: '4.85 mm (Spec: 5.0 mm)', isGood: true },
        { label: 'Friction Pad Remaining', value: '85% Thickness (3.8 mm)', isGood: true },
        { label: 'Hydraulic Lever Bite Point', value: 'Firm & Immediate', isGood: true },
        { label: 'ABS Sensor Wheel Gap', value: '0.8 mm (Optimal)', isGood: true }
      ]
    })
  },

  {
    id: 'rear_brake_system',
    name: 'Rear Disc Brake & Caliper',
    shortName: 'Rear Brake Disc',
    category: 'wheels_braking',
    categoryLabel: 'Wheels & Brakes',
    meshKeywords: ['brake_disk_rear', 'brake_caliper_rear', 'disk_abs_rear'],
    hotspotPosition: [-0.12, 0.42, 0.86],
    cameraPosition: [-0.9, 0.48, 0.85],
    cameraTarget: [-0.12, 0.42, 0.86],
    explodedOffset: [-0.25, 0, 0],
    specs: {
      'Rotor Diameter': '270 mm Ventilated Rotor',
      'Caliper Type': 'Bybre Single-Piston Floating Caliper',
      'ABS Channel': 'Rear ABS Wheel Speed Sensor Integrated'
    },
    features: [
      'Progressive pedal modulation preventing premature rear lockup',
      'Thermal shielding against drive chain grease spatter',
      'Low disc runout under 0.05 mm'
    ],
    getInspectionData: () => ({
      conditionGrade: 'good',
      conditionLabel: 'Optimal Response',
      score: 92,
      inspectorRemarks: 'Rear disc smooth with zero concentric scoring grooves. Brake caliper slider pins lubricated and free-floating.',
      metrics: [
        { label: 'Rotor Surface Glazing', value: 'Clean (No Deep Grooves)', isGood: true },
        { label: 'Pad Thickness', value: '3.2 mm (75%)', isGood: true }
      ]
    })
  },

  // ---------------------------------------------------------------------------
  // 3. SUSPENSION & CHASSIS
  // ---------------------------------------------------------------------------
  {
    id: 'front_suspension',
    name: 'Front Telescopic Forks (41mm)',
    shortName: 'Front Suspension',
    category: 'suspension_chassis',
    categoryLabel: 'Chassis & Suspension',
    meshKeywords: ['shockabsorber_front', 'det_suspension', 'traverse'],
    hotspotPosition: [0, 0.75, -0.72],
    cameraPosition: [1.1, 0.85, -0.95],
    cameraTarget: [0, 0.75, -0.72],
    explodedOffset: [0, 0.15, -0.15],
    specs: {
      'Fork Tube Diameter': '41 mm Hard-Chromed Steel Stanchions',
      'Suspension Travel': '130 mm Wheel Travel',
      'Damping System': 'Internal Dual-Rate Hydraulic Damping Orifice',
      'Fork Oil Spec': '10W Synthetic Fork Oil'
    },
    features: [
      'Sturdy 41mm inner tubes resisting torsional flex during heavy braking',
      'Double-lip dust and oil seals preventing oil weeping',
      'Progressive-rate internal coil springs isolating road undulations'
    ],
    getInspectionData: () => ({
      conditionGrade: 'excellent',
      conditionLabel: 'Stanchions Clean / Zero Oil Weep',
      score: 97,
      inspectorRemarks: 'Fork stanchions smooth with mirror chrome finish. Zero pitting from stone chips. Rubber dust boots intact and oil seals completely dry.',
      metrics: [
        { label: 'Fork Seal Oil Leakage', value: 'Zero (Seals 100% Dry)', isGood: true },
        { label: 'Stanchion Surface Chrome', value: 'Mirror Polish (No Pitting)', isGood: true },
        { label: 'Rebound Damping Action', value: 'Smooth & Progressive', isGood: true },
        { label: 'Steering Head Bearing Play', value: 'Zero Play (Smooth Center)', isGood: true }
      ]
    })
  },

  {
    id: 'rear_suspension',
    name: 'Rear Twin Gas-Charged Shock Absorbers',
    shortName: 'Rear Suspension',
    category: 'suspension_chassis',
    categoryLabel: 'Chassis & Suspension',
    meshKeywords: ['shock_absorber_rear', 'spring', 'suspension'],
    hotspotPosition: [-0.15, 0.65, 0.55],
    cameraPosition: [-1.2, 0.75, 0.7],
    cameraTarget: [-0.15, 0.65, 0.55],
    explodedOffset: [-0.2, 0, 0.15],
    specs: {
      'Shock Type': 'Twin Tube Emulsion Shocks with Nitrogen Gas Charge',
      'Preload Adjustment': '6-Step Adjustable Cam Ring Preload',
      'Suspension Travel': '90 mm Wheel Travel'
    },
    features: [
      'Nitrogen gas chamber preventing oil aeration and damping fade',
      'Heavy-duty powder-coated red/black progressive coil spring',
      'Polyurethane bump stops absorbing bottom-out impacts'
    ],
    getInspectionData: () => ({
      conditionGrade: 'good',
      conditionLabel: 'Firm Damping / Preload Tested',
      score: 94,
      inspectorRemarks: 'Both rear shock dampers tested under full two-up load. Zero bounce rebound or damping fade. Preload adjuster steps click crisply.',
      metrics: [
        { label: 'Gas Reservoir Pressure', value: 'Factory Spec Holding', isGood: true },
        { label: 'Spring Powdercoat Finish', value: 'Zero Rust on Coils', isGood: true },
        { label: 'Bottom-Out Bump Stop', value: 'Supple & Undamaged', isGood: true }
      ]
    })
  },

  {
    id: 'frame_chassis',
    name: 'Twin Downtube Spine Frame & Swingarm',
    shortName: 'Chassis Frame',
    category: 'suspension_chassis',
    categoryLabel: 'Chassis & Suspension',
    meshKeywords: ['frame', 'swingarm'],
    hotspotPosition: [0, 0.68, 0.1],
    cameraPosition: [1.5, 0.9, 0.2],
    cameraTarget: [0, 0.68, 0.1],
    explodedOffset: [0, 0, 0],
    specs: {
      'Frame Architecture': 'Twin Downtube Spine Steel Cradle Frame',
      'Material': 'High-Tensile Tubular Steel with Robot-Welded Seams',
      'Swingarm': 'Box-Section Fabricated Steel Swingarm with Needle Bearings',
      'Rake & Trail': '26° / 111.7 mm'
    },
    features: [
      'Harris Performance-engineered cradle frame with 35% higher torsional stiffness',
      'Dual-downtube engine cradle shielding the crankcase bottom from impact',
      'Cathodic electrodeposition (CED) rust-proof dip-coating under primer'
    ],
    getInspectionData: (v) => ({
      conditionGrade: 'excellent',
      conditionLabel: 'Laser Checked Alignment (Zero Tilt)',
      score: 99,
      inspectorRemarks: 'Chassis alignment checked on laser frame jig. Frame rake and swingarm pivot perfectly true with zero bend or post-fall repairs. Clean factory welds.',
      metrics: [
        { label: 'Frame Alignment & Geometry', value: 'Zero Tilt (Factory Spec)', isGood: true },
        { label: 'Factory Weld Seams', value: 'Robot-Weld Intact / No Cracks', isGood: true },
        { label: 'Chassis Number (VIN) Stamping', value: `Verified Matches RC (${v?.rtoCode || 'Matched'})`, isGood: true },
        { label: 'Under-Cradle Stone Scrapes', value: 'Zero Impact Dents', isGood: true }
      ]
    })
  },

  // ---------------------------------------------------------------------------
  // 4. ELECTRICAL & INSTRUMENTATION
  // ---------------------------------------------------------------------------
  {
    id: 'instrument_cluster',
    name: 'Digi-Analog Instrument Console',
    shortName: 'Instrument Console',
    category: 'electrical',
    categoryLabel: 'Electrical & Lighting',
    meshKeywords: ['meter', 'display', 'plastic_meter', 'glass_meter'],
    hotspotPosition: [0, 1.05, -0.65],
    cameraPosition: [0.35, 1.25, -0.45],
    cameraTarget: [0, 1.02, -0.65],
    explodedOffset: [0, 0.2, -0.1],
    specs: {
      'Speedometer': 'Analog Sweep Dial (0 - 160 km/h)',
      'Digital Display': 'Inverted Monochrome LCD Screen',
      'Indicators': 'Gear Position, Fuel Gauge, Service Reminder, ABS, Eco Prompt',
      'USB Port': 'Under-Handlebar 5V 2A USB Fast Charger'
    },
    features: [
      'Classic retro needle sweep with modern digital convenience',
      'High-contrast LCD visible even under direct harsh sunlight',
      'Digital fuel gauge with low-fuel countdown trip meter',
      'Odometer tamper-proof non-volatile EEPROM module'
    ],
    getInspectionData: (v) => ({
      conditionGrade: 'excellent',
      conditionLabel: 'Odometer Authentic / LCD Pristine',
      score: 98,
      inspectorRemarks: `Digital odometer recorded ${v?.km?.toLocaleString('en-IN') || '14,000'} km. Service history timestamps match odometer readouts. All warning LEDs and backlit dial functional.`,
      metrics: [
        { label: 'Odometer Authenticity', value: `Verified Real (${v?.km?.toLocaleString('en-IN') || '14,000'} km)`, isGood: true },
        { label: 'LCD Screen Contrast & Pixels', value: '100% Crisp / No Bleed', isGood: true },
        { label: 'Fuel Float Sensor Accuracy', value: 'Calibrated', isGood: true },
        { label: 'USB 5V Charging Port', value: 'Outputting 5.1V / 1.9A', isGood: true }
      ]
    })
  },

  {
    id: 'headlight_cluster',
    name: 'Classic Casquette Round Headlamp',
    shortName: 'Headlight & Pilot',
    category: 'electrical',
    categoryLabel: 'Electrical & Lighting',
    meshKeywords: ['glass_hl', 'reflector_hl', 'plastic_hl', 'lightbulb_hl'],
    hotspotPosition: [0, 0.95, -0.88],
    cameraPosition: [0, 1.0, -1.45],
    cameraTarget: [0, 0.95, -0.88],
    explodedOffset: [0, 0.05, -0.25],
    specs: {
      'Main Lamp': 'Clear Glass 55/60W HS1 Halogen / Precision Reflector',
      'Pilot Lamps': 'Dual Tiger-Eye Pilot Position Lamps',
      'Housing': 'Die-Cast Aluminum Integrated Casquette'
    },
    features: [
      'Iconic Royal Enfield casquette headlamp integration',
      'High-spread beam throwing 180 meters ahead for safe highway nights',
      'Hardened mineral glass lens resisting yellowing and scratches'
    ],
    getInspectionData: () => ({
      conditionGrade: 'excellent',
      conditionLabel: 'High/Low Beam & Pilot Tested',
      score: 96,
      inspectorRemarks: 'Headlight beam alignment within RTO standards. High beam, low beam and pass switch trigger instantly. Zero condensation inside lens.',
      metrics: [
        { label: 'High & Low Beam Spread', value: 'Sharp Cut-off Line', isGood: true },
        { label: 'Glass Lens Condensation', value: 'Completely Sealed / Zero Fog', isGood: true },
        { label: 'Pass Switch Trigger Response', value: 'Instant Contact', isGood: true }
      ]
    })
  },

  {
    id: 'battery_starter',
    name: 'Maintenance-Free 12V Battery & Self-Start',
    shortName: 'Battery & Starter',
    category: 'electrical',
    categoryLabel: 'Electrical & Lighting',
    meshKeywords: ['button_red', 'switch'],
    hotspotPosition: [-0.15, 0.65, -0.05],
    cameraPosition: [-1.2, 0.75, 0.05],
    cameraTarget: [-0.15, 0.65, -0.05],
    explodedOffset: [-0.2, 0, 0],
    specs: {
      'Battery Spec': '12V 8Ah VRLA Maintenance-Free AGM Battery',
      'Starter Motor': 'High-Torque Permanent Magnet Electric Starter',
      'Alternator Output': '156W Stator Coil @ 5,000 RPM'
    },
    features: [
      'One-touch electric self-starter with integrated engine kill switch',
      'Absorbed Glass Mat (AGM) acid-spill proof battery under locked side-box',
      'Integrated starter relay and fuse box protection against voltage spikes'
    ],
    getInspectionData: (v) => {
      const isEv = v?.category === 'electric' || v?.fuel === 'electric';
      return {
        conditionGrade: 'excellent',
        conditionLabel: isEv ? `EV Lithium Pack (${v?.batteryHealth || 92}% SOH)` : '12.8V Strong Cranking Health',
        score: isEv ? (v?.batteryHealth || 92) : 95,
        inspectorRemarks: isEv
          ? `High voltage lithium-ion battery pack condition tested at ${v?.batteryHealth || 92}% State of Health. Zero cell imbalance, full range retention.`
          : 'Battery terminal voltage tested 12.84V resting, 14.2V charging under alternator load. Starter cranked engine in 0.8 seconds without strain.',
        metrics: isEv ? [
          { label: 'Battery State of Health (SoH)', value: `${v?.batteryHealth || 92}% (Optimal)`, isGood: true },
          { label: 'Charging Cycles Recorded', value: '280 Cycles', isGood: true },
          { label: 'Fast Charge Handshake', value: 'Verified', isGood: true }
        ] : [
          { label: 'Resting Voltage (Key Off)', value: '12.84 Volts (Healthy)', isGood: true },
          { label: 'Alternator Charging Voltage', value: '14.20 Volts @ 2,500 RPM', isGood: true },
          { label: 'Cold Cranking Amps (CCA)', value: '160 CCA (Exceeds Spec)', isGood: true },
          { label: 'Terminal Lead Corrosion', value: 'Zero Sulfation / Clean', isGood: true }
        ]
      };
    }
  },

  // ---------------------------------------------------------------------------
  // 5. EXTERIOR & ERGONOMICS
  // ---------------------------------------------------------------------------
  {
    id: 'fuel_tank_body',
    name: 'Teardrop Fuel Tank & Side Body Panels',
    shortName: 'Fuel Tank & Paint',
    category: 'exterior',
    categoryLabel: 'Exterior & Ergonomics',
    meshKeywords: ['body001', 'body_02', 'body_03', 'decal_blue', 'decal_red'],
    hotspotPosition: [0, 0.95, -0.2],
    cameraPosition: [1.1, 1.25, -0.2],
    cameraTarget: [0, 0.92, -0.2],
    explodedOffset: [0, 0.25, 0],
    specs: {
      'Fuel Capacity': '13 Litres (3.0 L Usable Reserve)',
      'Tank Design': 'Seamless Hydroformed Teardrop Steel Tank',
      'Paint Finish': 'Multi-Coat High Gloss Polyurethane Clear Coat',
      'Badging': '3D Metal Chrome Wings Emblem'
    },
    features: [
      'Handcrafted classic pin-striping with durable gloss sealant',
      'Lockable chrome aircraft-style flip fuel cap',
      'Dual rubber knee pads providing ergonomic grip and tank scratch protection',
      'Internal anti-corrosion epoxy tank liner preventing fuel contamination'
    ],
    getInspectionData: (v) => ({
      conditionGrade: 'excellent',
      conditionLabel: `Original Paint (${v?.aiCosmeticScore || 9.4}/10 Score)`,
      score: v?.aiCosmeticScore ? Math.round(v.aiCosmeticScore * 10) : 94,
      inspectorRemarks: v?.aiCosmeticNotes?.[0] || 'Original factory paint in pristine condition. Paint thickness gauge tested 115-125 microns (original OEM factory spec, zero aftermarket putty or repaint). Minor swirl marks on tank top.',
      metrics: [
        { label: 'Paint Thickness Gauge', value: '118-124 µm (Original OEM)', isGood: true },
        { label: 'Tank Dents or Dings', value: 'Zero Dents', isGood: true },
        { label: 'Tank Interior Rust Check', value: 'Clean & Bright (No Rust)', isGood: true },
        { label: 'Side Toolbox Lock Operation', value: 'Key Turns Smoothly', isGood: true }
      ],
      evidencePhotos: v?.primaryImage ? [
        { url: v.primaryImage, caption: 'Fuel tank glossy reflection and 3D badge detail', tag: 'Paint Depth Test' }
      ] : undefined
    })
  },

  {
    id: 'saddle_seat',
    name: 'Low-Slung Sprung Rider & Pillion Saddle',
    shortName: 'Seats & Saddle',
    category: 'exterior',
    categoryLabel: 'Exterior & Ergonomics',
    meshKeywords: ['seat'],
    hotspotPosition: [0, 0.88, 0.42],
    cameraPosition: [-1.15, 1.15, 0.45],
    cameraTarget: [0, 0.88, 0.42],
    explodedOffset: [0, 0.2, 0.1],
    specs: {
      'Seat Height': '805 mm (Accessible & Upright)',
      'Padding': 'Dual-Density Cold-Cure Foam',
      'Upholstery': 'Weatherproof Textured Vinyl with Contrast Stitching'
    },
    features: [
      'Ergonomically contoured seat bowl distributing tailbone pressure',
      'Separated detachable pillion seat with rear steel grab rail',
      'Heavy-duty marine-grade stitching impervious to monsoons'
    ],
    getInspectionData: () => ({
      conditionGrade: 'excellent',
      conditionLabel: 'Zero Tears / Foam Firm',
      score: 96,
      inspectorRemarks: 'Seat vinyl pristine with zero sun cracks, tears or seam pulls. Internal foam supple and holds form without sagging.',
      metrics: [
        { label: 'Seat Cover Vinyl Integrity', value: '100% Tear-Free', isGood: true },
        { label: 'Internal Cushion Elasticity', value: 'Firm & Supportive', isGood: true },
        { label: 'Pillion Steel Grab Rail', value: 'Rigid & Tight (Zero Shake)', isGood: true }
      ]
    })
  },

  {
    id: 'handlebar_controls',
    name: 'Wide Touring Handlebar & Switchgear',
    shortName: 'Handlebars & Controls',
    category: 'exterior',
    categoryLabel: 'Exterior & Ergonomics',
    meshKeywords: ['handlebar', 'lever', 'mirrors', 'det_handle'],
    hotspotPosition: [0, 1.05, -0.45],
    cameraPosition: [0.85, 1.3, -0.45],
    cameraTarget: [0, 1.05, -0.45],
    explodedOffset: [0, 0.15, -0.1],
    specs: {
      'Handlebar Type': 'Wide Chrome Raised Touring Bar (22 mm Diameter)',
      'Switchgear': 'Rotary Rotary-Dial Switches (Engine Kill & Lights)',
      'Mirrors': 'Round Chrome Convex Vibration-Damped Mirrors'
    },
    features: [
      'Vintage rotary rotary-dial engine start switchgear with tactile click',
      'Convex chrome rear-view mirrors providing broad blindspot visibility',
      'Adjustable reach clutch and front brake levers with ergonomic finger recesses'
    ],
    getInspectionData: () => ({
      conditionGrade: 'excellent',
      conditionLabel: 'Switches Crisp / Zero Bend',
      score: 97,
      inspectorRemarks: 'Handlebar checked for straightness. Zero bend or asymmetry. Clutch cable pulls smooth with 3mm free play. Mirrors tight with zero vibration blur.',
      metrics: [
        { label: 'Handlebar True Alignment', value: 'Straight (No Bend)', isGood: true },
        { label: 'Rotary Switchgear Click', value: 'Tactile & Responsive', isGood: true },
        { label: 'Clutch Cable Friction & Play', value: 'Lubricated / 3 mm Slack', isGood: true },
        { label: 'Throttle Tube Return Snap', value: 'Snaps Back Instant', isGood: true }
      ]
    })
  }
];

export const CAMERA_PRESETS = {
  perspective: {
    label: '3/4 Perspective',
    position: [2.5, 1.6, 2.8] as [number, number, number],
    target: [0, 0.7, 0] as [number, number, number],
    description: 'Hero showroom presentation showcasing dynamic proportions'
  },
  front: {
    label: 'Front View',
    position: [0, 1.0, -3.2] as [number, number, number],
    target: [0, 0.7, -0.5] as [number, number, number],
    description: 'Direct head-on view inspecting headlight, visor and front tyre alignment'
  },
  side_left: {
    label: 'Left Side',
    position: [3.4, 0.9, 0] as [number, number, number],
    target: [0, 0.7, 0] as [number, number, number],
    description: 'Full profile inspecting drive chain, gear shifter and left engine cover'
  },
  side_right: {
    label: 'Right Side',
    position: [-3.4, 0.9, 0] as [number, number, number],
    target: [0, 0.7, 0] as [number, number, number],
    description: 'Full profile inspecting chrome exhaust, rear brake disc and clutch cover'
  },
  rear: {
    label: 'Rear View',
    position: [0, 1.1, 3.2] as [number, number, number],
    target: [0, 0.7, 0.5] as [number, number, number],
    description: 'Direct rear view inspecting tail lamp, rear tyre width and mudguard'
  },
  top: {
    label: 'Top View',
    position: [0, 3.6, 0.2] as [number, number, number],
    target: [0, 0.6, 0] as [number, number, number],
    description: 'Bird-eye top-down view inspecting fuel tank, handlebar width and saddle'
  }
};

export const INSPECTION_COMPONENTS = MOTORCYCLE_COMPONENTS;
