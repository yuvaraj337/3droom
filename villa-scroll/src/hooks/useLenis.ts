'use client';

import { useEffect, useRef } from 'react';
import Lenis, { LenisOptions } from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface UseLenisOptions extends LenisOptions {
  autoStart?: boolean;
}

/**
 * Custom React Hook to initialize Lenis smooth scrolling and perfectly sync it
 * with GSAP ScrollTrigger animation frames. Includes clean memory leak prevention on unmount.
 */
export function useLenis(options?: UseLenisOptions) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis with cinematic defaults
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      ...options,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll event to GSAP ScrollTrigger update
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScroll);

    // Connect Lenis RAF loop to GSAP Ticker for 120Hz/60Hz synchronization
    const handleTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(handleTicker);
    gsap.ticker.lagSmoothing(0);

    // Clean up function on unmount to prevent memory leaks
    return () => {
      gsap.ticker.remove(handleTicker);
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [
    options?.duration,
    options?.easing,
    options?.smoothWheel,
    options?.wheelMultiplier,
    options?.touchMultiplier,
  ]);

  return lenisRef;
}

export default useLenis;
