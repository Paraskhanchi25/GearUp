import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { 
  ArrowRight, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  SlidersHorizontal,
  CheckCircle2,
  Gauge
} from 'lucide-react';

interface Waypoint {
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
}

const WAYPOINTS: Waypoint[] = [
  // Scene 1: Hero Front-Quarter (0.00 - 0.25)
  { cameraPos: [2.9, 1.35, 3.1], targetPos: [0, 0.72, 0] },
  // Scene 2: Sleek Side 3/4 Silhouette (0.25 - 0.55)
  { cameraPos: [3.5, 1.15, 1.3], targetPos: [0.1, 0.72, 0] },
  // Scene 3: Mechanical Engine Close-up (0.55 - 0.85)
  { cameraPos: [1.35, 0.72, 0.75], targetPos: [0, 0.62, 0.05] },
  // Scene 4: Full Heroic Reveal & Outro (0.85 - 1.00)
  { cameraPos: [3.1, 1.25, 2.3], targetPos: [0, 0.7, 0] }
];

export const CinematicMotorcycleHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglError(true);
        setIsLoaded(true);
        return;
      }
    } catch {
      setWebglError(true);
      setIsLoaded(true);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent to show deepBlack background

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      canvasContainer.clientWidth / canvasContainer.clientHeight,
      0.1,
      100
    );
    camera.position.set(...WAYPOINTS[0].cameraPos);

    // Current & Target state for smooth lerp
    const currentCamPos = new THREE.Vector3(...WAYPOINTS[0].cameraPos);
    const targetCamPos = new THREE.Vector3(...WAYPOINTS[0].cameraPos);
    const currentLookAt = new THREE.Vector3(...WAYPOINTS[0].targetPos);
    const targetLookAt = new THREE.Vector3(...WAYPOINTS[0].targetPos);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.appendChild(renderer.domElement);

    // Cinematic Studio Lighting (Sage, Sand & Deep Black Palette)
    // 1. Ambient darkness
    const ambientLight = new THREE.AmbientLight(0x191c18, 1.4);
    scene.add(ambientLight);

    // 2. Main Key Light (Muted Sage Hue: #A5B29B)
    const keyLight = new THREE.DirectionalLight(0xa5b29b, 2.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // 3. Rim / Specular Highlight Light (Warm Sand Hue: #D8CBB5)
    const rimLight = new THREE.DirectionalLight(0xd8cbb5, 3.8);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // 4. Subtle Ground Bounce (Dark Sage)
    const groundBounce = new THREE.DirectionalLight(0x39483d, 1.0);
    groundBounce.position.set(0, -2, 2);
    scene.add(groundBounce);

    // 5. Engine Mechanical Accent Point Light (Warm Sand)
    const enginePointLight = new THREE.PointLight(0xd8cbb5, 1.8, 4.5);
    enginePointLight.position.set(0.6, 0.7, 0.4);
    scene.add(enginePointLight);

    // Showroom Pedestal Floor & Concentric Guideline Rings
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Concentric guideline rings for Awwwards-style architectural presentation
    const ringMat = new THREE.LineBasicMaterial({ color: 0x39483d, transparent: true, opacity: 0.35 });
    [1.8, 2.6, 3.4].forEach((radius) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0.002, Math.sin(theta) * radius));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.Line(ringGeo, ringMat);
      scene.add(ring);
    });

    // GLTF Loading with Draco
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let bikeModel: THREE.Group | null = null;

    gltfLoader.load(
      '/models/motorcycle.glb',
      (gltf) => {
        bikeModel = gltf.scene;

        // Compute Bounding Box & Center on Origin
        const box = new THREE.Box3().setFromObject(bikeModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center on X and Z, ground on Y = 0
        bikeModel.position.x -= center.x;
        bikeModel.position.y -= box.min.y;
        bikeModel.position.z -= center.z;

        // Traverse & Optimize Materials
        bikeModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.isMeshStandardMaterial) {
                mat.envMapIntensity = 1.25;
                // Enhance metallic highlights
                if (mat.metalness > 0.3) {
                  mat.roughness = Math.min(mat.roughness, 0.35);
                }
              }
            }
          }
        });

        scene.add(bikeModel);
        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.min(100, Math.round((xhr.loaded / xhr.total) * 100)));
        } else {
          setLoadingProgress((prev) => Math.min(95, prev + 15));
        }
      },
      (err) => {
        console.warn('Could not load 3D motorcycle model:', err);
        setWebglError(true);
        setIsLoaded(true);
      }
    );

    // Scroll interpolation handler
    let targetProgress = 0;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      targetProgress = progress;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Resize Handler
    const handleResize = () => {
      if (!canvasContainer) return;
      const width = canvasContainer.clientWidth;
      const height = canvasContainer.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Render / Animation Loop with Cinematic Damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Determine waypoint interpolation based on scroll progress
      // 4 Waypoints across 3 intervals: [0..0.33], [0.33..0.66], [0.66..1.0]
      const p = targetProgress;
      let i = 0;
      let segmentT = 0;

      if (p <= 0.33) {
        i = 0;
        segmentT = p / 0.33;
      } else if (p <= 0.66) {
        i = 1;
        segmentT = (p - 0.33) / 0.33;
      } else {
        i = 2;
        segmentT = Math.min(1, (p - 0.66) / 0.34);
      }

      // Smooth step easing for cinema feel
      const easedT = segmentT * segmentT * (3 - 2 * segmentT);

      const wpA = WAYPOINTS[i];
      const wpB = WAYPOINTS[i + 1] || WAYPOINTS[i];

      // Interpolate target camera position and lookAt
      targetCamPos.set(
        wpA.cameraPos[0] + (wpB.cameraPos[0] - wpA.cameraPos[0]) * easedT,
        wpA.cameraPos[1] + (wpB.cameraPos[1] - wpA.cameraPos[1]) * easedT,
        wpA.cameraPos[2] + (wpB.cameraPos[2] - wpA.cameraPos[2]) * easedT
      );

      targetLookAt.set(
        wpA.targetPos[0] + (wpB.targetPos[0] - wpA.targetPos[0]) * easedT,
        wpA.targetPos[1] + (wpB.targetPos[1] - wpA.targetPos[1]) * easedT,
        wpA.targetPos[2] + (wpB.targetPos[2] - wpA.targetPos[2]) * easedT
      );

      // Subtle breathing / idle motion when near hero (progress < 0.1)
      if (p < 0.1 && bikeModel) {
        const subtleSway = Math.sin(elapsedTime * 0.8) * 0.015;
        bikeModel.rotation.y = subtleSway;
      } else if (bikeModel) {
        bikeModel.rotation.y = 0;
      }

      // Buttery smooth lerp
      currentCamPos.lerp(targetCamPos, 0.075);
      currentLookAt.lerp(targetLookAt, 0.075);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      dracoLoader.dispose();
      renderer.dispose();
      if (canvasContainer.contains(renderer.domElement)) {
        canvasContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[380vh] bg-deepBlack">
      {/* Sticky 3D WebGL Showroom Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
        <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full" />

        {/* Cinematic Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-deepBlack via-transparent to-deepBlack/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-deepBlack/20 to-deepBlack/80 pointer-events-none" />

        {/* Loading Overlay */}
        {!isLoaded && !webglError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-deepBlack z-50 pointer-events-auto">
            <div className="space-y-4 text-center max-w-xs px-4">
              <div className="w-12 h-12 mx-auto rounded-full border-2 border-darkSage border-t-sand-warm animate-spin" />
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-sand-warm font-bold">
                  Initializing 3D Showroom
                </p>
                <p className="text-xs text-sage-muted">Preparing high-precision motorcycle digital twin...</p>
              </div>
              <div className="w-48 h-1 mx-auto bg-charcoal rounded-full overflow-hidden">
                <div
                  className="h-full bg-sand-warm transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* WebGL Fallback if device has no 3D support */}
        {webglError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-charcoal via-deepBlack to-[#18201A] px-6">
            <div className="text-center max-w-lg space-y-4 opacity-90">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-darkSage text-sand-light border border-sage/30">
                Automotive Engineering
              </span>
              <h2 className="text-3xl font-heading font-bold text-sand-light">
                The Next Ride Starts With Trust
              </h2>
              <p className="text-sm text-sand/80">
                India&apos;s most verified pre-owned two-wheeler platform. Explore verified inventory with 120-point mechanical inspection.
              </p>
            </div>
          </div>
        )}

        {/* Persistent Micro-Hud (Top & Bottom subtle telemetry) */}
        <div className="absolute top-24 left-6 sm:left-12 flex items-center gap-2 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-sage-muted animate-ping" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-sage-muted">
            STUDIO 3D • GEAR UP DIGITAL TWIN
          </span>
        </div>

        <div className="absolute bottom-6 left-6 sm:left-12 flex items-center gap-4 pointer-events-none text-[11px] text-sand/50 font-mono">
          <span>PROGRESS: {(scrollProgress * 100).toFixed(0)}%</span>
          <span>•</span>
          <span>CHASSIS: CLASSIC 350 SERIES</span>
        </div>
      </div>

      {/* =========================================================================
          NARRATIVE SCROLL OVERLAYS (Choreographed to fade in/out with scroll)
         ========================================================================= */}
      <div className="relative z-10 w-full pointer-events-none">
        {/* -----------------------------------------------------------------------
            SCENE 1: HERO INTRODUCTION (Scroll 0% to 25%)
           ----------------------------------------------------------------------- */}
        <div className="h-[95vh] flex items-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <div
            className="max-w-2xl space-y-6 transition-all duration-700 pointer-events-auto"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 3.8),
              transform: `translateY(${scrollProgress * 80}px)`
            }}
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal/80 backdrop-blur-md border border-darkSage text-xs text-sand-warm">
              <span className="w-2 h-2 rounded-full bg-sage-muted" />
              <span className="font-semibold tracking-wider uppercase text-[11px]">
                Automotive Technology Platform
              </span>
              <span className="text-darkSage">•</span>
              <span className="text-sand-light font-mono text-[10px]">India</span>
            </div>

            {/* Awwwards-style Confident Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-sand-offWhite tracking-tight leading-[1.05]">
              THE NEXT RIDE <br />
              <span className="text-sand-warm">STARTS WITH TRUST.</span>
            </h1>

            <p className="text-sand-light/80 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Discover, evaluate and buy pre-owned motorcycles with greater confidence. Powered by authentic 120-point mechanical telemetry, ML valuation and RTO title checks.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/explore"
                className="px-6 py-3.5 rounded-xl bg-sand-warm hover:bg-sand-light text-deepBlack font-heading font-bold text-sm tracking-wide transition-all shadow-glow-sand flex items-center gap-2 group"
              >
                <span>Explore Motorcycles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/sell"
                className="px-6 py-3.5 rounded-xl bg-charcoal/80 hover:bg-darkSage text-sand-light border border-darkSage hover:border-sage-muted font-heading font-semibold text-sm tracking-wide transition-all"
              >
                Sell Your Motorcycle
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-8 flex items-center gap-2 text-xs text-sage-muted/70 font-mono">
              <ChevronDown className="w-4 h-4 animate-bounce text-sand-warm" />
              <span>SCROLL TO EXPLORE THE SILHOUETTE</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            SCENE 2: MOTORCYCLE REVEAL (Scroll 25% to 55%)
           ----------------------------------------------------------------------- */}
        <div className="h-[95vh] flex items-center justify-end px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <div
            className="max-w-xl space-y-6 text-right transition-all duration-700 pointer-events-auto"
            style={{
              opacity:
                scrollProgress > 0.15 && scrollProgress < 0.55
                  ? Math.min(1, (scrollProgress - 0.15) * 5) * Math.max(0, 1 - (scrollProgress - 0.42) * 5)
                  : 0,
              transform: `translateY(${Math.max(-40, Math.min(40, (scrollProgress - 0.35) * 100))}px)`
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal/80 border border-darkSage text-[11px] font-mono tracking-wider text-sand-warm uppercase">
              01 // DESIGN & SILHOUETTE
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-sand-offWhite tracking-tight leading-tight">
              TIMELESS FORM. <br />
              <span className="text-sage-muted">HONEST PROPORTIONS.</span>
            </h2>

            <p className="text-sand-light/80 text-sm sm:text-base leading-relaxed">
              Every two-wheeler on GearUp undergoes comprehensive multi-angle verification. From fuel-tank clearcoats to frame geometry, we eliminate the smoke and mirrors of second-hand buying.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-left">
              <div className="p-3 rounded-xl bg-charcoal/90 border border-darkSage">
                <p className="text-[10px] text-sage-muted font-mono uppercase">Inspection</p>
                <p className="text-sm font-bold text-sand-light mt-0.5">120 Points</p>
              </div>
              <div className="p-3 rounded-xl bg-charcoal/90 border border-darkSage">
                <p className="text-[10px] text-sage-muted font-mono uppercase">Valuation</p>
                <p className="text-sm font-bold text-sand-warm mt-0.5">ML Residual</p>
              </div>
              <div className="p-3 rounded-xl bg-charcoal/90 border border-darkSage">
                <p className="text-[10px] text-sage-muted font-mono uppercase">Title Check</p>
                <p className="text-sm font-bold text-sand-light mt-0.5">RTO Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            SCENE 3: ENGINEERING AND DETAIL (Scroll 55% to 85%)
           ----------------------------------------------------------------------- */}
        <div className="h-[95vh] flex items-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <div
            className="max-w-xl space-y-6 transition-all duration-700 pointer-events-auto"
            style={{
              opacity:
                scrollProgress > 0.48 && scrollProgress < 0.85
                  ? Math.min(1, (scrollProgress - 0.48) * 5) * Math.max(0, 1 - (scrollProgress - 0.72) * 5)
                  : 0,
              transform: `translateY(${Math.max(-40, Math.min(40, (scrollProgress - 0.65) * 100))}px)`
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal/80 border border-darkSage text-[11px] font-mono tracking-wider text-sand-warm uppercase">
              02 // MECHANICAL TRANSPARENCY
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-sand-offWhite tracking-tight leading-tight">
              ENGINEERED INTEGRITY. <br />
              <span className="text-sand-warm">ZERO OBSCURITY.</span>
            </h2>

            <p className="text-sand-light/80 text-sm sm:text-base leading-relaxed">
              True mechanical condition cannot be seen from a photo alone. Our trained hub technicians verify internal compression, cold-start stability, clutch free-play, and electrical health before any listing is certified.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-sand-light">
                <CheckCircle2 className="w-4 h-4 text-sage-muted flex-shrink-0" />
                <span>Cold compression measured against OEM factory benchmarks (138 PSI)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-sand-light">
                <CheckCircle2 className="w-4 h-4 text-sage-muted flex-shrink-0" />
                <span>Chassis laser alignment check verifying zero accidental frame tilt</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-sand-light">
                <CheckCircle2 className="w-4 h-4 text-sage-muted flex-shrink-0" />
                <span>Micrometer rotor measurement & battery cold cranking amperage test</span>
              </div>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            SCENE 4: FULL MOTORCYCLE REVEAL & CTA (Scroll 85% to 100%)
           ----------------------------------------------------------------------- */}
        <div className="h-[95vh] flex items-center justify-center text-center px-6 sm:px-12 max-w-4xl mx-auto">
          <div
            className="space-y-6 transition-all duration-700 pointer-events-auto"
            style={{
              opacity: scrollProgress > 0.78 ? Math.min(1, (scrollProgress - 0.78) * 5) : 0,
              transform: `translateY(${Math.max(0, (1 - scrollProgress) * 60)}px)`
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal/80 border border-darkSage text-[11px] font-mono tracking-wider text-sand-warm uppercase">
              03 // THE NEW BENCHMARK
            </div>

            <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-sand-offWhite tracking-tight">
              EXPERIENCE THE NEW STANDARD.
            </h2>

            <p className="text-sand-light/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Whether you are discovering your next ride or discovering your bike’s true residual value, GearUp redefines the experience.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/explore"
                className="px-7 py-3.5 rounded-xl bg-sand-warm hover:bg-sand-light text-deepBlack font-heading font-bold text-sm tracking-wide transition-all shadow-glow-sand flex items-center gap-2"
              >
                <span>Browse Verified Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/price-estimator"
                className="px-7 py-3.5 rounded-xl bg-charcoal hover:bg-darkSage text-sand-light border border-darkSage font-heading font-semibold text-sm tracking-wide transition-all"
              >
                Instant ML Valuation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
