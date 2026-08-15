'use client';

import React from 'react';
import CanvasFrameSequence from '@/components/CanvasFrameSequence';
import HeroOverlay from '@/components/HeroOverlay';
import TimelineOverlays from '@/components/TimelineOverlays';
import ProgressNav from '@/components/ProgressNav';
import CustomCursor from '@/components/CustomCursor';
import VisualEffects from '@/components/VisualEffects';
import SmoothScroll from '@/components/SmoothScroll';

export default function VillaScrollPage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black relative">
        {/* Luxury Custom Cursor */}
        <CustomCursor />

        {/* Film Grain & Soft Vignette Overlays */}
        <VisualEffects />

        {/* Floating Room Progress Navigation Fixed Right */}
        <ProgressNav />

        {/* Pinned Canvas Scroll Section with Hero Overlay & Interior Timeline Overlays */}
        <section id="canvas-section" className="relative w-full">
          <CanvasFrameSequence
            totalFrames={192}
            initialPreloadCount={192}
            overlayContent={
              <>
                <HeroOverlay />
                <TimelineOverlays />
              </>
            }
          />
        </section>

        {/* Architectural Features & Specifications */}
        <section id="specifications" className="py-32 px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="mb-20">
            <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase block mb-3">
              Architectural Specifications
            </span>
            <h2 className="text-4xl md:text-6xl font-extralight tracking-tight">
              Designed for Cinematic Precision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 font-mono text-lg group-hover:bg-emerald-500 group-hover:text-black transition-all">
                01
              </div>
              <h3 className="text-xl font-medium mb-3">Pure Scroll Scrubbing</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Direct 1:1 mapping between scroll position and frame index. No autoplay loops or independent timers.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 font-mono text-lg group-hover:bg-emerald-500 group-hover:text-black transition-all">
                02
              </div>
              <h3 className="text-xl font-medium mb-3">192-Frame Upfront Load</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                All 192 frames compressed from ~12.9 MB down to ~4.7 MB total and preloaded upfront at 100% before playback.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 font-mono text-lg group-hover:bg-emerald-500 group-hover:text-black transition-all">
                03
              </div>
              <h3 className="text-xl font-medium mb-3">3D Parallax & Grain</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Subtle film grain, custom trailing cursor, and 3D mouse parallax on glassmorphism overlay cards.
              </p>
            </div>
          </div>
        </section>

        {/* Footer / Contact */}
        <footer id="inquire" className="py-16 px-8 border-t border-white/10 text-center text-xs font-mono text-gray-500">
          <p>© 2026 Villa Aura Architectural Experience. Powered by Next.js, HTML5 Canvas & GSAP.</p>
        </footer>
      </main>
    </SmoothScroll>
  );
}
