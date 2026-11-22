import * as THREE from 'three';

export interface PaintColorOption {
  id: string;
  name: string;
  hex: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  isMatte?: boolean;
  isMetallic?: boolean;
}

export const PAINT_COLOR_SWATCHES: PaintColorOption[] = [
  { id: 'racing-red', name: 'Racing Red', hex: '#dc2626', metalness: 0.7, roughness: 0.25 },
  { id: 'midnight-black', name: 'Midnight Black', hex: '#111827', metalness: 0.85, roughness: 0.18 },
  { id: 'racing-blue', name: 'Racing Blue', hex: '#2563eb', metalness: 0.75, roughness: 0.22 },
  { id: 'forest-green', name: 'Forest Green', hex: '#15803d', metalness: 0.7, roughness: 0.28 },
  { id: 'gunmetal-grey', name: 'Gunmetal Grey', hex: '#4b5563', metalness: 0.9, roughness: 0.3 },
  { id: 'pearl-white', name: 'Pearl White', hex: '#f8fafc', metalness: 0.4, roughness: 0.15 },
  { id: 'sunset-orange', name: 'Sunset Orange', hex: '#ea580c', metalness: 0.75, roughness: 0.24 },
  { id: 'matte-black', name: 'Matte Stealth Black', hex: '#1c1917', metalness: 0.15, roughness: 0.85, isMatte: true },
  { id: 'metallic-silver', name: 'Metallic Silver', hex: '#cbd5e1', metalness: 0.95, roughness: 0.15, isMetallic: true },
];

/**
 * High-precision keyword categorization for automotive 3D models.
 * Strictly isolates body panels and paintable fairings from mechanical and glass parts.
 */
export const PAINTABLE_KEYWORDS = [
  'tank',
  'fuel_tank',
  'fueltank',
  'fairing',
  'cowl',
  'cowling',
  'body',
  'panel',
  'bodywork',
  'mudguard',
  'fender',
  'tail',
  'visor',
  'sidecover',
  'side_cover',
  'tank_cover',
  'chassis_body',
  'paint',
  'exterior',
  'front_fender',
  'rear_fender'
];

export const PROTECTED_KEYWORDS = [
  'tire',
  'tyre',
  'wheel',
  'rim',
  'spoke',
  'seat',
  'saddle',
  'leather',
  'engine',
  'cylinder',
  'carburetor',
  'exhaust',
  'silencer',
  'muffler',
  'pipe',
  'header',
  'brake',
  'caliper',
  'disc',
  'rotor',
  'chain',
  'sprocket',
  'fork',
  'suspension',
  'shock',
  'spring',
  'glass',
  'lens',
  'mirror',
  'light',
  'lamp',
  'headlamp',
  'taillamp',
  'bulb',
  'indicator',
  'turn_signal',
  'chrome',
  'handle',
  'handlebar',
  'grip',
  'lever',
  'cable',
  'bolt',
  'screw',
  'footrest',
  'peg',
  'kickstand'
];

/**
 * Checks whether a 3D mesh is a paintable body surface according to its hierarchy and mesh name.
 */
export function isPaintableMesh(mesh: THREE.Mesh): boolean {
  const meshName = (mesh.name || '').toLowerCase();
  const parentName = (mesh.parent?.name || '').toLowerCase();
  const matName = Array.isArray(mesh.material)
    ? mesh.material.map(m => m.name.toLowerCase()).join(' ')
    : (mesh.material?.name || '').toLowerCase();

  const combined = `${meshName} ${parentName} ${matName}`;

  // First check if it matches protected mechanical/rubber/glass keywords
  const isProtected = PROTECTED_KEYWORDS.some(kw => combined.includes(kw));
  if (isProtected) {
    // Exception: if explicitly named tank or fairing, allow only if not tire/seat/glass/engine
    if (combined.includes('tire') || combined.includes('seat') || combined.includes('glass') || combined.includes('engine')) {
      return false;
    }
  }

  // Check if it matches any paintable keyword
  return PAINTABLE_KEYWORDS.some(kw => combined.includes(kw));
}
