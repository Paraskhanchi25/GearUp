import React, { useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 120;

interface StageInfo {
  stage: string;
  title: string;
  subtitle: string;
  detail: string;
}

const STAGES: StageInfo[] = [
  {
    stage: '01',
    title: 'PRECISION ENGINEERED',
    subtitle: 'ASSEMBLED MONOCOQUE CHASSIS',
    detail: 'Fully unified aerodynamic carbon fairing, 998cc inline-4 powertrain, and dual front Brembo disc brakes.'
  },
  {
    stage: '02',
    title: 'COMPONENT SEPARATION',
    subtitle: 'FAIRING & TANK EXPANSION',
    detail: 'Subframe detachment, fuel cell elevation, and twin aerodynamic cowl expanding outward into individual elements.'
  },
  {
    stage: '03',
    title: 'INTERNAL POWERTRAIN',
    subtitle: 'VALVETRAIN & SUSPENSION EXPOSURE',
    detail: 'Inverted front fork assembly, rear monoshock release, and exhaust header branching from engine block.'
  },
  {
    stage: '04',
    title: '120-POINT EXPLODED TWIN',
    subtitle: 'COMPLETE MECHANICAL DISASSEMBLY',
    detail: 'All 120 certified components suspended in complete 3D engineering isolation for diagnostic verification.'
  }
];

export const ExplodedMotorcycleHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cached HTMLImageElements (all 120 1080p CGI frames)
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  // Current frame and stage tracking (refs avoid React re-rendering on high-speed scroll)
  const currentFrameRef = useRef<number>(0);
  const currentStageIndexRef = useRef<number>(0);

  // Direct DOM refs for instant zero-lag updates
  const progressLineRef = useRef<HTMLDivElement | null>(null);
  const stageBadgeRef = useRef<HTMLSpanElement | null>(null);
  const stageTitleRef = useRef<HTMLHeadingElement | null>(null);
  const stageDetailRef = useRef<HTMLParagraphElement | null>(null);
  const tickerFrameRef = useRef<HTMLSpanElement | null>(null);
  const tickerPercentRef = useRef<HTMLSpanElement | null>(null);
  const promptTextRef = useRef<HTMLSpanElement | null>(null);

  // Render a specific frame to canvas with object-fit: contain math
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Find requested frame or fallback to nearest loaded frame
    let imgToDraw = imagesRef.current[frameIdx];
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const lower = frameIdx - offset;
        const higher = frameIdx + offset;
        if (lower >= 0 && imagesRef.current[lower]?.complete && imagesRef.current[lower]?.naturalWidth! > 0) {
          imgToDraw = imagesRef.current[lower];
          break;
        }
        if (higher < TOTAL_FRAMES && imagesRef.current[higher]?.complete && imagesRef.current[higher]?.naturalWidth! > 0) {
          imgToDraw = imagesRef.current[higher];
          break;
        }
      }
    }

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // High-DPI support: scale buffer by window.devicePixelRatio for Retina / 4K crispness
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // High quality bicubic image interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Object-fit: contain math
    // Keeps motorcycle 100% visible, centered, and proportional on all screens without cropping
    const imgW = imgToDraw.naturalWidth;
    const imgH = imgToDraw.naturalHeight;
    const scale = Math.min(canvas.width / imgW, canvas.height / imgH);

    const drawW = Math.round(imgW * scale);
    const drawH = Math.round(imgH * scale);
    const drawX = Math.round((canvas.width - drawW) / 2);
    const drawY = Math.round((canvas.height - drawH) / 2);

    // Dark studio background fill matching frame backdrop
    ctx.fillStyle = '#1E201E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(imgToDraw, drawX, drawY, drawW, drawH);
  }, []);

  // Preload all 120 frames in chronological order
  useEffect(() => {
    let isCancelled = false;

    // Priority 1: Load frame 0 immediately and render it
    const frame0 = new Image();
    frame0.src = `/frames/motorcycle-exploded/ezgif-frame-001.jpg`;
    frame0.onload = () => {
      if (!isCancelled) {
        imagesRef.current[0] = frame0;
        renderFrame(0);
      }
    };

    // Priority 2: Preload remaining frames
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i + 1).padStart(3, '0');
      img.src = `/frames/motorcycle-exploded/ezgif-frame-${num}.jpg`;
      img.onload = () => {
        if (!isCancelled) {
          imagesRef.current[i] = img;
          if (currentFrameRef.current === i) {
            renderFrame(i);
          }
        }
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [renderFrame]);

  // Scroll listener: Maps normalized scroll progress directly to frame index
  // progress = clamp((scrollY - sectionStart) / (sectionEnd - sectionStart), 0, 1)
  // frameIndex = Math.round(progress * (totalFrames - 1))
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = rect.height - viewportHeight;

      if (scrollableDistance <= 0) return;

      // Calculate progress relative to container top
      const scrolled = -rect.top;
      const rawProgress = scrolled / scrollableDistance;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      const targetFrame = Math.round(clampedProgress * (TOTAL_FRAMES - 1));

      // Direct, zero-lag frame update
      if (currentFrameRef.current !== targetFrame) {
        currentFrameRef.current = targetFrame;
        renderFrame(targetFrame);
      }

      // Update progress bar width directly (bypassing React re-renders)
      if (progressLineRef.current) {
        progressLineRef.current.style.width = `${clampedProgress * 100}%`;
      }

      // Update ticker frame and percentage text directly
      if (tickerFrameRef.current) {
        tickerFrameRef.current.textContent = `FRAME ${String(targetFrame + 1).padStart(3, '0')} / ${TOTAL_FRAMES}`;
      }
      if (tickerPercentRef.current) {
        tickerPercentRef.current.textContent = `${Math.round(clampedProgress * 100)}% DISASSEMBLED`;
      }

      // Update prompt text
      if (promptTextRef.current) {
        if (clampedProgress >= 0.95) {
          promptTextRef.current.textContent = 'CONTINUE SCROLLING FOR INVENTORY ↓';
          promptTextRef.current.className = 'text-[#A4AD98] font-bold animate-pulse';
        } else {
          promptTextRef.current.textContent = 'SCROLL DOWN TO DISASSEMBLE ↓';
          promptTextRef.current.className = 'text-white/60';
        }
      }

      // Determine editorial stage (01 to 04)
      let stageIdx = 0;
      if (clampedProgress < 0.25) stageIdx = 0;
      else if (clampedProgress < 0.55) stageIdx = 1;
      else if (clampedProgress < 0.82) stageIdx = 2;
      else stageIdx = 3;

      if (currentStageIndexRef.current !== stageIdx) {
        currentStageIndexRef.current = stageIdx;
        const st = STAGES[stageIdx];
        if (stageBadgeRef.current) {
          stageBadgeRef.current.textContent = `PHASE ${st.stage} • ${st.subtitle}`;
        }
        if (stageTitleRef.current) {
          stageTitleRef.current.textContent = st.title;
        }
        if (stageDetailRef.current) {
          stageDetailRef.current.textContent = st.detail;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial positioning
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [renderFrame]);

  return (
    // Dedicated 280vh scroll track gives visitor a natural, responsive scroll distance
    <section
      ref={containerRef}
      className="relative w-full h-[280vh] bg-[#1E201E] select-none"
    >
      {/* Pinned 100vw x 100svh Sticky Viewport Stage (Horizontally & Vertically Centered) */}
      <div className="sticky top-0 w-screen h-[100svh] max-w-full overflow-hidden flex items-center justify-center bg-[#1E201E] z-10">
        
        {/* Full-screen HTML5 Canvas (object-fit: contain rendered) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Subtle Atmospheric Lighting & Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E201E] via-transparent to-[#1E201E]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E201E]/60 via-transparent to-[#1E201E]/60 pointer-events-none" />

        {/* Top Telemetry Header Ticker (Below fixed navbar) */}
        <div className="absolute top-24 inset-x-0 z-10 max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between text-white/70 text-[10px] font-mono tracking-[0.25em] uppercase pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-bold">SCROLL-CONTROLLED 3D EXPLODED VIEW</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[#A4AD98]">
            <span ref={tickerFrameRef}>FRAME 001 / {TOTAL_FRAMES}</span>
            <span>•</span>
            <span ref={tickerPercentRef}>0% DISASSEMBLED</span>
          </div>
        </div>

        {/* Dynamic Storytelling Editorial Text Overlays (Synced with Scroll Position) */}
        <div className="absolute inset-x-0 bottom-24 sm:bottom-28 z-10 max-w-7xl mx-auto px-6 sm:px-12 pointer-events-none">
          <div className="max-w-2xl space-y-3">
            
            {/* Stage Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#A4AD98] font-mono text-[10px] uppercase tracking-[0.25em]">
              <span ref={stageBadgeRef}>PHASE 01 • ASSEMBLED MONOCOQUE CHASSIS</span>
            </div>

            {/* Oversized Architectural Headline */}
            <h1
              ref={stageTitleRef}
              className="font-heading font-extrabold text-3xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-[0.95]"
            >
              PRECISION ENGINEERED
            </h1>

            {/* Stage Description */}
            <p
              ref={stageDetailRef}
              className="text-white/80 font-sans text-xs sm:text-base max-w-xl font-light leading-relaxed"
            >
              Fully unified aerodynamic carbon fairing, 998cc inline-4 powertrain, and dual front Brembo disc brakes.
            </p>

          </div>
        </div>

        {/* Bottom Scroll Prompt & Progress Bar */}
        <div className="absolute bottom-6 inset-x-0 z-10 max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between text-white/60 text-[9px] font-mono tracking-[0.25em] uppercase pointer-events-none">
          <span>APEX V4 HYPERSPORT DIGITAL TWIN</span>
          
          <div className="flex items-center gap-3">
            <span ref={promptTextRef} className="text-white/60">
              SCROLL DOWN TO DISASSEMBLE ↓
            </span>
          </div>
        </div>

        {/* 1px Minimal Edge Scroll Progress Line */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 z-20 pointer-events-none">
          <div
            ref={progressLineRef}
            className="h-full bg-gradient-to-r from-red-600 via-[#E9E3D8] to-red-500 transition-all duration-75"
            style={{ width: '0%' }}
          />
        </div>

      </div>
    </section>
  );
};
