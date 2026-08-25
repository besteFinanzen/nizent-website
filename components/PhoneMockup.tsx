"use client";

/*
 * Framed device mockup that displays app screenshots; used inside ProjectsScene.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function PhoneMockup({
  shots,
  alt,
  interval = 4200,
}: {
  shots: string[];
  alt: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const hovering = useRef(false);

  // 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 180, damping: 20 });
  const rotateY = useSpring(mx, { stiffness: 180, damping: 20 });

  // Autoplay carousel
  useEffect(() => {
    const id = setInterval(() => {
      if (!hovering.current) setIndex((i) => (i + 1) % shots.length);
    }, interval);
    return () => clearInterval(id);
  }, [shots.length, interval]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    my.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onLeave = () => {
    hovering.current = false;
    mx.set(0);
    my.set(0);
  };

  return (
    <div style={{ perspective: 1100 }} className="relative">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={onLeave}
        className="animate-pulse-glow phone-mockup"
        data-hover
      >
        {shots.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === index ? alt : ""}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
            style={{
              opacity: i === index ? 1 : 0,
              transform: `scale(${i === index ? 1 : 1.06})`,
            }}
          />
        ))}

        {/* Prev / next zones */}
        <button
          onClick={() => setIndex((i) => (i - 1 + shots.length) % shots.length)}
          aria-label="Previous screenshot"
          className="group/prev absolute inset-y-0 left-0 z-10 w-1/4 opacity-0 transition-opacity hover:opacity-100"
        >
          <span className="flex h-full items-center justify-start pl-2 text-silver drop-shadow">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </span>
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % shots.length)}
          aria-label="Next screenshot"
          className="group/next absolute inset-y-0 right-0 z-10 w-1/4 opacity-0 transition-opacity hover:opacity-100"
        >
          <span className="flex h-full items-center justify-end pr-2 text-silver drop-shadow">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l6 6-6 6" /></svg>
          </span>
        </button>
      </motion.div>

      {/* Dots */}
      <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 gap-1.5">
        {shots.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Screenshot ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-cyan shadow-[0_0_8px_rgba(0,224,255,0.8)]" : "w-1.5 bg-silver/25 hover:bg-silver/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
