'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface RoomNavItem {
  id: string;
  number: string;
  name: string;
  startProgress: number;
  midProgress: number;
  endProgress: number;
}

const NAV_ROOMS: RoomNavItem[] = [
  { id: 'entrance', number: '01', name: 'Entrance', startProgress: 0.0, midProgress: 0.08, endProgress: 0.16 },
  { id: 'living', number: '02', name: 'Living Room', startProgress: 0.17, midProgress: 0.25, endProgress: 0.33 },
  { id: 'kitchen', number: '03', name: 'Kitchen', startProgress: 0.34, midProgress: 0.41, endProgress: 0.50 },
  { id: 'bedroom', number: '04', name: 'Bedroom', startProgress: 0.51, midProgress: 0.58, endProgress: 0.66 },
  { id: 'bathroom', number: '05', name: 'Bathroom', startProgress: 0.67, midProgress: 0.74, endProgress: 0.83 },
  { id: 'garden', number: '06', name: 'Garden', startProgress: 0.84, midProgress: 0.90, endProgress: 1.00 },
];

/**
 * Floating Progress Navigation fixed to the right side of the screen.
 * Tracks ScrollTrigger progress through frame ranges, highlights current room,
 * and enables click-to-scroll navigation using Lenis smooth scrolling.
 */
export default function ProgressNav() {
  const [activeRoomId, setActiveRoomId] = useState<string>('entrance');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: '#canvas-section',
      start: 'top top',
      end: '+=400%',
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);

        const currentRoom = NAV_ROOMS.find(
          (room) => progress >= room.startProgress && progress <= room.endProgress
        );
        if (currentRoom) {
          setActiveRoomId(currentRoom.id);
        } else if (progress > 0.95) {
          setActiveRoomId('garden');
        }
      },
    });

    stRef.current = st;

    return () => {
      st.kill();
    };
  }, []);

  const handleRoomClick = (room: RoomNavItem) => {
    if (!stRef.current) return;
    const st = stRef.current;
    const startScroll = st.start;
    const endScroll = st.end;
    const targetScroll = startScroll + room.midProgress * (endScroll - startScroll);

    // Smoothly scroll to exact room target position
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <nav
      className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-5 pointer-events-auto select-none"
      aria-label="Room Progress Navigation"
    >
      {/* Background Vertical Line Track */}
      <div className="absolute right-[9px] top-2 bottom-2 w-[1px] bg-white/10 -z-10" />

      {/* Active Emerald Progress Track */}
      <div
        className="absolute right-[9px] top-2 w-[1px] bg-emerald-400 -z-10 transition-all duration-150 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        style={{ height: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
      />

      {NAV_ROOMS.map((room) => {
        const isActive = activeRoomId === room.id;

        return (
          <button
            key={room.id}
            onClick={() => handleRoomClick(room)}
            className="group flex items-center gap-3 cursor-pointer focus:outline-none py-1"
            aria-label={`Navigate to ${room.name}`}
          >
            {/* Room Name Tooltip / Label */}
            <span
              className={`text-[11px] font-mono tracking-wider transition-all duration-300 ${
                isActive
                  ? 'text-emerald-400 opacity-100 translate-x-0 font-semibold'
                  : 'text-gray-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {room.number}. {room.name}
            </span>

            {/* Indicator Dot */}
            <div className="relative flex items-center justify-center w-5 h-5">
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3 h-3 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] ring-4 ring-emerald-500/20'
                    : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/80 group-hover:w-2 group-hover:h-2'
                }`}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
}
