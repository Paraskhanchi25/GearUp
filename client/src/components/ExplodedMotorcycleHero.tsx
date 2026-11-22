import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 120;

export const ExplodedMotorcycleHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cached HTMLImageElements
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const isLoadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));

  // Current animation progress and frame
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeFrameDisplay, setActiveFrameDisplay] = useState<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Render a specific frame to canvas with object-fit: contain math
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Find the closest loaded frame if requested frame isn't ready yet
    let imgToDraw = imagesRef.current[frameIdx];
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      // Find nearest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const lower = frameIdx - offset;
        const higher = frameIdx + offset;
        if (lower >= 0 && imagesRef.current[lower]?.complete) {
          imgToDraw = imagesRef.current[lower];
          break;
        }
        if (higher < TOTAL_FRAMES && imagesRef.current[higher]?.complete) {
          imgToDraw = imagesRef.current[higher];
          break;
        }
      }
    }

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // Object-fit: contain equivalent math
    // Ensures 100% of the motorcycle is visible on all displays without distortion or cropping
    const imgW = imgToDraw.naturalWidth;
    const imgH = imgToDraw.naturalHeight;
    const scale = Math.min(canvas.width / imgW, canvas.height / imgH);

    const drawW = Math.round(imgW * scale);
    const drawH = Math.round(imgH * scale);
    const drawX = Math.round((canvas.width - drawW) / 2);
    const drawY = Math.round((canvas.height - drawH) / 2);

    // Dark studio backdrop matching the frames' background tone
    ctx.fillStyle = '#1E201E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw motorcycle frame
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
        isLoadedRef.current[0] = true;
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
          isLoadedRef.current[i] = true;
          // If user is currently looking at this frame, render it
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

  // Scroll position to frame mapping
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

      // Calculate how far into the container we've scrolled
      const scrolled = -rect.top;
      const rawProgress = scrolled / scrollableDistance;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clampedProgress);

      const targetFrame = Math.round(clampedProgress * (TOTAL_FRAMES - 1));
      targetFrameRef.current = targetFrame;

      // Render the frame immediately for rock-solid, zero-delay responsiveness
      if (currentFrameRef.current !== targetFrame) {
        currentFrameRef.current = targetFrame;
        setActiveFrameDisplay(targetFrame);
        renderFrame(targetFrame);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrame]);

  // Stage details based on normalized scroll progress
  const getStageInfo = (p: number) => {
    if (p < 0.22) {
      return {
        stage: '01',
        title: 'PRECISION ENGINEERED',
        subtitle: 'ASSEMBLED MONOCOQUE CHASSIS',
        detail: 'Fully unified aerodynamic carbon fairing, 998cc inline-4 powertrain, and dual front Brembo disc brakes.',
        opacityStage1: 1 - p * 4,
        opacityStage2: 0,
        opacityStage3: 0,
        opacityStage4: 0,
      };
    } else if (p < 0.52) {
      const localP = (p - 0.22) / 0.3;
      return {
        stage: '02',
        title: 'COMPONENT SEPARATION',
        subtitle: 'FAIRING & TANK EXPANSION',
        detail: 'Subframe detachment, fuel cell elevation, and twin aerodynamic cowl expanding outward into individual elements.',
        opacityStage1: 0,
        opacityStage2: Math.sin(localP * Math.PI),
        opacityStage3: 0,
        opacityStage4: 0,
      };
    } else if (p < 0.80) {
      const localP = (p - 0.52) / 0.28;
      return {
        stage: '03',
        title: 'INTERNAL POWERTRAIN',
        subtitle: 'VALVETRAIN & SUSPENSION EXPOSURE',
        detail: 'Inverted front fork assembly, rear monoshock release, and exhaust header branching from engine block.',
        opacityStage1: 0,
        opacityStage2: 0,
        opacityStage3: Math.sin(localP * Math.PI),
        opacityStage4: 0,
      };
    } else {
      const localP = (p - 0.80) / 0.2;
      return {
        stage: '04',
        title: '120-POINT EXPLODED TWIN',
        subtitle: 'COMPLETE MECHANICAL DISASSEMBLY',
        detail: 'All 120 certified components suspended in complete 3D engineering isolation for diagnostic verification.',
        opacityStage1: 0,
        opacityStage2: 0,
        opacityStage3: 0,
        opacityStage4: Math.min(1, localP * 1.5),
      };
    }
  };

  const stage = getStageInfo(scrollProgress);

  return (
    // Dedicated 350vh scroll runway gives visitor smooth, precise control over the entire 120-frame sequence
    <div
      ref={containerRef}
      className="relative w-full h-[350vh] bg-[#1E201E] select-none"
    >
      {/* Pinned 100vw x 100vh Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#1E201E]">
        
        {/* Full-screen HTML5 Canvas (object-fit: contain rendered) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Subtle Atmospheric Lighting & Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E201E] via-transparent to-[#1E201E]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E201E]/60 via-transparent to-[#1E201E]/60 pointer-events-none" />

        {/* Top Telemetry Header Ticker (Minimal, Automotive) */}
        <div className="absolute top-20 inset-x-0 z-10 max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between text-white/70 text-[10px] font-mono tracking-[0.25em] uppercase pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-bold">SCROLL-CONTROLLED 3D EXPLODED VIEW</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[#A4AD98]">
            <span>FRAME {String(activeFrameDisplay + 1).padStart(3, '0')} / {TOTAL_FRAMES}</span>
            <span>•</span>
            <span>{Math.round(scrollProgress * 100)}% DISASSEMBLED</span>
          </div>
        </div>

        {/* Dynamic Storytelling Editorial Text Overlays (Synced with Scroll Position) */}
        <div className="absolute inset-x-0 bottom-24 sm:bottom-28 z-10 max-w-7xl mx-auto px-6 sm:px-12 pointer-events-none">
          <div className="max-w-2xl space-y-3">
            
            {/* Stage Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#A4AD98] font-mono text-[10px] uppercase tracking-[0.25em]">
              <span>PHASE {stage.stage}</span>
              <span>•</span>
              <span className="text-white font-bold">{stage.subtitle}</span>
            </div>

            {/* Oversized Architectural Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-[0.95]">
              {stage.title}
            </h1>

            {/* Stage Description */}
            <p className="text-white/80 font-sans text-xs sm:text-base max-w-xl font-light leading-relaxed">
              {stage.detail}
            </p>

          </div>
        </div>

        {/* Bottom Scroll Prompt & Progress Bar */}
        <div className="absolute bottom-6 inset-x-0 z-10 max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between text-white/60 text-[9px] font-mono tracking-[0.25em] uppercase pointer-events-none">
          <span>APEX V4 HYPERSPORT DIGITAL TWIN</span>
          
          <div className="flex items-center gap-3">
            {scrollProgress >= 0.95 ? (
              <span className="text-[#A4AD98] font-bold animate-pulse">CONTINUE SCROLLING FOR INVENTORY ↓</span>
            ) : (
              <span>SCROLL DOWN TO DISASSEMBLE ↓</span>
            )}
          </div>
        </div>

        {/* 1px Minimal Edge Scroll Progress Line */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 z-20 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-[#E9E3D8] to-red-500 transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

      </div>
    </div>
  );
};
