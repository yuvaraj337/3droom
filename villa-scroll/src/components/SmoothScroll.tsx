'use client';

import React from 'react';
import { useLenis, UseLenisOptions } from '@/hooks/useLenis';

interface SmoothScrollProps {
  children: React.ReactNode;
  options?: UseLenisOptions;
}

/**
 * Provider component for Lenis smooth scrolling across the Next.js application.
 */
export default function SmoothScroll({ children, options }: SmoothScrollProps) {
  useLenis(options);

  return <>{children}</>;
}
