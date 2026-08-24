"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/audio";

export default function SoundToggle({ compact = false }: { compact?: boolean }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      sfx.init();
      setOn(sfx.enabled);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = () => {
    const v = !on;
    sfx.set(v);
    setOn(v);
  };

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => sfx.hover()}
      aria-label={on ? "Sound off" : "Sound on"}
      data-hover
      className={`flex items-center justify-center border transition-colors ${
        compact ? "h-8 w-8" : "h-9 w-9"
      } rounded-[8px] ${
        on
          ? "border-cyan/60 bg-cyan/10 text-cyan"
          : "border-silver/25 text-silver hover:border-cyan/50 hover:text-cyan"
      }`}
    >
      {on ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
          <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
          <path d="M16 9l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
