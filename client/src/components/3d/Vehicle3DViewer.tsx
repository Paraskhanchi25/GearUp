import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { 
  MOTORCYCLE_COMPONENTS, 
  InspectionComponentDef, 
  ComponentCategory 
} from './inspectionComponentData';
import { Vehicle3DMetadata, getVehicle3DMetadata } from '../../services/vehicle3DRegistry';
import { VehicleListing } from '../../types';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Sparkles,
  AlertTriangle,
  Loader2,
  Palette,
  Sun,
  Moon,
  Compass,
  CheckCircle2,
  Info
} from 'lucide-react';

export type BackgroundPreset = 'studio' | 'dark' | 'light' | 'outdoor';
export type LightingPreset = 'showroom' | 'dramatic' | 'daylight' | 'minimal';

export interface Vehicle3DViewerProps {
  vehicle?: VehicleListing | null;
  modelMetadata?: Vehicle3DMetadata;
  modelPath?: string;
  modelScale?: number;
  cameraPosition?: [number, number, number];
  initialRotation?: [number, number, number];
  background?: BackgroundPreset;
  lightingPreset?: LightingPreset;
  enableRotation?: boolean;
  enableZoom?: boolean;
  enableComponentInspection?: boolean;
  enableExplodedView?: boolean;
  enableColorCustomization?: boolean;
  inspectionOverlay?: boolean;
  selectedComponentId?: string | null;
  onComponentSelect?: (componentId: string | null) => void;
  onLoadingProgress?: (progress: number) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
}

export const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({
  vehicle,
  modelMetadata,
  modelPath,
  modelScale,
  cameraPosition,
  initialRotation,
  background = 'studio',
  lightingPreset = 'showroom',
  enableRotation = true,
  enableZoom = true,
  enableComponentInspection = true,
  enableExplodedView = true,
  enableColorCustomization = true,
  inspectionOverlay = true,
  selectedComponentId = null,
  onComponentSelect,
  onLoadingProgress,
  className = '',
  height = '600px',
  showControls = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Resolved metadata
  const resolvedMeta = useMemo(() => {
    if (modelMetadata) return modelMetadata;
    return getVehicle3DMetadata(vehicle || null);
  }, [modelMetadata, vehicle]);

  const activeModelPath = modelPath || resolvedMeta.modelPath;
  const activeScale = modelScale || resolvedMeta.scale || 1.0;

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Mesh Tracking for Exploded View & Customization
  const meshCatalogRef = useRef<Map<string, {
    mesh: THREE.Mesh;
    originalPos: THREE.Vector3;
    originalMat: THREE.Material | THREE.Material[];
  }>>(new Map());

  // Interactive Clickable Meshes for Raycasting
  const clickableMeshesRef = useRef<THREE.Mesh[]>([]);

  // Hotspots for 2D UI Overlay
  const [screenHotspots, setScreenHotspots] = useState<Array<{
    id: string;
    name: string;
    status: 'excellent' | 'good' | 'fair' | 'attention';
    screenX: number;
    screenY: number;
    visible: boolean;
  }>>([]);

  // Viewer State
  const [loading, setLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeBg, setActiveBg] = useState<BackgroundPreset>(background);
  const [activeLighting, setActiveLighting] = useState<LightingPreset>(lightingPreset);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 1. SETUP THREE.JS SCENE, CAMERA, RENDERER, LIGHTING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setLoadError('WebGL is not supported on this browser or hardware acceleration is disabled.');
      setLoading(false);
      return;
    }

    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Background color setup
    const bgColors: Record<BackgroundPreset, number> = {
      studio: 0x0C120E,
      dark: 0x050706,
      light: 0xF7F5EF,
      outdoor: 0x1A2420
    };
    scene.background = new THREE.Color(bgColors[activeBg]);
    scene.fog = new THREE.FogExp2(bgColors[activeBg], 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    const defaultCamPos = cameraPosition || resolvedMeta.initialCameraPosition;
    camera.position.set(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = activeBg === 'light' ? 1.0 : 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = enableRotation;
    controls.enableZoom = enableZoom;
    controls.enablePan = false;
    controls.minDistance = 1.0;
    controls.maxDistance = 5.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.02; // Prevent camera sinking under floor
    const defaultTarget = resolvedMeta.initialCameraTarget;
    controls.target.set(defaultTarget[0], defaultTarget[1], defaultTarget[2]);
    controlsRef.current = controls;

    // Ground Contact Shadow (Soft Radial Shadow)
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const canvasShadow = document.createElement('canvas');
    canvasShadow.width = 128;
    canvasShadow.height = 128;
    const ctx = canvasShadow.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(canvasShadow);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    scene.add(shadowMesh);

    // Floor Reflection Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x35483C, 0x1E2B23);
    gridHelper.position.y = 0.001;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = activeBg === 'light' ? 0.2 : 0.35;
    scene.add(gridHelper);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x223322, 0.6);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xAED8C5, 1.0);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // Load 3D Asset
    setLoading(true);
    setLoadError(null);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/gltf/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      activeModelPath,
      (gltf) => {
        const model = gltf.scene;
        modelGroupRef.current = model;

        // Auto center bounding box
        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());

        // Center on X and Z, set bottom to ground (Y = 0)
        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -bbox.min.y;

        // Scale
        model.scale.set(activeScale, activeScale, activeScale);

        if (initialRotation) {
          model.rotation.set(initialRotation[0], initialRotation[1], initialRotation[2]);
        }

        // Traverse meshes and populate catalog
        meshCatalogRef.current.clear();
        clickableMeshesRef.current = [];

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Preserve original material and position for customization & exploded resets
            meshCatalogRef.current.set(mesh.name || mesh.uuid, {
              mesh,
              originalPos: mesh.position.clone(),
              originalMat: Array.isArray(mesh.material)
                ? mesh.material.map((m) => m.clone())
                : mesh.material.clone()
            });

            clickableMeshesRef.current.push(mesh);
          }
        });

        scene.add(model);
        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const progress = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(progress);
          onLoadingProgress?.(progress);
        }
      },
      (error) => {
        console.warn('GLTF loading fallback:', error);
        setLoadError('Failed to load 3D model asset. Falling back to inspection photos.');
        setLoading(false);
      }
    );

    // Render loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        if (autoRotate) {
          controlsRef.current.autoRotate = true;
          controlsRef.current.autoRotateSpeed = 1.8;
        } else {
          controlsRef.current.autoRotate = false;
        }
        controlsRef.current.update();
      }

      // Update Screen Hotspots Coordinates
      if (cameraRef.current && container && modelGroupRef.current) {
        const cWidth = container.clientWidth;
        const cHeight = container.clientHeight;

        const updatedHotspots = MOTORCYCLE_COMPONENTS.slice(0, 8).map((comp) => {
          const pos = new THREE.Vector3(comp.hotspotPosition[0], comp.hotspotPosition[1], comp.hotspotPosition[2]);
          pos.project(cameraRef.current!);

          const isBehind = pos.z > 1.0;
          const x = (pos.x * 0.5 + 0.5) * cWidth;
          const y = (-(pos.y * 0.5) + 0.5) * cHeight;

          const insp = comp.getInspectionData(vehicle || undefined);

          return {
            id: comp.id,
            name: comp.shortName,
            status: insp.conditionGrade,
            screenX: Math.round(x),
            screenY: Math.round(y),
            visible: !isBehind && x >= 0 && x <= cWidth && y >= 0 && y <= cHeight
          };
        });

        setScreenHotspots(updatedHotspots);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup Lifecycle
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      // Dispose Three.js scene & renderer
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material?.dispose();
          }
        }
      });

      controls.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      dracoLoader.dispose();
      container.replaceChildren();
    };
  }, [activeModelPath, activeScale, activeBg]);

  // ---------------------------------------------------------------------------
  // 2. RAYCASTING SELECTION (Click / Tap on Mesh)
  // ---------------------------------------------------------------------------
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableComponentInspection || !mountRef.current || !cameraRef.current || clickableMeshesRef.current.length === 0) {
      return;
    }

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(clickableMeshesRef.current, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const hitName = (hitMesh.name || '').toLowerCase();

      // Find matching component definition
      const matched = MOTORCYCLE_COMPONENTS.find((comp) => {
        return comp.meshKeywords.some((kw) => hitName.includes(kw.toLowerCase()));
      });

      if (matched) {
        onComponentSelect?.(matched.id);
        zoomToComponent(matched);
      }
    }
  }, [enableComponentInspection, onComponentSelect]);

  // ---------------------------------------------------------------------------
  // 3. CAMERA PRESET TRANSITIONS (GSAP)
  // ---------------------------------------------------------------------------
  const setCameraPreset = useCallback((preset: 'front' | 'rear' | 'left' | 'right' | 'perspective' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;

    setAutoRotate(false);

    const presets: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
      perspective: { pos: [2.2, 1.2, 2.4], target: [0, 0.65, 0] },
      front: { pos: [0, 0.7, 3.2], target: [0, 0.65, 0] },
      rear: { pos: [0, 0.7, -3.2], target: [0, 0.65, 0] },
      left: { pos: [-3.2, 0.75, 0], target: [0, 0.65, 0] },
      right: { pos: [3.2, 0.75, 0], target: [0, 0.65, 0] },
      top: { pos: [0.1, 4.0, 0.1], target: [0, 0.65, 0] }
    };

    const targetConfig = presets[preset] || presets.perspective;

    gsap.to(cameraRef.current.position, {
      x: targetConfig.pos[0],
      y: targetConfig.pos[1],
      z: targetConfig.pos[2],
      duration: 1.1,
      ease: 'power2.inOut'
    });

    gsap.to(controlsRef.current.target, {
      x: targetConfig.target[0],
      y: targetConfig.target[1],
      z: targetConfig.target[2],
      duration: 1.1,
      ease: 'power2.inOut'
    });
  }, []);

  // Zoom to component on click
  const zoomToComponent = useCallback((comp: InspectionComponentDef) => {
    if (!cameraRef.current || !controlsRef.current) return;

    setAutoRotate(false);

    gsap.to(cameraRef.current.position, {
      x: comp.cameraPosition[0],
      y: comp.cameraPosition[1],
      z: comp.cameraPosition[2],
      duration: 1.2,
      ease: 'power2.inOut'
    });

    gsap.to(controlsRef.current.target, {
      x: comp.cameraTarget[0],
      y: comp.cameraTarget[1],
      z: comp.cameraTarget[2],
      duration: 1.2,
      ease: 'power2.inOut'
    });
  }, []);

  // ---------------------------------------------------------------------------
  // 4. EXPLODED VIEW TRANSFORMATION
  // ---------------------------------------------------------------------------
  const toggleExplodedView = useCallback(() => {
    if (!resolvedMeta.supportedFeatures.explodedView) {
      alert('Exploded view requires separated component hierarchy. Not available for this compact CAD model.');
      return;
    }

    const nextState = !isExploded;
    setIsExploded(nextState);

    meshCatalogRef.current.forEach(({ mesh, originalPos }) => {
      const meshName = (mesh.name || '').toLowerCase();
      let offset: [number, number, number] = [0, 0, 0];

      // Find matching component definition for offset direction
      const comp = MOTORCYCLE_COMPONENTS.find((c) =>
        c.meshKeywords.some((kw) => meshName.includes(kw.toLowerCase()))
      );

      if (comp) {
        offset = comp.explodedOffset;
      } else if (meshName.includes('wheel') || meshName.includes('tire')) {
        offset = [0, 0, meshName.includes('front') ? 0.35 : -0.35];
      } else if (meshName.includes('exhaust') || meshName.includes('pipe')) {
        offset = [0.4, -0.1, -0.2];
      } else if (meshName.includes('tank') || meshName.includes('seat')) {
        offset = [0, 0.3, 0];
      }

      const targetX = nextState ? originalPos.x + offset[0] : originalPos.x;
      const targetY = nextState ? originalPos.y + offset[1] : originalPos.y;
      const targetZ = nextState ? originalPos.z + offset[2] : originalPos.z;

      gsap.to(mesh.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 1.2,
        ease: 'power2.inOut'
      });
    });
  }, [isExploded, resolvedMeta]);

  // ---------------------------------------------------------------------------
  // 5. COLOR CUSTOMIZATION
  // ---------------------------------------------------------------------------
  const applyCustomColor = useCallback((hexColor: string | null) => {
    setActiveColor(hexColor);

    meshCatalogRef.current.forEach(({ mesh, originalMat }) => {
      const name = (mesh.name || '').toLowerCase();
      const keywords = resolvedMeta.colorCustomization?.bodyMeshKeywords || ['tank', 'fender', 'mudguard', 'body'];

      const isBodyMesh = keywords.some((kw) => name.includes(kw));

      if (isBodyMesh && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (hexColor === null) {
          // Reset to original material
          if (Array.isArray(originalMat)) {
            mesh.material = originalMat.map((m) => m.clone());
          } else {
            mesh.material = originalMat.clone();
          }
        } else {
          mat.color.set(hexColor);
          mat.roughness = 0.25;
          mat.metalness = 0.65;
          mat.needsUpdate = true;
        }
      }
    });
  }, [resolvedMeta]);

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`} style={{ height }}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#0C120E]/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30 text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#35483C]" />
          <div className="text-center space-y-1">
            <p className="font-heading font-bold text-sm tracking-wide">
              Initializing {resolvedMeta.representationLabel}...
            </p>
            <p className="text-[11px] text-[#A4AD98] font-mono">
              DRACO Mesh Decode • {loadProgress}% Loaded
            </p>
          </div>
          <div className="w-48 h-1 bg-white/20 overflow-hidden rounded-full">
            <div
              className="h-full bg-[#35483C] transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Load Error Fallback Banner */}
      {loadError && (
        <div className="absolute inset-0 bg-[#0C120E] flex flex-col items-center justify-center gap-3 z-30 text-white p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          <h4 className="font-heading font-bold text-base">3D Visualization Notice</h4>
          <p className="text-xs text-[#A4AD98] max-w-md">{loadError}</p>
          <div className="p-3 bg-white/5 border border-white/10 text-xs text-left max-w-sm space-y-1">
            <p className="font-bold text-white">Certified Physical Inspection Data:</p>
            <p className="text-[11px] text-[#A4AD98]">
              All 120-point mechanical inspection records remain available below.
            </p>
          </div>
        </div>
      )}

      {/* 2D Hotspot Pins Projected on 3D Space */}
      {enableComponentInspection && inspectionOverlay && !loading && !isExploded && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {screenHotspots.map((hs) => {
            if (!hs.visible) return null;
            const isSelected = selectedComponentId === hs.id;
            const statusColors: Record<string, string> = {
              excellent: 'bg-emerald-500 ring-emerald-300',
              good: 'bg-emerald-500 ring-emerald-300',
              fair: 'bg-amber-500 ring-amber-300',
              attention: 'bg-red-500 ring-red-300'
            };

            return (
              <div
                key={hs.id}
                style={{
                  position: 'absolute',
                  left: `${hs.screenX}px`,
                  top: `${hs.screenY}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="pointer-events-auto cursor-pointer group"
                onClick={() => {
                  onComponentSelect?.(hs.id);
                  const c = MOTORCYCLE_COMPONENTS.find((item) => item.id === hs.id);
                  if (c) zoomToComponent(c);
                }}
              >
                <div className={`w-3.5 h-3.5 rounded-full ${statusColors[hs.status] || 'bg-white ring-white'} ring-2 ring-opacity-70 shadow-lg animate-pulse transition-transform group-hover:scale-125 flex items-center justify-center`} />
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide whitespace-nowrap shadow-md transition-opacity pointer-events-none ${
                  isSelected
                    ? 'bg-[#35483C] text-white opacity-100 ring-1 ring-white/30'
                    : 'bg-[#242622]/90 text-white opacity-0 group-hover:opacity-100'
                }`}>
                  {hs.name}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Control Toolbar (Top-Right) */}
      {showControls && !loading && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* 360 Turntable Auto-Rotate */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause 360° Rotation' : 'Auto 360° Turntable'}
            className={`p-2.5 rounded-none border text-xs font-bold transition-all shadow-lg ${
              autoRotate
                ? 'bg-[#35483C] border-[#35483C] text-white'
                : 'bg-[#242622]/90 border-white/20 text-white hover:bg-[#35483C]'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          {/* Exploded View Toggle */}
          {enableExplodedView && (
            <button
              type="button"
              onClick={toggleExplodedView}
              title={isExploded ? 'Reset Vehicle Assembly' : 'Exploded Component View'}
              className={`p-2.5 rounded-none border text-xs font-bold transition-all shadow-lg ${
                isExploded
                  ? 'bg-amber-600 border-amber-600 text-white'
                  : 'bg-[#242622]/90 border-white/20 text-white hover:bg-[#35483C]'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          )}

          {/* Color Customizer Toggle */}
          {enableColorCustomization && resolvedMeta.colorCustomization && (
            <button
              type="button"
              onClick={() => setShowColorPalette(!showColorPalette)}
              title="Custom Colour Swatches"
              className={`p-2.5 rounded-none border text-xs font-bold transition-all shadow-lg ${
                showColorPalette
                  ? 'bg-[#35483C] border-[#35483C] text-white'
                  : 'bg-[#242622]/90 border-white/20 text-white hover:bg-[#35483C]'
              }`}
            >
              <Palette className="w-4 h-4" />
            </button>
          )}

          {/* Reset Camera to Default */}
          <button
            type="button"
            onClick={() => setCameraPreset('perspective')}
            title="Reset Camera View"
            className="p-2.5 rounded-none bg-[#242622]/90 hover:bg-[#35483C] border border-white/20 text-white text-xs shadow-lg transition-all"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Color Palette Flyout */}
      {showColorPalette && resolvedMeta.colorCustomization && (
        <div className="absolute top-4 right-16 z-20 p-3 bg-[#242622]/95 border border-white/20 shadow-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs text-white border-b border-white/10 pb-1.5 font-bold">
            <span>Body Colour Swatches</span>
            <button
              type="button"
              onClick={() => applyCustomColor(null)}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Reset OEM
            </button>
          </div>
          <div className="flex items-center gap-2">
            {resolvedMeta.colorCustomization.palette.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => applyCustomColor(c.hex)}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  activeColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Camera View Angle Buttons (Bottom-Left) */}
      {showControls && !loading && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-[#242622]/85 backdrop-blur-md border border-white/15 p-1 shadow-xl">
          {[
            { id: 'perspective', label: '3/4' },
            { id: 'front', label: 'Front' },
            { id: 'right', label: 'Right' },
            { id: 'rear', label: 'Rear' },
            { id: 'left', label: 'Left' },
            { id: 'top', label: 'Top' }
          ].map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setCameraPreset(view.id as any)}
              className="px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#35483C] transition-colors"
            >
              {view.label}
            </button>
          ))}
        </div>
      )}

      {/* Model Attribution & Verification Badge (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#242622]/90 border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{resolvedMeta.representationLabel}</span>
          {resolvedMeta.isGenericRepresentation && (
            <span className="text-[9px] px-1 py-0.2 bg-white/20 text-white rounded">
              Architectural Twin
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
