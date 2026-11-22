import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Maximize2, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface ExplodedMotorcycleHeroProps {
  className?: string;
  onFrameChange?: (frameIndex: number, phaseName: string) => void;
}

const TOTAL_FRAMES = 120;
const FRAME_RATE = 26; // frames per second for cinematic 3D motion
const FRAME_INTERVAL = 1000 / FRAME_RATE;
const HOLD_ASSEMBLED_MS = 1400; // pause at assembled frame (0)
const HOLD_EXPLODED_MS = 1800;  // pause at peak exploded frame (119)

// Chronological mechanical disassembly phases
export const getMechanicalPhase = (frameIdx: number) => {
  if (frameIdx < 15) {
    return {
      phase: '01',
      title: 'FULLY ASSEMBLED AERODYNAMIC CHASSIS',
      desc: 'Monocoque aluminum frame with carbon fairings and windscreen',
      status: 'ASSEMBLED'
    };
  } else if (frameIdx < 40) {
    return {
      phase: '02',
      title: 'BODY PANEL & FUEL CELL EXPANSION',
      desc: 'Subframe detachment, fuel cell lifting, and intake cowl separation',
      status: 'EXPANDING'
    };
  } else if (frameIdx < 70) {
    return {
      phase: '03',
      title: 'COOLING MATRIX & SUSPENSION EXPOSURE',
      desc: 'Twin radiators, inverted front forks, and rear monoshock release',
      status: 'SUSPENSION & COOLING'
    };
  } else if (frameIdx < 98) {
    return {
      phase: '04',
      title: 'INTERNAL POWERTRAIN & VALVETRAIN',
      desc: 'Four-cylinder engine block, exhaust headers, and pistons reveal',
      status: 'ENGINE VALVES'
    };
  } else {
    return {
      phase: '05',
      title: 'COMPLETE 3D MECHANICAL EXPLODED VIEW',
      desc: 'All 120 certified components isolated in full engineering detail',
      status: 'PEAK EXPLODED VIEW'
    };
  }
};

export const ExplodedMotorcycleHero: React.FC<ExplodedMotorcycleHeroProps> = ({
  className = '',
  onFrameChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cached image elements
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Animation playback state refs (avoid React rerenders during high-frequency loop)
  const currentFrameRef = useRef<number>(0);
  const directionRef = useRef<number>(1); // 1 = forward (disassembling), -1 = backward (assembling)
  const isPlayingRef = useRef<boolean>(true);
  const isScrubbingRef = useRef<boolean>(false);
  const holdUntilRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Render a specific frame onto the canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // Cover math: maintain 16:9 native aspect ratio, center motorcycle
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (canvasAspect > imgAspect) {
      drawW = canvas.width;
      drawH = canvas.width / imgAspect;
      drawX = 0;
      drawY = (canvas.height - drawH) / 2;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imgAspect;
      drawX = (canvas.width - drawW) / 2;
      drawY = (canvas.height - drawH) / 2;
    }

    // Optional fine-tuned vertical adjustment so motorcycle sits centered in hero
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Preload frames in chronological order with priority to initial frames
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    const updateProgress = () => {
      if (isCancelled) return;
      loadedCount++;
      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setLoadProgress(pct);

      // Once the first 8 frames are ready, enable initial rendering immediately
      if (loadedCount >= 8 && !isInitialReady) {
        setIsInitialReady(true);
        renderFrame(0);
      }
    };

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = `/frames/motorcycle-exploded/ezgif-frame-001.jpg`;
    firstImg.onload = () => {
      if (!isCancelled) {
        imagesRef.current[0] = firstImg;
        renderFrame(0);
        updateProgress();
      }
    };
    firstImg.onerror = updateProgress;

    // Concurrently preload all remaining frames
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i + 1).padStart(3, '0');
      img.src = `/frames/motorcycle-exploded/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        if (!isCancelled) {
          imagesRef.current[i] = img;
          updateProgress();
        }
      };
      img.onerror = updateProgress;
    }

    return () => {
      isCancelled = true;
    };
  }, [renderFrame, isInitialReady]);

  // Main animation playback loop with requestAnimationFrame
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isScrubbingRef.current = isScrubbing;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (isPlayingRef.current && !isScrubbingRef.current && isVisibleRef.current) {
        // Handle pause at ends
        if (timestamp < holdUntilRef.current) {
          // currently holding at assembled or exploded state
          lastTimeRef.current = timestamp;
          renderFrame(currentFrameRef.current);
          animFrameIdRef.current = requestAnimationFrame(animate);
          return;
        }

        if (elapsed >= FRAME_INTERVAL) {
          lastTimeRef.current = timestamp - (elapsed % FRAME_INTERVAL);

          let nextFrame = currentFrameRef.current + directionRef.current;

          // Reached peak exploded view (frame 119)
          if (nextFrame >= TOTAL_FRAMES - 1) {
            nextFrame = TOTAL_FRAMES - 1;
            directionRef.current = -1; // smoothly reverse to reassemble
            holdUntilRef.current = timestamp + HOLD_EXPLODED_MS;
          } 
          // Reached fully assembled view (frame 0)
          else if (nextFrame <= 0) {
            nextFrame = 0;
            directionRef.current = 1; // smoothly forward to disassemble
            holdUntilRef.current = timestamp + HOLD_ASSEMBLED_MS;
          }

          currentFrameRef.current = nextFrame;
          renderFrame(nextFrame);

          // Update UI state throttled
          setCurrentFrameDisplay(nextFrame);
          const phase = getMechanicalPhase(nextFrame);
          onFrameChange?.(nextFrame, phase.title);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, isScrubbing, renderFrame, onFrameChange]);

  // Visibility & Intersection Observers (CPU/GPU saving when offscreen)
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting && !document.hidden;
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  // Handle interactive scrubber drag / click
  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value, 10);
    currentFrameRef.current = frame;
    setCurrentFrameDisplay(frame);
    renderFrame(frame);
    const phase = getMechanicalPhase(frame);
    onFrameChange?.(frame, phase.title);
  };

  const handleScrubStart = () => {
    setIsScrubbing(true);
    isScrubbingRef.current = true;
  };

  const handleScrubEnd = () => {
    setIsScrubbing(false);
    isScrubbingRef.current = false;
    lastTimeRef.current = performance.now();
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => {
      isPlayingRef.current = !prev;
      return !prev;
    });
  };

  const currentPhase = getMechanicalPhase(currentFrameDisplay);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#1E201E] select-none ${className}`}
    >
      {/* HTML5 High-Performance Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover will-change-transform pointer-events-none"
      />

      {/* Atmospheric Automotive Lighting Overlays */}
      {/* 1. Left Editorial Gradient: Ensures headlines and search bar remain 100% legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#242622] via-[#242622]/75 sm:via-[#242622]/60 to-transparent pointer-events-none" />

      {/* 2. Bottom Horizon Gradient: Seamless blend into the content sections */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#242622] via-[#242622]/40 to-transparent pointer-events-none" />

      {/* 3. Top Gradient: Subtle elevation behind the navbar */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#242622]/80 to-transparent pointer-events-none" />

      {/* 4. Subtle Radial Vignette: Highlights the red motorcycle and mechanical explosion */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,transparent_35%,rgba(36,38,34,0.4)_85%)] pointer-events-none" />

      {/* Loading Progress Indicator (only visible during initial load) */}
      {loadProgress < 100 && (
        <div className="absolute top-3 right-6 z-20 flex items-center gap-2.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#A4AD98]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>BUFFERING 3D EXPLODED FRAMES: {loadProgress}%</span>
        </div>
      )}

      {/* Interactive Disassembly Telemetry HUD (Bottom Right on Desktop) */}
      <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        <div className="bg-[#242622]/90 backdrop-blur-md border border-[#E9E3D8]/20 p-3 sm:p-4 max-w-xs sm:max-w-sm w-full shadow-2xl space-y-2.5 transition-all">
          
          {/* Header & Phase Tag */}
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="flex items-center gap-1.5 text-red-400 font-bold tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>EXPLODED TWIN HUD</span>
            </span>
            <span className="text-white/60">
              FRAME {String(currentFrameDisplay + 1).padStart(3, '0')} / {TOTAL_FRAMES}
            </span>
          </div>

          {/* Current Disassembly Stage */}
          <div className="space-y-0.5">
            <p className="font-mono font-bold text-xs text-white uppercase tracking-tight line-clamp-1">
              PHASE {currentPhase.phase} // {currentPhase.title}
            </p>
            <p className="text-[10px] text-[#A4AD98] line-clamp-1 font-mono">
              {currentPhase.desc}
            </p>
          </div>

          {/* Interactive Scrub Bar */}
          <div className="space-y-1 pt-1">
            <input
              type="range"
              min={0}
              max={TOTAL_FRAMES - 1}
              value={currentFrameDisplay}
              onChange={handleScrubChange}
              onMouseDown={handleScrubStart}
              onMouseUp={handleScrubEnd}
              onTouchStart={handleScrubStart}
              onTouchEnd={handleScrubEnd}
              className="w-full accent-red-600 bg-white/20 h-1.5 cursor-pointer rounded-none"
              title="Scrub exploded disassembly frames"
            />
          </div>

          {/* Controls Bar: Play/Pause, Replay & Status */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayPause}
                className="p-1 text-white hover:text-red-400 transition-colors flex items-center gap-1"
                title={isPlaying ? 'Pause disassembly' : 'Resume disassembly'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[9px] uppercase">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  currentFrameRef.current = 0;
                  directionRef.current = 1;
                  setCurrentFrameDisplay(0);
                  renderFrame(0);
                }}
                className="p-1 text-white/70 hover:text-white transition-colors"
                title="Restart from fully assembled state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[9px] text-[#A4AD98] uppercase tracking-wider font-semibold">
              {currentPhase.status}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
