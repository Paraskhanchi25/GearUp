import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import gsap from 'gsap';

import { 
  MOTORCYCLE_COMPONENTS, 
  CAMERA_PRESETS, 
  InspectionComponentDef, 
  ComponentCategory 
} from './inspectionComponentData';
import { 
  EnvironmentPresetId, 
  EnvironmentPreset, 
  ENVIRONMENT_PRESETS,
  ACCENT_COLOR_OPTIONS
} from './environmentPresets';
import { 
  PAINT_COLOR_SWATCHES, 
  isPaintableMesh 
} from './paintPresets';
import { 
  buildWorkshopEnvironment, 
  disposeWorkshopEnvironment,
  WorkshopEnvironmentResult 
} from './workshopEnvironment';
import { EnvironmentControlPanel } from './EnvironmentControlPanel';
import { VehicleListing } from '../../types';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Compass, 
  Sparkles,
  AlertTriangle,
  Loader2,
  SlidersHorizontal,
  Camera,
  Check,
  FastForward
} from 'lucide-react';

export interface MotorcycleViewer3DProps {
  vehicle?: VehicleListing;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  activeCategory?: ComponentCategory | 'all';
  exploded?: boolean;
  onToggleExploded?: () => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
  showStudioControls?: boolean;
}

export const MotorcycleViewer3D: React.FC<MotorcycleViewer3DProps> = ({
  vehicle,
  selectedComponentId,
  onSelectComponent,
  activeCategory = 'all',
  exploded = false,
  onToggleExploded,
  fullscreen = false,
  onToggleFullscreen,
  className = '',
  showStudioControls = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Three.js Core Object Refs
  // ---------------------------------------------------------------------------
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const pmremGeneratorRef = useRef<THREE.PMREMGenerator | null>(null);

  // Postprocessing refs
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);

  // Lighting refs
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const underLightRef = useRef<THREE.PointLight | null>(null);

  // Floor & Ring Meshes
  const floorMeshRef = useRef<THREE.Mesh | null>(null);
  const innerRingRef = useRef<THREE.Mesh | null>(null);
  const outerRingRef = useRef<THREE.Mesh | null>(null);
  const workshopGroupRef = useRef<THREE.Group | null>(null);
  const workshopResultRef = useRef<WorkshopEnvironmentResult | null>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Particle System
  const particleSystemRef = useRef<THREE.Points | null>(null);

  // Cached Environment Radiance Maps & Original Materials
  const envMapCacheRef = useRef<Map<string, THREE.Texture>>(new Map());
  const originalMaterialsMap = useRef<Map<string, THREE.Material>>(new Map());
  const meshMapRef = useRef<Map<string, { mesh: THREE.Mesh; originalMat: THREE.Material; initialPos: THREE.Vector3 }>>(new Map());
  const clickableMeshesRef = useRef<THREE.Mesh[]>([]);
  const screenHotspotsRef = useRef<Array<{ id: string; name: string; category: string; x: number; y: number; visible: boolean }>>([]);

  // Camera transition state
  const cameraTargetPos = useRef<THREE.Vector3 | null>(null);
  const controlsTargetPos = useRef<THREE.Vector3 | null>(null);
  const isTransitioning = useRef<boolean>(false);

  // User Interaction & Inactivity Timer for Auto-Rotate
  const isUserInteracting = useRef<boolean>(false);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------------------------------------------------------------------------
  // Controlled Studio Environment State
  // ---------------------------------------------------------------------------
  const [currentEnvId, setCurrentEnvId] = useState<EnvironmentPresetId>('showroom');
  const [ambientIntensity, setAmbientIntensity] = useState<number>(0.75);
  const [keyLightIntensity, setKeyLightIntensity] = useState<number>(2.4);
  const [rimLightIntensity, setRimLightIntensity] = useState<number>(1.6);
  const [accentColor, setAccentColor] = useState<string>('#10b981');

  // Camera settings
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const autoRotateRef = useRef<boolean>(true);
  autoRotateRef.current = autoRotate;
  const [autoRotateSpeed, setAutoRotateSpeed] = useState<number>(0.8);
  const [fov, setFov] = useState<number>(45);

  // Rendering FX & Adaptive Performance
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [bloomEnabled, setBloomEnabled] = useState<boolean>(false);
  const [floorReflection, setFloorReflection] = useState<boolean>(true);
  const [qualityProfile, setQualityProfile] = useState<'high' | 'balanced' | 'performance'>(() => {
    if (typeof window === 'undefined') return 'high';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) return 'performance';
    if (window.innerWidth < 1280) return 'balanced';
    return 'high';
  });
  const [isIntroPlaying, setIsIntroPlaying] = useState<boolean>(false);

  // Performance cache refs (eliminates per-frame heap allocations & React re-render thrash)
  const tempVectorRef = useRef(new THREE.Vector3());
  const hotspotFrameCountRef = useRef(0);
  const lastCameraPosRef = useRef(new THREE.Vector3());

  // Paint Customization
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#dc2626');
  const [paintMetalness, setPaintMetalness] = useState<number>(0.75);
  const [paintRoughness, setPaintRoughness] = useState<number>(0.25);
  const [isCustomPaintActive, setIsCustomPaintActive] = useState<boolean>(false);

  // UI state
  const [isStudioDrawerOpen, setIsStudioDrawerOpen] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>('perspective');
  const [projectedHotspots, setProjectedHotspots] = useState<Array<{ id: string; name: string; category: string; x: number; y: number; visible: boolean }>>([]);
  const [screenshotSuccess, setScreenshotSuccess] = useState<boolean>(false);

  // Model URL determination (scooter vs motorcycle from existing verified data)
  const isScooter =
    vehicle?.category === 'scooter' ||
    vehicle?.category === 'electric' ||
    vehicle?.model?.toLowerCase().includes('activa') ||
    vehicle?.model?.toLowerCase().includes('jupiter') ||
    vehicle?.model?.toLowerCase().includes('ather') ||
    vehicle?.model?.toLowerCase().includes('s1') ||
    vehicle?.model?.toLowerCase().includes('chetak') ||
    vehicle?.model?.toLowerCase().includes('access');
  const modelUrl = isScooter ? '/models/scooter.glb' : '/models/motorcycle.glb';

  // ---------------------------------------------------------------------------
  // 1. GENERATE PMREM ENVIRONMENT RADIANCE MAP
  // ---------------------------------------------------------------------------
  const getOrCreateEnvMap = useCallback((preset: EnvironmentPreset, renderer: THREE.WebGLRenderer): THREE.Texture => {
    if (envMapCacheRef.current.has(preset.id)) {
      return envMapCacheRef.current.get(preset.id)!;
    }

    if (!pmremGeneratorRef.current) {
      pmremGeneratorRef.current = new THREE.PMREMGenerator(renderer);
      pmremGeneratorRef.current.compileEquirectangularShader();
    }

    // Build virtual studio radiance room
    const envScene = new THREE.Scene();
    const sphereGeo = new THREE.SphereGeometry(18, 32, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: preset.background.color,
      side: THREE.BackSide
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    envScene.add(sphere);

    // Warm & cool key radiance lights for reflections
    const rKey = new THREE.DirectionalLight(preset.keyLight.color, 2.5);
    rKey.position.set(...preset.keyLight.position);
    envScene.add(rKey);

    const rFill = new THREE.DirectionalLight(preset.fillLight.color, 1.8);
    rFill.position.set(...preset.fillLight.position);
    envScene.add(rFill);

    const renderTarget = pmremGeneratorRef.current.fromScene(envScene);
    sphereGeo.dispose();
    sphereMat.dispose();

    envMapCacheRef.current.set(preset.id, renderTarget.texture);
    return renderTarget.texture;
  }, []);

  // ---------------------------------------------------------------------------
  // 2. SETUP AMBIENT PARTICLE EFFECTS
  // ---------------------------------------------------------------------------
  const updateParticles = useCallback((preset: EnvironmentPreset, scene: THREE.Scene) => {
    // Remove existing particle system
    if (particleSystemRef.current) {
      scene.remove(particleSystemRef.current);
      particleSystemRef.current.geometry.dispose();
      (particleSystemRef.current.material as THREE.Material).dispose();
      particleSystemRef.current = null;
    }

    if (preset.particleType === 'none') return;

    if (preset.particleType === 'garage_dust') {
      const count = 120;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 1] = 0.15 + Math.random() * 2.8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xfbbf24,
        size: 0.038,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geo, mat);
      particleSystemRef.current = points;
      scene.add(points);
    } else if (preset.particleType === 'neon_sparkles') {
      const count = 160;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const cyan = new THREE.Color(0x06b6d4);
      const magenta = new THREE.Color(0xd946ef);

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 7;
        positions[i * 3 + 1] = 0.1 + Math.random() * 3.2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 7;

        const c = i % 2 === 0 ? cyan : magenta;
        colors[i * 3 + 0] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.048,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geo, mat);
      particleSystemRef.current = points;
      scene.add(points);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // CAMERA PRESETS & CINEMATIC WORKSHOP INTRO ANIMATION
  // ---------------------------------------------------------------------------
  const applyCameraPreset = useCallback((presetKey: string) => {
    setActivePreset(presetKey);
    onSelectComponent(null);

    const preset = (CAMERA_PRESETS as any)[presetKey] || CAMERA_PRESETS.perspective;
    cameraTargetPos.current = new THREE.Vector3(...preset.position);
    controlsTargetPos.current = new THREE.Vector3(...preset.target);
    isTransitioning.current = true;
  }, [onSelectComponent]);

  const playCinematicIntro = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current || !workshopResultRef.current) return;
    const { overheadLights, verticalWallLights, inspectionSpot } = workshopResultRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (introTimelineRef.current) {
      introTimelineRef.current.kill();
    }

    setIsIntroPlaying(true);
    controls.enabled = false;
    onSelectComponent(null);

    // Scene 1: Dark opening down the runway aisle
    camera.position.set(0, 1.75, 5.8);
    controls.target.set(0, 0.7, 0);

    overheadLights.forEach(({ mesh, light }) => {
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.05;
      if (light) light.intensity = 0;
    });
    verticalWallLights.forEach(({ mesh, light }) => {
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.05;
      if (light) light.intensity = 0;
    });
    if (ambientLightRef.current) ambientLightRef.current.intensity = 0.12;
    if (keyLightRef.current) keyLightRef.current.intensity = 0.2;
    if (rimLightRef.current) rimLightRef.current.intensity = 0;
    if (inspectionSpot) inspectionSpot.intensity = 0;

    const tl = gsap.timeline({
      onComplete: () => {
        controls.enabled = true;
        applyCameraPreset('perspective');
        setIsIntroPlaying(false);
      }
    });

    introTimelineRef.current = tl;

    // Scene 1 -> 2: Fade in ambient
    tl.to(ambientLightRef.current, { intensity: 0.65, duration: 1.0, ease: 'power1.inOut' }, 0.2);

    // Scene 2: Progressive activation of overhead chevron LED strip lights from back to front
    const maxRow = Math.max(...overheadLights.map(l => l.rowOrder));
    overheadLights.forEach(({ mesh, light, targetIntensity, rowOrder }) => {
      const delay = 0.6 + (rowOrder / maxRow) * 1.5;
      tl.to(
        (mesh.material as THREE.MeshStandardMaterial),
        { emissiveIntensity: 1.6, duration: 0.25, ease: 'power2.out' },
        delay
      );
      if (light) {
        tl.to(light, { intensity: targetIntensity, duration: 0.35, ease: 'power2.out' }, delay);
      }
    });

    // Vertical wall lights ignite in tandem
    verticalWallLights.forEach(({ mesh, light, targetIntensity, rowOrder }) => {
      const delay = 0.8 + (rowOrder / 8) * 1.4;
      tl.to(
        (mesh.material as THREE.MeshStandardMaterial),
        { emissiveIntensity: 1.2, duration: 0.3, ease: 'power2.out' },
        delay
      );
      if (light) {
        tl.to(light, { intensity: targetIntensity, duration: 0.4, ease: 'power2.out' }, delay);
      }
    });

    // Scene 3: Motorcycle reveal on hydraulic lift
    tl.to(inspectionSpot, { intensity: 2.6, duration: 0.8, ease: 'power2.inOut' }, 2.2);
    tl.to(keyLightRef.current, { intensity: keyLightIntensity, duration: 0.8, ease: 'power2.inOut' }, 2.2);
    tl.to(rimLightRef.current, { intensity: rimLightIntensity, duration: 0.8, ease: 'power2.inOut' }, 2.4);

    // Scene 4: Camera cinematic dolly & arc toward front 3/4 hero view
    tl.to(
      camera.position,
      {
        x: CAMERA_PRESETS.perspective.position[0],
        y: CAMERA_PRESETS.perspective.position[1],
        z: CAMERA_PRESETS.perspective.position[2],
        duration: 3.8,
        ease: 'power2.inOut'
      },
      0.8
    );

    tl.to(
      controls.target,
      {
        x: CAMERA_PRESETS.perspective.target[0],
        y: CAMERA_PRESETS.perspective.target[1],
        z: CAMERA_PRESETS.perspective.target[2],
        duration: 3.8,
        ease: 'power2.inOut'
      },
      0.8
    );
  }, [keyLightIntensity, rimLightIntensity, onSelectComponent, applyCameraPreset]);

  const skipCinematicIntro = useCallback(() => {
    if (introTimelineRef.current) {
      introTimelineRef.current.kill();
    }
    if (workshopResultRef.current) {
      const { overheadLights, verticalWallLights, inspectionSpot } = workshopResultRef.current;
      overheadLights.forEach(({ mesh, light, targetIntensity }) => {
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.6;
        if (light) light.intensity = targetIntensity;
      });
      verticalWallLights.forEach(({ mesh, light, targetIntensity }) => {
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
        if (light) light.intensity = targetIntensity;
      });
      if (inspectionSpot) inspectionSpot.intensity = 2.6;
    }
    if (ambientLightRef.current) ambientLightRef.current.intensity = ambientIntensity;
    if (keyLightRef.current) keyLightRef.current.intensity = keyLightIntensity;
    if (rimLightRef.current) rimLightRef.current.intensity = rimLightIntensity;

    if (cameraRef.current && controlsRef.current) {
      controlsRef.current.enabled = true;
      applyCameraPreset('perspective');
    }
    setIsIntroPlaying(false);
  }, [ambientIntensity, keyLightIntensity, rimLightIntensity, applyCameraPreset]);

  // ---------------------------------------------------------------------------
  // 3. SCENE INITIALIZATION & CLEANUP
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setLoadError('WebGL is not supported or is disabled in your browser.');
      setIsLoading(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const currentPreset = ENVIRONMENT_PRESETS[currentEnvId] || ENVIRONMENT_PRESETS.showroom;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(currentPreset.background.color);
    scene.fog = new THREE.FogExp2(currentPreset.fog.color, currentPreset.fog.density);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 50);
    const initialCam = CAMERA_PRESETS.perspective.position;
    camera.position.set(initialCam[0], initialCam[1], initialCam[2]);
    cameraRef.current = camera;

    // 3. Renderer with preserveDrawingBuffer for high-res screenshots
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      alpha: true
    });
    renderer.setSize(width, height);
    const targetPixelRatio = qualityProfile === 'high' ? Math.min(window.devicePixelRatio, 1.5) : (qualityProfile === 'balanced' ? Math.min(window.devicePixelRatio, 1.25) : 1.0);
    renderer.setPixelRatio(targetPixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = qualityProfile !== 'performance';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Set initial environment radiance map
    const envTexture = getOrCreateEnvMap(currentPreset, renderer);
    scene.environment = envTexture;

    // 4. Postprocessing Composer (UnrealBloomPass)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      currentPreset.postprocessing.bloomStrength,
      currentPreset.postprocessing.bloomRadius,
      currentPreset.postprocessing.bloomThreshold
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    composerRef.current = composer;
    bloomPassRef.current = bloomPass;

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.0;
    controls.maxDistance = 6.8;
    controls.minPolarAngle = 0.08; // Allows tilting up to look directly at ceiling, roof beams and LED lights
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Floor collision clamping
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    const initialTarget = CAMERA_PRESETS.perspective.target;
    controls.target.set(initialTarget[0], initialTarget[1], initialTarget[2]);
    controlsRef.current = controls;

    // Inactivity listener to pause/resume auto-rotation
    const handleUserInteractionStart = () => {
      isUserInteracting.current = true;
      controls.autoRotate = false;
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };

    const handleUserInteractionEnd = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        isUserInteracting.current = false;
        if (autoRotateRef.current && controlsRef.current) {
          controlsRef.current.autoRotate = true;
        }
      }, 3500);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', handleUserInteractionStart);
    domElem.addEventListener('pointerup', handleUserInteractionEnd);
    domElem.addEventListener('wheel', handleUserInteractionStart);
    domElem.addEventListener('wheel', handleUserInteractionEnd);
    domElem.addEventListener('touchstart', handleUserInteractionStart);
    domElem.addEventListener('touchend', handleUserInteractionEnd);

    // 6. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(currentPreset.ambientLight.color, ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(currentPreset.keyLight.color, keyLightIntensity);
    keyLight.position.set(...currentPreset.keyLight.position);
    keyLight.castShadow = qualityProfile !== 'performance';
    const shadowMapRes = qualityProfile === 'high' ? 2048 : 1024;
    keyLight.shadow.mapSize.width = shadowMapRes;
    keyLight.shadow.mapSize.height = shadowMapRes;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const rimLight = new THREE.DirectionalLight(currentPreset.rimLight.color, rimLightIntensity);
    rimLight.position.set(...currentPreset.rimLight.position);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const fillLight = new THREE.DirectionalLight(currentPreset.fillLight.color, currentPreset.fillLight.intensity);
    fillLight.position.set(...currentPreset.fillLight.position);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const underLight = new THREE.PointLight(new THREE.Color(accentColor), 0.9, 4.5);
    underLight.position.set(0, 0.15, 0);
    scene.add(underLight);
    underLightRef.current = underLight;

    // 7. Complete 3D Motorcycle Service Workshop Environment
    const workshopResult = buildWorkshopEnvironment(qualityProfile);
    workshopResultRef.current = workshopResult;
    workshopGroupRef.current = workshopResult.group;
    const floorMesh = workshopResult.group.getObjectByName('workshop_floor_mesh') as THREE.Mesh;
    if (floorMesh) {
      floorMeshRef.current = floorMesh;
    }
    scene.add(workshopResult.group);

    // Initialize particles
    updateParticles(currentPreset, scene);

    // 8. Load GLTF 3D Asset with local Draco decoder
    setIsLoading(true);
    setLoadingProgress(15);
    setLoadError(null);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/gltf/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      modelUrl,
      (gltf) => {
        const root = gltf.scene;
        modelRef.current = root;

        // Bounding Box Normalization
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.4 / (maxDim || 1);
        root.scale.setScalar(targetScale);

        // Center on (0, 0, 0) and position bottom onto hydraulic service lift platform surface
        root.position.x = -center.x * targetScale;
        root.position.z = -center.z * targetScale;
        root.position.y = -box.min.y * targetScale + 0.04;

        // Catalog meshes for raycasting, exploded view & paint customization
        const meshMap = new Map();
        const clickable: THREE.Mesh[] = [];

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const baseMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            originalMaterialsMap.current.set(mesh.name, baseMat);

            meshMap.set(mesh.name, {
              mesh,
              originalMat: baseMat,
              initialPos: mesh.position.clone()
            });

            clickable.push(mesh);
          }
        });

        meshMapRef.current = meshMap;
        clickableMeshesRef.current = clickable;

        scene.add(root);
        setIsLoading(false);
        setLoadingProgress(100);

        // Trigger cinematic workshop entry reveal
        playCinematicIntro();
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(Math.min(pct, 98));
        } else {
          setLoadingProgress((prev) => Math.min(prev + 12, 90));
        }
      },
      (err) => {
        console.error('Error loading 3D motorcycle model:', err);
        setLoadError('Failed to load 3D motorcycle asset. High-resolution fallback inspection mode is active.');
        setIsLoading(false);
      }
    );

    // 9. Main Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera transition if active
      if (isTransitioning.current && cameraRef.current && controlsRef.current) {
        if (cameraTargetPos.current) {
          cameraRef.current.position.lerp(cameraTargetPos.current, 0.055);
        }
        if (controlsTargetPos.current) {
          controlsRef.current.target.lerp(controlsTargetPos.current, 0.055);
        }

        if (
          cameraTargetPos.current &&
          cameraRef.current.position.distanceTo(cameraTargetPos.current) < 0.015 &&
          controlsTargetPos.current &&
          controlsRef.current.target.distanceTo(controlsTargetPos.current) < 0.015
        ) {
          isTransitioning.current = false;
        }
      }

      // Update particle drift
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += delta * 0.15;
          if (positions[i] > 3.2) {
            positions[i] = 0.1;
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      controls.update();

      // Project 3D Hotspot positions to 2D screen coordinates (Throttled & Memoized to avoid React re-render lag)
      hotspotFrameCountRef.current++;
      if (cameraRef.current && container && (hotspotFrameCountRef.current % 3 === 0)) {
        const camPos = cameraRef.current.position;
        const hasMoved = isTransitioning.current || isUserInteracting.current || camPos.distanceToSquared(lastCameraPosRef.current) > 0.0001;
        if (hasMoved) {
          lastCameraPosRef.current.copy(camPos);
          const w = container.clientWidth;
          const h = container.clientHeight;
          const hotspots = MOTORCYCLE_COMPONENTS.map((comp) => {
            tempVectorRef.current.set(comp.hotspotPosition[0], comp.hotspotPosition[1], comp.hotspotPosition[2]);
            tempVectorRef.current.project(cameraRef.current!);

            const isBehind = tempVectorRef.current.z > 1;
            const x = (tempVectorRef.current.x * 0.5 + 0.5) * w;
            const y = (-(tempVectorRef.current.y * 0.5) + 0.5) * h;

            const matchesCat = activeCategory === 'all' || comp.category === activeCategory;
            const isVisible = !isBehind && matchesCat && x >= 10 && x <= w - 10 && y >= 10 && y <= h - 10;

            return {
              id: comp.id,
              name: comp.shortName,
              category: comp.category,
              x,
              y,
              visible: isVisible
            };
          });

          screenHotspotsRef.current = hotspots;
          setProjectedHotspots(hotspots);
        }
      }

      // Render via Bloom EffectComposer or direct standard renderer
      if (bloomEnabled && qualityProfile !== 'performance' && composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    // 10. Window Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
      composerRef.current?.setSize(newW, newH);
      bloomPassRef.current?.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 11. Cleanup Lifecycle
    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('pointerdown', handleUserInteractionStart);
      domElem.removeEventListener('pointerup', handleUserInteractionEnd);
      domElem.removeEventListener('wheel', handleUserInteractionStart);
      domElem.removeEventListener('wheel', handleUserInteractionEnd);
      domElem.removeEventListener('touchstart', handleUserInteractionStart);
      domElem.removeEventListener('touchend', handleUserInteractionEnd);

      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
      }

      if (workshopGroupRef.current) {
        disposeWorkshopEnvironment(workshopGroupRef.current);
        scene.remove(workshopGroupRef.current);
        workshopGroupRef.current = null;
      }

      if (introTimelineRef.current) {
        introTimelineRef.current.kill();
        introTimelineRef.current = null;
      }

      if (particleSystemRef.current) {
        particleSystemRef.current.geometry.dispose();
        (particleSystemRef.current.material as THREE.Material).dispose();
      }

      envMapCacheRef.current.forEach((t) => t.dispose());
      envMapCacheRef.current.clear();
      pmremGeneratorRef.current?.dispose();

      composerRef.current?.dispose();

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
      }
      dracoLoader.dispose();
    };
  }, [modelUrl]);

  // ---------------------------------------------------------------------------
  // 4. DYNAMIC ENVIRONMENT SWITCHING WITHOUT MODEL RELOADING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    if (!scene || !renderer) return;

    const preset = ENVIRONMENT_PRESETS[currentEnvId];
    if (!preset) return;

    // Smooth transition background & fog
    scene.background = new THREE.Color(preset.background.color);
    if (scene.fog) {
      scene.fog.color.set(preset.fog.color);
      (scene.fog as THREE.FogExp2).density = preset.fog.density;
    }

    // Radiance environment map
    const envTexture = getOrCreateEnvMap(preset, renderer);
    scene.environment = envTexture;

    // Update lighting with GSAP smooth interpolation
    if (ambientLightRef.current) {
      ambientLightRef.current.color.set(preset.ambientLight.color);
      gsap.to(ambientLightRef.current, { intensity: ambientIntensity, duration: 0.6 });
    }
    if (keyLightRef.current) {
      keyLightRef.current.color.set(preset.keyLight.color);
      keyLightRef.current.position.set(...preset.keyLight.position);
      gsap.to(keyLightRef.current, { intensity: keyLightIntensity, duration: 0.6 });
    }
    if (fillLightRef.current) {
      fillLightRef.current.color.set(preset.fillLight.color);
      fillLightRef.current.position.set(...preset.fillLight.position);
      gsap.to(fillLightRef.current, { intensity: preset.fillLight.intensity, duration: 0.6 });
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.set(preset.rimLight.color);
      rimLightRef.current.position.set(...preset.rimLight.position);
      gsap.to(rimLightRef.current, { intensity: rimLightIntensity, duration: 0.6 });
    }

    // Update floor appearance
    if (floorMeshRef.current) {
      const mat = floorMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.color.set(preset.floor.color);
      mat.roughness = floorReflection ? preset.floor.roughness : 0.9;
      mat.metalness = floorReflection ? preset.floor.metalness : 0.1;
      mat.needsUpdate = true;
    }

    // Update rings visibility
    if (innerRingRef.current && outerRingRef.current) {
      innerRingRef.current.visible = preset.floor.showRings;
      outerRingRef.current.visible = preset.floor.showRings;
    }

    // Update particle system
    updateParticles(preset, scene);

    // Auto-enable bloom for Neon Underground
    if (preset.id === 'neon_underground') {
      setBloomEnabled(true);
    } else {
      setBloomEnabled(false);
    }

    // Subtle photography camera glide on environment change if not inspecting
    if (!selectedComponentId && cameraRef.current && controlsRef.current) {
      const currentPos = cameraRef.current.position.clone();
      const offset = new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.4);
      cameraTargetPos.current = currentPos.add(offset);
      isTransitioning.current = true;
    }
  }, [currentEnvId, getOrCreateEnvMap, updateParticles]);

  // Real-time lighting intensity changes from sliders
  useEffect(() => {
    if (ambientLightRef.current) ambientLightRef.current.intensity = ambientIntensity;
  }, [ambientIntensity]);

  useEffect(() => {
    if (keyLightRef.current) keyLightRef.current.intensity = keyLightIntensity;
  }, [keyLightIntensity]);

  useEffect(() => {
    if (rimLightRef.current) rimLightRef.current.intensity = rimLightIntensity;
  }, [rimLightIntensity]);

  // Accent lighting color changes
  useEffect(() => {
    const col = new THREE.Color(accentColor);
    if (underLightRef.current) underLightRef.current.color.set(col);
    if (innerRingRef.current) (innerRingRef.current.material as THREE.MeshBasicMaterial).color.set(col);
    if (outerRingRef.current) (outerRingRef.current.material as THREE.MeshBasicMaterial).color.set(col.clone().multiplyScalar(0.6));
  }, [accentColor]);

  // Auto-rotate controls update
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = autoRotateSpeed;
    }
  }, [autoRotate, autoRotateSpeed]);

  // FOV camera update
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [fov]);

  // Floor reflection toggle
  useEffect(() => {
    if (floorMeshRef.current) {
      const mat = floorMeshRef.current.material as THREE.MeshStandardMaterial;
      const preset = ENVIRONMENT_PRESETS[currentEnvId];
      mat.roughness = floorReflection ? preset.floor.roughness : 0.95;
      mat.metalness = floorReflection ? preset.floor.metalness : 0.05;
      mat.needsUpdate = true;
    }
  }, [floorReflection, currentEnvId]);

  // Wireframe mode toggle
  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => { (m as any).wireframe = wireframe; });
        } else if (mesh.material) {
          (mesh.material as any).wireframe = wireframe;
        }
      }
    });
  }, [wireframe]);

  // ---------------------------------------------------------------------------
  // 5. MOTORCYCLE PAINT & MATERIAL CUSTOMIZER (PRESERVES MECHANICAL PARTS)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!modelRef.current || !isCustomPaintActive) return;

    const targetColor = new THREE.Color(selectedColorHex);

    modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (isPaintableMesh(mesh)) {
          // Clone or adjust material properties
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                const sMat = mat as THREE.MeshStandardMaterial;
                sMat.color.copy(targetColor);
                sMat.metalness = paintMetalness;
                sMat.roughness = paintRoughness;
                sMat.needsUpdate = true;
              }
            });
          } else if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const sMat = mesh.material as THREE.MeshStandardMaterial;
            sMat.color.copy(targetColor);
            sMat.metalness = paintMetalness;
            sMat.roughness = paintRoughness;
            sMat.needsUpdate = true;
          }
        }
      }
    });
  }, [selectedColorHex, paintMetalness, paintRoughness, isCustomPaintActive]);

  const handleSelectPaintColor = (hex: string) => {
    setSelectedColorHex(hex);
    setIsCustomPaintActive(true);
  };

  const handleResetAppearance = () => {
    // Restore OEM factory materials
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const orig = originalMaterialsMap.current.get(mesh.name);
          if (orig) {
            mesh.material = orig;
            (mesh.material as any).wireframe = false;
          }
        }
      });
    }

    // Restore Default Studio Environment & Lighting
    setCurrentEnvId('showroom');
    const defaultPreset = ENVIRONMENT_PRESETS.showroom;
    setAmbientIntensity(defaultPreset.ambientLight.intensity);
    setKeyLightIntensity(defaultPreset.keyLight.intensity);
    setRimLightIntensity(defaultPreset.rimLight.intensity);
    setAccentColor(defaultPreset.defaultAccent);
    setWireframe(false);
    setBloomEnabled(false);
    setFloorReflection(true);
    setAutoRotate(true);
    setAutoRotateSpeed(0.8);
    setFov(45);
    setIsCustomPaintActive(false);

    // Reset Camera to perspective
    applyCameraPreset('perspective');
  };

  // ---------------------------------------------------------------------------
  // 6. CAPTURE HIGH-RESOLUTION SCREENSHOT
  // ---------------------------------------------------------------------------
  const handleCaptureScreenshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Force pristine render frame
    if (bloomEnabled && composerRef.current) {
      composerRef.current.render();
    } else {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    try {
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      const filename = `gearup-motorcycle-${vehicle?.model?.toLowerCase().replace(/\s+/g, '-') || 'studio'}-${currentEnvId}.png`;
      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setScreenshotSuccess(true);
      setTimeout(() => setScreenshotSuccess(false), 3000);
    } catch (err) {
      console.error('Screenshot capture error:', err);
    }
  };

  // ---------------------------------------------------------------------------
  // 7. RAYCASTING: CLICK ON 3D MESHES TO SELECT COMPONENT
  // ---------------------------------------------------------------------------
  const handlePointerDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || isLoading) return;

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(clickableMeshesRef.current, true);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const hitName = hitMesh.name.toLowerCase();

      const matchedComp = MOTORCYCLE_COMPONENTS.find((comp) =>
        comp.meshKeywords.some((keyword) => hitName.includes(keyword.toLowerCase()))
      );

      if (matchedComp) {
        onSelectComponent(matchedComp.id);
      }
    }
  }, [isLoading, onSelectComponent]);

  // ---------------------------------------------------------------------------
  // 8. SELECTION HIGHLIGHT & CAMERA TRANSITION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!meshMapRef.current || meshMapRef.current.size === 0) return;

    const selectedComp = MOTORCYCLE_COMPONENTS.find((c) => c.id === selectedComponentId);

    // Reset previous highlights
    meshMapRef.current.forEach(({ mesh, originalMat }) => {
      if (!isCustomPaintActive || !isPaintableMesh(mesh)) {
        mesh.material = originalMat;
      }
    });

    if (selectedComp) {
      meshMapRef.current.forEach(({ mesh, originalMat }) => {
        const meshName = mesh.name.toLowerCase();
        const isTarget = selectedComp.meshKeywords.some((kw) => meshName.includes(kw.toLowerCase()));

        if (isTarget) {
          const highlightMat = (originalMat as THREE.MeshStandardMaterial).clone();
          highlightMat.emissive = new THREE.Color(0x10b981);
          highlightMat.emissiveIntensity = 0.55;
          mesh.material = highlightMat;
        }
      });

      cameraTargetPos.current = new THREE.Vector3(...selectedComp.cameraPosition);
      controlsTargetPos.current = new THREE.Vector3(...selectedComp.cameraTarget);
      isTransitioning.current = true;
    }
  }, [selectedComponentId, isCustomPaintActive]);

  // ---------------------------------------------------------------------------
  // 9. EXPLODED VIEW TOGGLE ANIMATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!meshMapRef.current || meshMapRef.current.size === 0) return;

    MOTORCYCLE_COMPONENTS.forEach((comp) => {
      const offset = exploded ? comp.explodedOffset : [0, 0, 0];
      const offsetVec = new THREE.Vector3(...offset);

      meshMapRef.current.forEach(({ mesh, initialPos }) => {
        const meshName = mesh.name.toLowerCase();
        const matchesComp = comp.meshKeywords.some((kw) => meshName.includes(kw.toLowerCase()));

        if (matchesComp) {
          mesh.position.copy(initialPos).add(offsetVec);
        }
      });
    });
  }, [exploded]);

  // ---------------------------------------------------------------------------
  // 10. ZOOM CONTROLS
  // ---------------------------------------------------------------------------

  const handleZoom = (direction: 'in' | 'out') => {
    if (!controlsRef.current || !cameraRef.current) return;
    const factor = direction === 'in' ? 0.8 : 1.25;
    const offset = cameraRef.current.position.clone().sub(controlsRef.current.target).multiplyScalar(factor);
    cameraTargetPos.current = controlsRef.current.target.clone().add(offset);
    isTransitioning.current = true;
  };

  return (
    <div className={`relative w-full h-full bg-[#060C0A] overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onClick={handlePointerDown}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Drag to rotate 360° • Scroll to zoom • Click any component to inspect"
      />

      {/* Screenshot Success Toast */}
      {screenshotSuccess && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-emerald-950/95 border border-emerald-500 text-white px-4 py-2 text-xs font-mono flex items-center gap-2 shadow-2xl animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>High-Resolution Studio Screenshot Downloaded!</span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#060C0A]/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-20 text-white">
          <div className="w-16 h-16 rounded-none bg-[#E9E3D8] border border-[#35483C] flex items-center justify-center shadow-glow animate-pulse">
            <Compass className="w-8 h-8 text-[#242622] animate-spin" />
          </div>
          <div className="text-center space-y-1.5 max-w-sm px-4">
            <h3 className="font-heading font-bold text-base text-[#242622] tracking-wide">
              Loading 3D Digital Twin Showroom
            </h3>
            <p className="text-xs text-[#85857E]">
              Decompressing high-fidelity polygon meshes with Draco WASM acceleration...
            </p>
          </div>
          <div className="w-56 h-1.5 bg-black/40 rounded-none overflow-hidden border border-[#E9E3D8]/40">
            <div
              className="h-full bg-[#35483C] transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Fallback Notice */}
      {loadError && (
        <div className="absolute inset-x-4 top-4 z-20 p-4 bg-amber-950/90 border border-amber-600 text-amber-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p>{loadError}</p>
        </div>
      )}

      {/* Projected 2D Interactive Hotspots */}
      {showHotspots &&
        !isLoading &&
        projectedHotspots.map((hs) => {
          if (!hs.visible) return null;
          const isSelected = selectedComponentId === hs.id;
          return (
            <button
              key={hs.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectComponent(hs.id);
              }}
              style={{
                left: `${hs.x}px`,
                top: `${hs.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute z-10 pointer-events-auto transition-transform ${
                isSelected ? 'scale-110 z-20' : 'hover:scale-105'
              }`}
              title={`Inspect ${hs.name}`}
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[11px] font-mono tracking-wider transition-all shadow-lg ${
                  isSelected
                    ? 'bg-[#35483C] text-white border border-emerald-400 ring-2 ring-emerald-500/50 shadow-glow font-bold'
                    : 'bg-[#060C0A]/85 hover:bg-[#060C0A] text-[#A4AD98] hover:text-white border border-[#E9E3D8]/30 backdrop-blur-sm'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
                <span>{hs.name}</span>
              </div>
            </button>
          );
        })}

      {/* Floating Skip Intro Control During Cinematic Intro Sequence */}
      {isIntroPlaying && (
        <button
          type="button"
          onClick={skipCinematicIntro}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-black/85 hover:bg-black text-white font-mono font-bold text-xs border border-white/25 backdrop-blur-md flex items-center gap-2 shadow-2xl transition-all active:scale-95 cursor-pointer"
        >
          <FastForward className="w-4 h-4 text-amber-400" />
          <span>Skip Workshop Intro</span>
        </button>
      )}

      {/* Floating HUD Camera Presets & Zoom Toolstrip (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-[#060C0A]/85 backdrop-blur-md p-1.5 border border-white/10 text-white shadow-2xl">
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`p-2 rounded-none border text-xs transition-colors ${
            showHotspots ? 'bg-[#35483C] border-[#35483C] text-white' : 'bg-black/40 border-white/10 text-[#85857E]'
          }`}
          title={showHotspots ? 'Hide Inspection Hotspots' : 'Show Inspection Hotspots'}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        <button
          onClick={() => handleZoom('in')}
          className="p-2 rounded-none bg-black/40 hover:bg-white/10 border border-white/10 text-white text-xs transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 rounded-none bg-black/40 hover:bg-white/10 border border-white/10 text-white text-xs transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        {/* Quick Camera Angle Buttons */}
        {(['perspective', 'front', 'rear', 'left', 'right', 'top'] as const).map((preset) => (
          <button
            key={preset}
            onClick={() => applyCameraPreset(preset)}
            className={`px-2.5 py-1 rounded-none text-[10px] font-mono uppercase tracking-wider transition-all border ${
              activePreset === preset
                ? 'bg-[#35483C] text-white border-emerald-400 font-bold'
                : 'bg-black/30 text-[#85857E] hover:text-white border-white/10 hover:bg-white/5'
            }`}
          >
            {preset === 'perspective' ? '3/4' : preset}
          </button>
        ))}

        <div className="h-4 w-px bg-white/20 mx-0.5" />
        <button
          onClick={playCinematicIntro}
          className="px-2.5 py-1 rounded-none text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all border bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500 text-emerald-300 font-bold active:scale-95 shadow-sm"
          title="Replay Cinematic Workshop Entry Sequence"
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Cinematic Intro</span>
        </button>

        {onToggleExploded && (
          <>
            <div className="h-4 w-px bg-white/20 mx-0.5" />
            <button
              onClick={onToggleExploded}
              className={`px-2.5 py-1 rounded-none text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all border ${
                exploded
                  ? 'bg-amber-600 border-amber-500 text-white font-bold'
                  : 'bg-black/30 border-white/10 text-[#85857E] hover:text-white'
              }`}
              title="Toggle Exploded Mechanical Assembly"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{exploded ? 'Collapse' : 'Explode'}</span>
            </button>
          </>
        )}
      </div>

      {/* Floating Environment & Studio Configurator Control Panel */}
      {showStudioControls && (
        <EnvironmentControlPanel
          currentEnvironment={currentEnvId}
          onSelectEnvironment={(envId) => setCurrentEnvId(envId)}
          ambientIntensity={ambientIntensity}
          onAmbientIntensityChange={setAmbientIntensity}
          keyLightIntensity={keyLightIntensity}
          onKeyLightIntensityChange={setKeyLightIntensity}
          rimLightIntensity={rimLightIntensity}
          onRimLightIntensityChange={setRimLightIntensity}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          autoRotateSpeed={autoRotateSpeed}
          onAutoRotateSpeedChange={setAutoRotateSpeed}
          fov={fov}
          onFovChange={setFov}
          onApplyCameraPreset={applyCameraPreset}
          accentColor={accentColor}
          onSelectAccentColor={setAccentColor}
          wireframe={wireframe}
          onToggleWireframe={() => setWireframe(!wireframe)}
          bloomEnabled={bloomEnabled}
          onToggleBloom={() => setBloomEnabled(!bloomEnabled)}
          floorReflection={floorReflection}
          onToggleFloorReflection={() => setFloorReflection(!floorReflection)}
          selectedColorHex={selectedColorHex}
          onSelectPaintColor={handleSelectPaintColor}
          paintMetalness={paintMetalness}
          onPaintMetalnessChange={setPaintMetalness}
          paintRoughness={paintRoughness}
          onPaintRoughnessChange={setPaintRoughness}
          onCaptureScreenshot={handleCaptureScreenshot}
          onResetAppearance={handleResetAppearance}
          onPlayCinematicIntro={playCinematicIntro}
          qualityProfile={qualityProfile}
          onQualityProfileChange={setQualityProfile}
          isOpen={isStudioDrawerOpen}
          onToggleOpen={() => setIsStudioDrawerOpen(!isStudioDrawerOpen)}
        />
      )}
    </div>
  );
};
