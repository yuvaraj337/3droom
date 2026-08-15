'use client';

import React, { useEffect, useState } from 'react';

/**
 * Minimal Premium Hero Overlay featuring:
 * 1. Dynamic transparent-to-blur navbar on scroll
 * 2. Top-left logo mark
 * 3. Top-right minimal nav bar
 * 4. Bottom-center animated scroll indicator
 */
export default function HeroOverlay() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between">
      {/* Dynamic Transparent Navbar */}
      <header
        className={`w-full fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-5 flex justify-between items-center transition-all duration-500 ${
          isScrolled
            ? 'bg-black/70 backdrop-blur-md border-b border-white/10 shadow-2xl py-4'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Top Left: Logo */}
        <div className="pointer-events-auto flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="text-sm font-sans font-light tracking-[0.35em] uppercase text-white">
            VILLA AURA
          </span>
        </div>

        {/* Top Right: Minimal Navigation Bar */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-gray-400">
          <a href="#canvas-section" className="hover:text-emerald-400 transition-colors duration-300">
            Residence
          </a>
          <a href="#specifications" className="hover:text-emerald-400 transition-colors duration-300">
            Specifications
          </a>
          <a href="#inquire" className="hover:text-emerald-400 transition-colors duration-300">
            Inquire
          </a>
        </nav>
      </header>

      {/* Spacer for top bar */}
      <div className="h-20" />

      {/* Bottom Center: Minimal Animated Scroll Indicator */}
      <div className="w-full flex flex-col items-center justify-center pb-8 pointer-events-none">
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-400">
            Scroll
          </span>
          {/* Animated Pill Indicator */}
          <div className="w-5 h-9 rounded-full border border-white/20 flex justify-center pt-2 backdrop-blur-sm bg-black/20">
            <div className="w-1 h-2 rounded-full bg-emerald-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
