import * as THREE from 'three';

export type EnvironmentPresetId = 
  | 'showroom' 
  | 'garage_night' 
  | 'outdoor_daylight' 
  | 'neon_underground' 
  | 'golden_hour';

export interface EnvironmentPreset {
  id: EnvironmentPresetId;
  name: string;
  tagline: string;
  badge: string;
  background: {
    color: number;
    skyTop?: string;
    skyBottom?: string;
  };
  fog: {
    color: number;
    near: number;
    far: number;
    density: number;
  };
  ambientLight: {
    color: number;
    intensity: number;
  };
  keyLight: {
    color: number;
    intensity: number;
    position: [number, number, number];
  };
  fillLight: {
    color: number;
    intensity: number;
    position: [number, number, number];
  };
  rimLight: {
    color: number;
    intensity: number;
    position: [number, number, number];
  };
  floor: {
    color: number;
    roughness: number;
    metalness: number;
    gridColor: number;
    ringColor: number;
    showRings: boolean;
  };
  envReflectionIntensity: number;
  defaultAccent: string;
  particleType: 'none' | 'garage_dust' | 'neon_sparkles';
  postprocessing: {
    bloomSupported: boolean;
    bloomStrength: number;
    bloomThreshold: number;
    bloomRadius: number;
  };
}

export const ENVIRONMENT_PRESETS: Record<EnvironmentPresetId, EnvironmentPreset> = {
  showroom: {
    id: 'showroom',
    name: 'Showroom Studio',
    tagline: 'Dark Emerald Automotive Showroom',
    badge: 'Flagship Studio',
    background: {
      color: 0x060C0A,
      skyTop: '#060C0A',
      skyBottom: '#0e1f18'
    },
    fog: {
      color: 0x060C0A,
      near: 4.0,
      far: 24.0,
      density: 0.05
    },
    ambientLight: {
      color: 0xdcfce7,
      intensity: 0.75
    },
    keyLight: {
      color: 0xffffff,
      intensity: 2.4,
      position: [3.5, 4.5, 3.5]
    },
    fillLight: {
      color: 0x059669,
      intensity: 0.8,
      position: [-3.5, 2.5, -3.5]
    },
    rimLight: {
      color: 0x10b981,
      intensity: 1.6,
      position: [0.0, 3.0, -4.0]
    },
    floor: {
      color: 0x08130e,
      roughness: 0.45,
      metalness: 0.7,
      gridColor: 0x0d281e,
      ringColor: 0x10b981,
      showRings: true
    },
    envReflectionIntensity: 1.2,
    defaultAccent: '#10b981',
    particleType: 'none',
    postprocessing: {
      bloomSupported: false,
      bloomStrength: 0.35,
      bloomThreshold: 0.85,
      bloomRadius: 0.2
    }
  },

  garage_night: {
    id: 'garage_night',
    name: 'Garage Night',
    tagline: 'Industrial Underground Workshop',
    badge: 'Underground',
    background: {
      color: 0x0e1114,
      skyTop: '#0b0d10',
      skyBottom: '#181b20'
    },
    fog: {
      color: 0x0e1114,
      near: 3.0,
      far: 18.0,
      density: 0.075
    },
    ambientLight: {
      color: 0x94a3b8,
      intensity: 0.45
    },
    keyLight: {
      color: 0xffedd5,
      intensity: 2.2,
      position: [2.5, 4.0, 2.0]
    },
    fillLight: {
      color: 0xf97316,
      intensity: 1.1,
      position: [-4.0, 1.8, -2.5]
    },
    rimLight: {
      color: 0xfb923c,
      intensity: 1.8,
      position: [0.0, 2.8, -3.8]
    },
    floor: {
      color: 0x13171b,
      roughness: 0.8,
      metalness: 0.35,
      gridColor: 0x242b32,
      ringColor: 0xf97316,
      showRings: false
    },
    envReflectionIntensity: 0.8,
    defaultAccent: '#f97316',
    particleType: 'garage_dust',
    postprocessing: {
      bloomSupported: false,
      bloomStrength: 0.4,
      bloomThreshold: 0.8,
      bloomRadius: 0.25
    }
  },

  outdoor_daylight: {
    id: 'outdoor_daylight',
    name: 'Outdoor Daylight',
    tagline: 'Clear Sky Natural Sunlight',
    badge: 'True Color',
    background: {
      color: 0x7eb0d5,
      skyTop: '#60a5fa',
      skyBottom: '#e0f2fe'
    },
    fog: {
      color: 0xbcd8ec,
      near: 8.0,
      far: 35.0,
      density: 0.02
    },
    ambientLight: {
      color: 0xf8fafc,
      intensity: 1.1
    },
    keyLight: {
      color: 0xfffbeb,
      intensity: 2.9,
      position: [5.5, 8.5, 4.5]
    },
    fillLight: {
      color: 0x93c5fd,
      intensity: 0.9,
      position: [-4.5, 4.0, -3.5]
    },
    rimLight: {
      color: 0xe0f2fe,
      intensity: 1.2,
      position: [1.0, 4.5, -4.5]
    },
    floor: {
      color: 0xcfd6dc,
      roughness: 0.9,
      metalness: 0.1,
      gridColor: 0xa9b4bc,
      ringColor: 0x3b82f6,
      showRings: false
    },
    envReflectionIntensity: 1.4,
    defaultAccent: '#3b82f6',
    particleType: 'none',
    postprocessing: {
      bloomSupported: false,
      bloomStrength: 0.2,
      bloomThreshold: 0.95,
      bloomRadius: 0.1
    }
  },

  neon_underground: {
    id: 'neon_underground',
    name: 'Neon Underground',
    tagline: 'Cyberpunk Midnight Cyber-Bay',
    badge: 'Sci-Fi Glow',
    background: {
      color: 0x05020c,
      skyTop: '#030107',
      skyBottom: '#17062e'
    },
    fog: {
      color: 0x05020c,
      near: 3.5,
      far: 20.0,
      density: 0.065
    },
    ambientLight: {
      color: 0x3b0764,
      intensity: 0.55
    },
    keyLight: {
      color: 0x06b6d4,
      intensity: 2.6,
      position: [3.8, 3.2, 3.0]
    },
    fillLight: {
      color: 0xd946ef,
      intensity: 2.4,
      position: [-3.8, 2.5, -3.0]
    },
    rimLight: {
      color: 0xa855f7,
      intensity: 2.8,
      position: [0.0, 3.5, -4.5]
    },
    floor: {
      color: 0x090514,
      roughness: 0.35,
      metalness: 0.85,
      gridColor: 0x2e1065,
      ringColor: 0x06b6d4,
      showRings: true
    },
    envReflectionIntensity: 1.6,
    defaultAccent: '#06b6d4',
    particleType: 'neon_sparkles',
    postprocessing: {
      bloomSupported: true,
      bloomStrength: 0.85,
      bloomThreshold: 0.28,
      bloomRadius: 0.45
    }
  },

  golden_hour: {
    id: 'golden_hour',
    name: 'Golden Hour',
    tagline: 'Warm Horizon Sunset Studio',
    badge: 'Cinematic Amber',
    background: {
      color: 0x180b05,
      skyTop: '#1e0c05',
      skyBottom: '#421a08'
    },
    fog: {
      color: 0x180b05,
      near: 4.0,
      far: 22.0,
      density: 0.055
    },
    ambientLight: {
      color: 0xfef3c7,
      intensity: 0.7
    },
    keyLight: {
      color: 0xfbbf24,
      intensity: 3.0,
      position: [6.5, 3.0, 3.5]
    },
    fillLight: {
      color: 0xf97316,
      intensity: 1.4,
      position: [-4.0, 2.0, -3.0]
    },
    rimLight: {
      color: 0xfde68a,
      intensity: 2.2,
      position: [-1.0, 2.5, -4.5]
    },
    floor: {
      color: 0x140a05,
      roughness: 0.5,
      metalness: 0.65,
      gridColor: 0x3d1b0d,
      ringColor: 0xf59e0b,
      showRings: true
    },
    envReflectionIntensity: 1.3,
    defaultAccent: '#f59e0b',
    particleType: 'none',
    postprocessing: {
      bloomSupported: false,
      bloomStrength: 0.45,
      bloomThreshold: 0.75,
      bloomRadius: 0.3
    }
  }
};

export const ACCENT_COLOR_OPTIONS = [
  { id: 'cyan', name: 'Cyan Glow', hex: '#06b6d4', colorNum: 0x06b6d4 },
  { id: 'purple', name: 'Neon Purple', hex: '#a855f7', colorNum: 0xa855f7 },
  { id: 'emerald', name: 'Emerald Showroom', hex: '#10b981', colorNum: 0x10b981 },
  { id: 'blue', name: 'Racing Blue', hex: '#3b82f6', colorNum: 0x3b82f6 },
  { id: 'red', name: 'Brembo Red', hex: '#ef4444', colorNum: 0xef4444 },
  { id: 'amber', name: 'Sunset Amber', hex: '#f59e0b', colorNum: 0xf59e0b },
];
