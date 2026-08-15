'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface CanvasFrameSequenceProps {
  totalFrames?: number;
  initialPreloadCount?: number;
  framePathGetter?: (index: number) => string;
  className?: string;
  onLoaded?: () => void;
  overlayContent?: React.ReactNode;
}

const defaultFramePath = (index: number) => {
  const padded = String(index).padStart(4, '0');
  return `/frames/frame_${padded}.jpg`;
};

export default function CanvasFrameSequence({
  totalFrames = 192,
  initialPreloadCount = 192, // Load ALL 192 frames at once
  framePathGetter = defaultFramePath,
  className = '',
  onLoaded,
  overlayContent,
}: CanvasFrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState<boolean>(true);
  const [isPreloaderFading, setIsPreloaderFading] = useState<boolean>(false);

  // Active frame index & animation frame reference tracking
  const currentFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);
  const resizeRafIdRef = useRef<number | null>(null);

  /**
   * Draw a specific frame to canvas with Retina DPI scaling and aspect ratio fitting.
   */
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current.get(frameIndex);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Adjust canvas buffer size for high-DPI retina screens
    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // High quality rendering options
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate Cover aspect ratio fitting
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, []);

  /**
   * Schedules canvas redraw strictly when the calculated frame index changes.
   * Ensures 60FPS lock by batching redraws with requestAnimationFrame.
   */
  const requestDrawFrame = useCallback(
    (frameIndex: number) => {
      if (currentFrameRef.current === frameIndex) return;
      currentFrameRef.current = frameIndex;

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        drawFrame(frameIndex);
        rafIdRef.current = null;
      });
    },
    [drawFrame]
  );

  // Preload ALL 192 frames upfront in optimized parallel batches
  useEffect(() => {
    let isMounted = true;
    const countToLoad = Math.min(initialPreloadCount, totalFrames);
    let loadedCount = 0;

    const loadSingleFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesRef.current.has(index)) {
          resolve(imagesRef.current.get(index)!);
          return;
        }

        const img = new Image();
        img.src = framePathGetter(index);
        img.onload = () => {
          if (isMounted) {
            imagesRef.current.set(index, img);
          }
          resolve(img);
        };
        img.onerror = () => {
          resolve(img);
        };
      });
    };

    const loadAllFramesUpfront = async () => {
      const batchSize = 20; // High speed batching
      for (let i = 1; i <= countToLoad; i += batchSize) {
        if (!isMounted) break;
        const batchPromises = [];
        for (let j = i; j < i + batchSize && j <= countToLoad; j++) {
          batchPromises.push(
            loadSingleFrame(j).then((img) => {
              loadedCount++;
              if (isMounted) {
                const progress = Math.min(100, Math.floor((loadedCount / countToLoad) * 100));
                setLoadingProgress(progress);
              }
              return img;
            })
          );
        }
        await Promise.all(batchPromises);
        if (i === 1 && isMounted) {
          drawFrame(1);
        }
      }

      if (!isMounted) return;

      drawFrame(1);
      if (onLoaded) onLoaded();

      setIsPreloaderFading(true);
      setTimeout(() => {
        if (isMounted) {
          setIsPreloaderVisible(false);
        }
      }, 500);
    };

    loadAllFramesUpfront();

    return () => {
      isMounted = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (resizeRafIdRef.current !== null) {
        cancelAnimationFrame(resizeRafIdRef.current);
      }
      imagesRef.current.clear();
    };
  }, [totalFrames, initialPreloadCount, framePathGetter, drawFrame, onLoaded]);

  // Window Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (resizeRafIdRef.current !== null) {
        cancelAnimationFrame(resizeRafIdRef.current);
      }
      resizeRafIdRef.current = requestAnimationFrame(() => {
        drawFrame(currentFrameRef.current);
        resizeRafIdRef.current = null;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeRafIdRef.current !== null) {
        cancelAnimationFrame(resizeRafIdRef.current);
      }
    };
  }, [drawFrame]);

  // GSAP ScrollTrigger 1:1 scroll progress scrubbing
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          totalFrames,
          Math.max(1, Math.floor(self.progress * (totalFrames - 1)) + 1)
        );

        requestDrawFrame(frameIndex);
      },
    });

    return () => {
      st.kill();
    };
  }, [totalFrames, requestDrawFrame]);

  return (
    <div ref={containerRef} className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      {/* HTML5 Canvas Element */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover block z-0"
      />

      {/* Overlay Content */}
      {overlayContent && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {overlayContent}
        </div>
      )}

      {/* Preloader Screen */}
      {isPreloaderVisible && (
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white transition-opacity duration-500 ${
            isPreloaderFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
            <div className="flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-emerald-300 uppercase">
                Architecture Visualizer
              </span>
            </div>

            <div className="mb-4">
              <span className="text-7xl font-extralight tracking-tighter bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent font-sans">
                {loadingProgress}
              </span>
              <span className="text-3xl font-light text-emerald-400 ml-1">%</span>
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-4 p-0.5 border border-white/5">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-200 h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <p className="text-xs font-mono text-gray-400 tracking-wider uppercase">
              Preloading All {totalFrames} Frames ({loadingProgress}%)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
