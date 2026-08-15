'use client';

import React from 'react';

/**
 * Premium Visual Effects Component:
 * 1. Soft Edge Screen Vignette
 * 2. Film Grain Overlay for luxury tactile depth
 */
export default function VisualEffects() {
  return (
    <>
      {/* Soft Radial Screen Edge Vignette */}
      <div className="fixed inset-0 z-30 pointer-events-none shadow-[inset_0_0_160px_rgba(0,0,0,0.85)]" />

      {/* Subtle Film Grain Noise Texture */}
      <div
        className="fixed inset-0 z-30 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
