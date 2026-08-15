'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface RoomTimelineItem {
  id: string;
  number: string;
  name: string;
  description: string;
  startProgress: number; // 0 to 1
  endProgress: number;   // 0 to 1
  position: 'bottom-left' | 'bottom-right';
}

const ROOM_TIMELINE: RoomTimelineItem[] = [
  {
    id: 'entrance',
    number: '01',
    name: 'The Grand Foyer',
    description: 'Custom travertine stone flooring with ambient architectural light wells.',
    startProgress: 0.02,
    endProgress: 0.16,
    position: 'bottom-left',
  },
  {
    id: 'living',
    number: '02',
    name: 'Living Sanctuary',
    description: 'Double-height ceilings and panoramic floor-to-ceiling glass facades.',
    startProgress: 0.18,
    endProgress: 0.32,
    position: 'bottom-right',
  },
  {
    id: 'kitchen',
    number: '03',
    name: 'Culinary Suite',
    description: 'Monolithic quartz island paired with integrated concealed cabinetry.',
    startProgress: 0.34,
    endProgress: 0.48,
    position: 'bottom-left',
  },
  {
    id: 'bedroom',
    number: '04',
    name: 'Master Suite',
    description: 'Acoustic ribbed wood paneling and private sunset view terrace.',
    startProgress: 0.50,
    endProgress: 0.64,
    position: 'bottom-right',
  },
  {
    id: 'bathroom',
    number: '05',
    name: 'Spa Oasis',
    description: 'Freestanding composite tub and brushed champagne metal fixtures.',
    startProgress: 0.66,
    endProgress: 0.80,
    position: 'bottom-left',
  },
  {
    id: 'garden',
    number: '06',
    name: 'Garden Courtyard',
    description: 'Seamless transition between indoor living and lush private flora.',
    startProgress: 0.82,
    endProgress: 0.96,
    position: 'bottom-right',
  },
];

interface TimelineOverlaysProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function TimelineOverlays({ containerRef }: TimelineOverlaysProps) {
  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);

  // Mouse 3D Parallax effect on glassmorphism cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const deltaX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const deltaY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      cardsRef.current.forEach((card) => {
        gsap.to(card, {
          x: deltaX * 12,
          y: deltaY * 12,
          rotateX: -deltaY * 6,
          rotateY: deltaX * 6,
          transformPerspective: 1000,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP ScrollTrigger timeline for room cards
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const targetElement = containerRef?.current || '#canvas-section';
    if (!targetElement) return;

    const ctx = gsap.context(() => {
      ROOM_TIMELINE.forEach((room) => {
        const cardEl = cardsRef.current.get(room.id);
        if (!cardEl) return;

        gsap.set(cardEl, {
          opacity: 0,
          y: 40,
          filter: 'blur(16px)',
          pointerEvents: 'none',
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: targetElement,
            start: 'top top',
            end: '+=400%',
            scrub: true,
          },
        });

        const fadeDuration = 0.03;
        const holdDuration = room.endProgress - room.startProgress - fadeDuration * 2;

        tl.to(cardEl, { duration: room.startProgress }, 0)
          .to(
            cardEl,
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              pointerEvents: 'auto',
              ease: 'power3.out',
              duration: fadeDuration,
            },
            room.startProgress
          )
          .to(
            cardEl,
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: Math.max(0.01, holdDuration),
            },
            room.startProgress + fadeDuration
          )
          .to(
            cardEl,
            {
              opacity: 0,
              y: -30,
              filter: 'blur(16px)',
              pointerEvents: 'none',
              ease: 'power3.in',
              duration: fadeDuration,
            },
            room.endProgress - fadeDuration
          );
      });
    });

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <div
      ref={parallaxWrapperRef}
      className="absolute inset-0 z-20 pointer-events-none p-6 md:p-12 overflow-hidden flex flex-col justify-end"
    >
      {ROOM_TIMELINE.map((room) => {
        const isLeft = room.position === 'bottom-left';
        return (
          <div
            key={room.id}
            ref={(el) => {
              if (el) cardsRef.current.set(room.id, el);
              else cardsRef.current.delete(room.id);
            }}
            className={`absolute bottom-12 md:bottom-16 ${
              isLeft ? 'left-6 md:left-12' : 'right-6 md:right-12'
            } max-w-sm w-full p-6 md:p-7 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white pointer-events-none transition-all duration-300 will-change-transform`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase">
                  {room.number} / Timeline
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                Villa Aura
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-light tracking-tight mb-2 text-white/90">
              {room.name}
            </h3>

            <p className="text-xs font-light text-gray-300 leading-relaxed">
              {room.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
