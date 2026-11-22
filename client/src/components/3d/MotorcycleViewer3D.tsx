import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { 
  MOTORCYCLE_COMPONENTS, 
  CAMERA_PRESETS, 
  InspectionComponentDef, 
  ComponentCategory 
} from './inspectionComponentData';
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
  Loader2
} from 'lucide-react';

interface MotorcycleViewer3DProps {
  vehicle?: VehicleListing;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  activeCategory?: ComponentCategory | 'all';
  exploded?: boolean;
  onToggleExploded?: () => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
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
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Mesh & Hotspot tracking
  const meshMapRef = useRef<Map<string, { mesh: THREE.Mesh; originalMat: THREE.Material; initialPos: THREE.Vector3 }>>(new Map());
  const clickableMeshesRef = useRef<THREE.Mesh[]>([]);
  const screenHotspotsRef = useRef<Array<{ id: string; name: string; category: string; x: number; y: number; visible: boolean }>>([]);

  // Camera transition state
  const cameraTargetPos = useRef<THREE.Vector3 | null>(null);
  const controlsTargetPos = useRef<THREE.Vector3 | null>(null);
  const isTransitioning = useRef<boolean>(false);

  // UI state
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>('perspective');
  const [projectedHotspots, setProjectedHotspots] = useState<Array<{ id: string; name: string; category: string; x: number; y: number; visible: boolean }>>([]);

  // Model URL determination (scooter vs motorcycle)
  const isScooter = vehicle?.category === 'scooter' || vehicle?.model?.toLowerCase().includes('activa') || vehicle?.model?.toLowerCase().includes('jupiter');
  // For standard motorcycle or scooter, use representative high-detail GLB
  const modelUrl = isScooter ? '/models/scooter.glb' : '/models/motorcycle.glb';

  // ---------------------------------------------------------------------------
  // 1. SCENE INITIALIZATION & CLEANUP
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

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060C0A);
    scene.fog = new THREE.FogExp2(0x060C0A, 0.08);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    const initialCam = CAMERA_PRESETS.perspective.position;
    camera.position.set(initialCam[0], initialCam[1], initialCam[2]);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.1;
    controls.maxDistance = 5.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.01; // prevent camera going below floor
    const initialTarget = CAMERA_PRESETS.perspective.target;
    controls.target.set(initialTarget[0], initialTarget[1], initialTarget[2]);
    controlsRef.current = controls;

    // 5. Studio Showroom Lighting
    // Ambient fill with soft emerald floor reflection
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.7);
    scene.add(ambientLight);

    // Key Light (Main warm showroom spot)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Rim Light (Cool cyan accent on metallic edges)
    const rimLight = new THREE.DirectionalLight(0x34d399, 1.4);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // Front Fill Light
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.0);
    fillLight.position.set(0, 1.5, -4);
    scene.add(fillLight);

    // Under-chassis soft uplight for engine detail
    const underLight = new THREE.PointLight(0x10b981, 0.8, 4);
    underLight.position.set(0, 0.1, 0);
    scene.add(underLight);

    // 6. Luxury Showroom Pedestal Floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x081310,
      roughness: 0.25,
      metalness: 0.75
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Showroom ring guidelines
    const ringGeo = new THREE.RingGeometry(1.6, 1.63, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, opacity: 0.35, transparent: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    const outerRingGeo = new THREE.RingGeometry(2.4, 2.415, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0x064e3b, side: THREE.DoubleSide, opacity: 0.25, transparent: true });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.001;
    scene.add(outerRing);

    // 7. Load GLTF 3D Asset
    setIsLoading(true);
    setLoadingProgress(10);
    setLoadError(null);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      modelUrl,
      (gltf) => {
        const root = gltf.scene;
        modelRef.current = root;

        // Compute Bounding Box & Normalize Model to fit showroom pedestal
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.4 / (maxDim || 1);
        root.scale.setScalar(targetScale);

        // Center on (0, 0, 0) and position bottom onto floor (y=0)
        root.position.x = -center.x * targetScale;
        root.position.z = -center.z * targetScale;
        root.position.y = -box.min.y * targetScale;

        // Traverse & catalog meshes for raycasting & component inspection
        const meshMap = new Map();
        const clickable: THREE.Mesh[] = [];

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Preserve initial position for exploded view animations
            meshMap.set(mesh.name, {
              mesh,
              originalMat: Array.isArray(mesh.material) ? mesh.material[0] : mesh.material,
              initialPos: mesh.position.clone()
            });

            // Improve material aesthetics for showroom polish
            if (mesh.material) {
              const m = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
              if (m.name && (m.name.includes('chrome') || m.name.includes('metal') || m.name.includes('brakedisk'))) {
                m.metalness = Math.max(m.metalness, 0.85);
                m.roughness = Math.min(m.roughness, 0.18);
              }
              if (m.name && m.name.includes('carpaint')) {
                // Apply rich hunter forest green or classic lacquer gloss
                m.metalness = 0.55;
                m.roughness = 0.12;
              }
            }

            clickable.push(mesh);
          }
        });

        meshMapRef.current = meshMap;
        clickableMeshesRef.current = clickable;

        scene.add(root);
        setIsLoading(false);
        setLoadingProgress(100);
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
        setLoadError('Failed to load 3D motorcycle asset. Falling back to high-res inspection viewer.');
        setIsLoading(false);
      }
    );

    // 8. Animation & Render Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Smooth camera transition if active
      if (isTransitioning.current && cameraRef.current && controlsRef.current) {
        if (cameraTargetPos.current) {
          cameraRef.current.position.lerp(cameraTargetPos.current, 0.055);
        }
        if (controlsTargetPos.current) {
          controlsRef.current.target.lerp(controlsTargetPos.current, 0.055);
        }

        // Check if transition is close enough to snap & complete
        if (
          cameraTargetPos.current &&
          cameraRef.current.position.distanceTo(cameraTargetPos.current) < 0.015 &&
          controlsTargetPos.current &&
          controlsRef.current.target.distanceTo(controlsTargetPos.current) < 0.015
        ) {
          isTransitioning.current = false;
        }
      }

      controls.update();

      // Project 3D Hotspot positions to 2D screen coordinates for overlay pills
      if (cameraRef.current && container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const hotspots = MOTORCYCLE_COMPONENTS.map((comp) => {
          const pos = new THREE.Vector3(...comp.hotspotPosition);
          pos.project(cameraRef.current!);

          // Check if hotspot is facing the camera (Z < 1)
          const isBehind = pos.z > 1;
          const x = (pos.x * 0.5 + 0.5) * w;
          const y = (-(pos.y * 0.5) + 0.5) * h;

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

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      dracoLoader.dispose();
    };
  }, [modelUrl]);

  // ---------------------------------------------------------------------------
  // 2. RAYCASTING: CLICK ON 3D MESHES TO SELECT COMPONENT
  // ---------------------------------------------------------------------------
  const handlePointerDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerIsReady() || isLoading) return;

    const rect = mountRef.current!.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current!);

    const intersects = raycaster.intersectObjects(clickableMeshesRef.current, true);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const hitName = hitMesh.name.toLowerCase();

      // Find matching component definition
      const matchedComp = MOTORCYCLE_COMPONENTS.find((comp) =>
        comp.meshKeywords.some((keyword) => hitName.includes(keyword.toLowerCase()))
      );

      if (matchedComp) {
        onSelectComponent(matchedComp.id);
      }
    }
  }, [isLoading, onSelectComponent]);

  const containerIsReady = () => Boolean(mountRef.current && cameraRef.current && sceneRef.current);

  // ---------------------------------------------------------------------------
  // 3. SELECTION HIGHLIGHT & CAMERA TRANSITION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!meshMapRef.current || meshMapRef.current.size === 0) return;

    const selectedComp = MOTORCYCLE_COMPONENTS.find((c) => c.id === selectedComponentId);

    // Reset previous highlights
    meshMapRef.current.forEach(({ mesh, originalMat }) => {
      mesh.material = originalMat;
    });

    if (selectedComp) {
      // Highlight matching meshes with emerald glowing emissive accent
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

      // Smooth camera transition to inspect the selected component
      cameraTargetPos.current = new THREE.Vector3(...selectedComp.cameraPosition);
      controlsTargetPos.current = new THREE.Vector3(...selectedComp.cameraTarget);
      isTransitioning.current = true;
    }
  }, [selectedComponentId]);

  // ---------------------------------------------------------------------------
  // 4. EXPLODED VIEW TOGGLE ANIMATION
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
  // 5. CAMERA PRESET SWITCHER (FRONT, REAR, LEFT, RIGHT, TOP, RESET)
  // ---------------------------------------------------------------------------
  const applyCameraPreset = (presetKey: keyof typeof CAMERA_PRESETS) => {
    setActivePreset(presetKey);
    onSelectComponent(null); // clear specific component focus

    const preset = CAMERA_PRESETS[presetKey];
    cameraTargetPos.current = new THREE.Vector3(...preset.position);
    controlsTargetPos.current = new THREE.Vector3(...preset.target);
    isTransitioning.current = true;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!controlsRef.current || !cameraRef.current) return;
    const factor = direction === 'in' ? 0.8 : 1.25;
    const offset = cameraRef.current.position.clone().sub(controlsRef.current.target).multiplyScalar(factor);
    cameraTargetPos.current = controlsRef.current.target.clone().add(offset);
    isTransitioning.current = true;
  };

  return (
    <div className={`relative w-full h-full bg-[#060C0A] overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onClick={handlePointerDown}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Drag to rotate 360° • Scroll to zoom • Click any component to inspect"
      />

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
              Initializing {vehicle?.brand || 'Motorcycle'} {vehicle?.model || '350'} inspection meshes...
            </p>
          </div>
          <div className="w-64 h-2 rounded-full bg-white border border-[#E9E3D8] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-forest-400 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-[#242622]">{loadingProgress}%</span>
        </div>
      )}

      {/* Fallback / Error State */}
      {loadError && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
          <div className="w-12 h-12 rounded-none bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="font-heading font-bold text-sm text-[#242622]">Interactive 3D Notice</h4>
            <p className="text-xs text-[#85857E]">{loadError}</p>
          </div>
          {vehicle?.primaryImage && (
            <div className="relative aspect-video w-full max-w-md rounded-none overflow-hidden border border-[#E9E3D8]">
              <img src={vehicle.primaryImage} alt="Vehicle visual" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/80 text-[10px] text-white">
                Certified 120-Point Photographic Inspection
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive 3D Screen Hotspot Pins (Projected from 3D coordinates) */}
      {!isLoading && showHotspots && !selectedComponentId && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {projectedHotspots.map((h) => {
            if (!h.visible) return null;
            return (
              <button
                key={h.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectComponent(h.id);
                }}
                style={{
                  transform: `translate(${h.x}px, ${h.y}px) translate(-50%, -50%)`,
                }}
                className="absolute pointer-events-auto group flex items-center gap-1.5 transition-transform hover:scale-110 focus:outline-none"
                title={`Inspect ${h.name}`}
              >
                {/* Glowing Pulse Ring */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-6 h-6 rounded-full bg-emerald-400/30 animate-ping" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-glow" />
                </div>
                {/* Hotspot Label Pill */}
                <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E9E3D8] text-[10px] font-bold text-[#242622] shadow-xl whitespace-nowrap opacity-75 group-hover:opacity-100 group-hover:border-emerald-400 transition-opacity">
                  {h.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Top Floating Badge: Discloses Representative 3D Model with Real Inspection Data */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-none bg-white/95 backdrop-blur-md border border-[#E9E3D8] shadow-2xl text-xs">
          <Sparkles className="w-4 h-4 text-[#242622] flex-shrink-0" />
          <div className="leading-tight">
            <span className="font-bold text-[#242622] block text-[11px]">
              {vehicle?.brand || 'Royal Enfield'} {vehicle?.model || 'Classic 350'} 3D Digital Twin
            </span>
            <span className="text-[10px] text-[#242622]">
              Representative Asset • Actual Seller Condition Displayed in Real-Time
            </span>
          </div>
        </div>

        {/* View Fullscreen & Hotspots Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`p-2 rounded-none backdrop-blur-md border text-xs transition-colors shadow-lg ${
              showHotspots
                ? 'bg-emerald-950/80 border-emerald-600/70 text-[#242622]'
                : 'bg-white/95 border-[#E9E3D8] text-[#85857E] hover:text-[#242622]'
            }`}
            title={showHotspots ? 'Hide Component Hotspot Pins' : 'Show Component Hotspot Pins'}
          >
            <Eye className="w-4 h-4" />
          </button>

          {onToggleExploded && (
            <button
              onClick={onToggleExploded}
              className={`p-2 rounded-none backdrop-blur-md border text-xs transition-colors shadow-lg flex items-center gap-1 ${
                exploded
                  ? 'bg-amber-950/80 border-amber-600/70 text-amber-300'
                  : 'bg-white/95 border-[#E9E3D8] text-[#85857E] hover:text-[#242622]'
              }`}
              title="Exploded Assembly View"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px] font-bold">Exploded</span>
            </button>
          )}

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-none bg-white/95 backdrop-blur-md border border-[#E9E3D8] text-[#85857E] hover:text-[#242622] text-xs transition-colors shadow-lg"
              title={fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Showroom'}
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Camera Perspectives Bar (Front, Rear, Left, Right, Top, Reset) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-none bg-white/95 backdrop-blur-md border border-[#E9E3D8] shadow-2xl z-10 max-w-[95%] overflow-x-auto">
        <button
          onClick={() => applyCameraPreset('perspective')}
          className={`px-2.5 py-1.5 rounded-none text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
            activePreset === 'perspective' && !selectedComponentId
              ? 'bg-emerald-600 text-white shadow-glow'
              : 'text-[#85857E] hover:text-[#242622] hover:bg-[#E9E3D8]'
          }`}
          title="3/4 Perspective Hero View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>3/4 Reset</span>
        </button>

        <button
          onClick={() => applyCameraPreset('front')}
          className={`px-2.5 py-1.5 rounded-none text-[11px] font-bold transition-all whitespace-nowrap ${
            activePreset === 'front'
              ? 'bg-emerald-600 text-white'
              : 'text-[#85857E] hover:text-[#242622] hover:bg-[#E9E3D8]'
          }`}
        >
          Front
        </button>

        <button
          onClick={() => applyCameraPreset('side_left')}
          className={`px-2.5 py-1.5 rounded-none text-[11px] font-bold transition-all whitespace-nowrap ${
            activePreset === 'side_left'
              ? 'bg-emerald-600 text-white'
              : 'text-[#85857E] hover:text-[#242622] hover:bg-[#E9E3D8]'
          }`}
        >
          Left Profile
        </button>

        <button
          onClick={() => applyCameraPreset('side_right')}
          className={`px-2.5 py-1.5 rounded-none text-[11px] font-bold transition-all whitespace-nowrap ${
            activePreset === 'side_right'
              ? 'bg-emerald-600 text-white'
              : 'text-[#85857E] hover:text-[#242622] hover:bg-[#E9E3D8]'
          }`}
        >
          Right Profile
        </button>

        <button
          onClick={() => applyCameraPreset('rear')}
          className={`px-2.5 py-1.5 rounded-none text-[11px] font-bold transition-all whitespace-nowrap ${
            activePreset === 'rear'
              ? 'bg-emerald-600 text-white'
              : 'text-[#85857E] hover:text-[#242622] hover:bg-[#E9E3D8]'
          }`}
        >
          Rear
        </button>

        <button
          onClick={() => applyCameraPreset('top')}
          className={`px-2.5 py-1.5 rounded-none text-[11px] font-bold transition-all whitespace-nowrap ${
            activePreset === 'top'
              ? 'bg-emerald-600 text-white'
              : 'text-[#85857E] hover:text-[#242622] hover:bg-[#E9E3D8]'
          }`}
        >
          Top Down
        </button>

        <div className="w-[1px] h-4 bg-[#E9E3D8]/40 mx-0.5" />

        {/* Zoom Controls */}
        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 rounded-lg text-[#85857E] hover:text-[#242622] hover:bg-[#E9E3D8] transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 rounded-lg text-[#85857E] hover:text-[#242622] hover:bg-[#E9E3D8] transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hint Badge for User Interaction */}
      <div className="absolute bottom-16 left-3 text-[10px] text-slate-500 pointer-events-none hidden sm:block">
        Click any motorcycle component to view certified inspection report
      </div>
    </div>
  );
};
