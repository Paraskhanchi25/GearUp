/**
 * GEAR UP 3D Vehicle Twin Registry
 * Centralized metadata registry mapping Indian motorcycles, scooters,
 * and electric two-wheelers to verified 3D assets, component hierarchies,
 * camera framing, and interactive capabilities.
 */

export interface Vehicle3DMetadata {
  id: string;
  vehicleId?: string;
  brand: string;
  model: string;
  variant: string;
  category: 'cruiser' | 'commuter' | 'sports' | 'naked' | 'scooter' | 'electric_scooter';
  fuelType: 'petrol' | 'electric';
  modelPath: string;
  format: 'glb';
  compression: 'draco' | 'standard';
  isGenericRepresentation: boolean;
  representationLabel: string;
  scale: number;
  rotationCorrection: [number, number, number];
  initialCameraPosition: [number, number, number];
  initialCameraTarget: [number, number, number];
  supportedFeatures: {
    componentInspection: boolean;
    explodedView: boolean;
    colorCustomization: boolean;
  };
  components: string[];
  colorCustomization?: {
    bodyMeshKeywords: string[];
    accentMeshKeywords: string[];
    palette: { name: string; hex: string }[];
  };
  license: string;
  attribution: string;
  status: 'active' | 'beta' | 'fallback';
}

export const VEHICLE_3D_REGISTRY: Record<string, Vehicle3DMetadata> = {
  // 1. Royal Enfield Classic 350 / Cruiser Category
  're-classic-350': {
    id: 're-classic-350',
    vehicleId: 'bike-001',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    variant: 'Dual Channel ABS / Halcyon',
    category: 'cruiser',
    fuelType: 'petrol',
    modelPath: '/models/motorcycles/cruiser/royal-enfield-classic.glb',
    format: 'glb',
    compression: 'draco',
    isGenericRepresentation: false,
    representationLabel: 'Royal Enfield Classic 350 Digital Twin',
    scale: 0.95,
    rotationCorrection: [0, 0, 0],
    initialCameraPosition: [2.2, 1.2, 2.4],
    initialCameraTarget: [0, 0.65, 0],
    supportedFeatures: {
      componentInspection: true,
      explodedView: true,
      colorCustomization: true
    },
    components: [
      'engine_assembly',
      'exhaust_system',
      'fuel_tank',
      'front_wheel_brake',
      'rear_wheel_brake',
      'front_telescopic_forks',
      'rear_twin_shock_absorbers',
      'steering_cone_set',
      'rider_seat',
      'electrical_battery',
      'headlamp_nacelle',
      'drive_chain_sprocket',
      'chassis_cradle_frame',
      'instrument_console'
    ],
    colorCustomization: {
      bodyMeshKeywords: ['tank', 'fender', 'mudguard', 'side_cover', 'box'],
      accentMeshKeywords: ['rim', 'fork', 'frame'],
      palette: [
        { name: 'Desert Sand / Chrome', hex: '#D2B48C' },
        { name: 'British Racing Green', hex: '#1C3829' },
        { name: 'Stealth Matte Black', hex: '#242622' },
        { name: 'Halcyon Forest Green', hex: '#35483C' },
        { name: 'Fireball Crimson Red', hex: '#8B1E1E' }
      ]
    },
    license: 'Creative Commons Attribution (CC-BY 4.0)',
    attribution: 'Verified Two-Wheeler Mesh Engine for GEAR UP Marketplace',
    status: 'active'
  },

  // 2. Honda Activa 6G / Scooter Category
  'honda-activa-6g': {
    id: 'honda-activa-6g',
    vehicleId: 'bike-002',
    brand: 'Honda',
    model: 'Activa 6G',
    variant: 'Deluxe PGM-FI LED',
    category: 'scooter',
    fuelType: 'petrol',
    modelPath: '/models/scooters/petrol/honda-activa.glb',
    format: 'glb',
    compression: 'standard',
    isGenericRepresentation: false,
    representationLabel: 'Honda Activa 6G Digital Twin',
    scale: 1.05,
    rotationCorrection: [0, 0, 0],
    initialCameraPosition: [2.0, 1.1, 2.2],
    initialCameraTarget: [0, 0.55, 0],
    supportedFeatures: {
      componentInspection: true,
      explodedView: false,
      colorCustomization: true
    },
    components: [
      'engine_assembly',
      'fuel_tank',
      'front_wheel_brake',
      'rear_wheel_brake',
      'rider_seat',
      'electrical_battery',
      'headlamp_nacelle'
    ],
    colorCustomization: {
      bodyMeshKeywords: ['body', 'apron', 'panel', 'fender'],
      accentMeshKeywords: ['seat', 'handle'],
      palette: [
        { name: 'Decent Blue Metallic', hex: '#1E3A8A' },
        { name: 'Pearl Siren Blue', hex: '#0284C7' },
        { name: 'Matte Axis Grey Metallic', hex: '#374151' },
        { name: 'Imperial Red Metallic', hex: '#991B1B' },
        { name: 'Pearl Precious White', hex: '#F9FAFB' }
      ]
    },
    license: 'Standard Commercial Evaluation License',
    attribution: 'GEAR UP Urban Scooter CAD Module',
    status: 'active'
  },

  // 3. Ather 450X / Electric Scooter Category
  'ather-450x': {
    id: 'ather-450x',
    vehicleId: 'bike-004',
    brand: 'Ather',
    model: '450X',
    variant: 'Gen 3 Pro Pack',
    category: 'electric_scooter',
    fuelType: 'electric',
    modelPath: '/models/scooter.glb',
    format: 'glb',
    compression: 'standard',
    isGenericRepresentation: true,
    representationLabel: 'Ather 450X Smart EV Architecture',
    scale: 1.05,
    rotationCorrection: [0, 0, 0],
    initialCameraPosition: [2.1, 1.1, 2.3],
    initialCameraTarget: [0, 0.55, 0],
    supportedFeatures: {
      componentInspection: true,
      explodedView: false,
      colorCustomization: true
    },
    components: [
      'engine_assembly',
      'front_wheel_brake',
      'rear_wheel_brake',
      'rider_seat',
      'electrical_battery',
      'headlamp_nacelle'
    ],
    colorCustomization: {
      bodyMeshKeywords: ['body', 'panel'],
      accentMeshKeywords: ['frame', 'wheel'],
      palette: [
        { name: 'Space Grey', hex: '#374151' },
        { name: 'Mint Green Accent', hex: '#10B981' },
        { name: 'True White', hex: '#FFFFFF' },
        { name: 'Cosmic Black', hex: '#111827' }
      ]
    },
    license: 'Standard Digital Twin Visualization License',
    attribution: 'Ather EV Platform Representative Digital Twin',
    status: 'active'
  },

  // 4. Yamaha R15 V4 / Sports Category
  'yamaha-r15': {
    id: 'yamaha-r15',
    vehicleId: 'bike-003',
    brand: 'Yamaha',
    model: 'YZF R15 V4',
    variant: 'Racing Blue VVA',
    category: 'sports',
    fuelType: 'petrol',
    modelPath: '/models/motorcycles/cruiser/royal-enfield-classic.glb',
    format: 'glb',
    compression: 'draco',
    isGenericRepresentation: true,
    representationLabel: 'Performance Motorcycle Digital Twin',
    scale: 0.95,
    rotationCorrection: [0, 0, 0],
    initialCameraPosition: [2.2, 1.2, 2.4],
    initialCameraTarget: [0, 0.65, 0],
    supportedFeatures: {
      componentInspection: true,
      explodedView: true,
      colorCustomization: true
    },
    components: [
      'engine_assembly',
      'exhaust_system',
      'fuel_tank',
      'front_wheel_brake',
      'rear_wheel_brake',
      'front_telescopic_forks',
      'rear_twin_shock_absorbers',
      'steering_cone_set',
      'rider_seat',
      'electrical_battery',
      'headlamp_nacelle',
      'drive_chain_sprocket'
    ],
    license: 'Creative Commons Attribution (CC-BY 4.0)',
    attribution: 'Performance Motorcycle Twin Module',
    status: 'active'
  }
};

/**
 * Resolves 3D twin metadata for any given vehicle query.
 * Falls back safely to compatible category model when exact model is not registered.
 */
export function getVehicle3DMetadata(
  query?: { id?: string; brand?: string; model?: string; category?: string; fuel?: string } | null
): Vehicle3DMetadata {
  if (!query) {
    return VEHICLE_3D_REGISTRY['re-classic-350'];
  }

  // 1. Direct ID match
  if (query.id && VEHICLE_3D_REGISTRY[query.id]) {
    return VEHICLE_3D_REGISTRY[query.id];
  }

  // 2. Check by registered vehicleId
  for (const item of Object.values(VEHICLE_3D_REGISTRY)) {
    if (query.id && item.vehicleId === query.id) {
      return item;
    }
  }

  const modelLower = (query.model || '').toLowerCase();
  const brandLower = (query.brand || '').toLowerCase();
  const categoryLower = (query.category || '').toLowerCase();
  const fuelLower = (query.fuel || '').toLowerCase();

  // 3. Royal Enfield / Cruiser match
  if (brandLower.includes('royal enfield') || modelLower.includes('classic') || modelLower.includes('bullet') || modelLower.includes('meteor') || modelLower.includes('hunter')) {
    return VEHICLE_3D_REGISTRY['re-classic-350'];
  }

  // 4. Ather / EV Scooter match
  if (brandLower.includes('ather') || modelLower.includes('ather') || fuelLower === 'electric') {
    return VEHICLE_3D_REGISTRY['ather-450x'];
  }

  // 5. Scooter category match (Activa, Jupiter, Access, Dio)
  if (categoryLower.includes('scooter') || modelLower.includes('activa') || modelLower.includes('jupiter') || modelLower.includes('access') || modelLower.includes('dio')) {
    return VEHICLE_3D_REGISTRY['honda-activa-6g'];
  }

  // 6. Sports / Performance category match
  if (modelLower.includes('r15') || modelLower.includes('duke') || modelLower.includes('rc') || modelLower.includes('mt-15') || categoryLower.includes('sports')) {
    return VEHICLE_3D_REGISTRY['yamaha-r15'];
  }

  // 7. Default motorcycle fallback
  return VEHICLE_3D_REGISTRY['re-classic-350'];
}
