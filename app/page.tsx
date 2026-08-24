"use client";

import { useState, useEffect, useCallback } from "react";
import { MotionConfig } from "framer-motion";
import { LangProvider } from "@/lib/i18n";
import { ScrollProvider, useScrollProgress } from "@/lib/scroll-context";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import HeroScene from "@/components/HeroScene";
import Marquee from "@/components/Marquee";
import ProjectsScene from "@/components/ProjectsScene";
import AboutScene from "@/components/AboutScene";
import ServicesScene from "@/components/ServicesScene";
import ContactScene from "@/components/ContactScene";
import CubeCanvas from "@/components/CubeCanvas";
import IsometricGrid from "@/components/IsometricGrid";
import DotNav from "@/components/DotNav";
import Cursor from "@/components/Cursor";

const SECTION_IDS = ["home", "mpg", "dlrg", "about", "services", "contact"];

function Inner() {
  const { progress, setProgress } = useScrollProgress();
  const [marks, setMarks] = useState<number[] | null>(null);

  const onProgress = useCallback((p: number) => setProgress(p), [setProgress]);

  // Measure each section's center as a normalized scroll position (0..1)
  // so the 3D cube knows exactly where it should be at any time.
  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      const doc = document.documentElement.scrollHeight - vh;
      if (doc <= 0) return;
      const m = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const center = el.offsetTop + el.offsetHeight / 2 - vh / 2;
        return Math.min(1, Math.max(0, center / doc));
      });
      setMarks((prev) => {
        if (prev && prev.length === m.length && prev.every((v, i) => Math.abs(v - m[i]) < 0.004)) {
          return prev;
        }
        return m;
      });
    };

    measure();
    const t1 = setTimeout(measure, 600);
    const t2 = setTimeout(measure, 2000);
    const t3 = setTimeout(measure, 4000);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <SmoothScroll onProgress={onProgress}>
      <Cursor />
      <ScrollProgress progress={progress} />
      <Navbar />
      <DotNav />
      <IsometricGrid />

      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-drift-a absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-steel/25 blur-[140px]" />
        <div className="animate-drift-b absolute -right-40 bottom-1/4 h-[420px] w-[420px] rounded-full bg-cyan/10 blur-[140px]" />
      </div>

      <CubeCanvas progress={progress} marks={marks} />

      <main className="relative">
        <HeroScene />
        <Marquee />
        <ProjectsScene />
        <AboutScene />
        <ServicesScene />
        <ContactScene />
      </main>
    </SmoothScroll>
  );
}

export default function Home() {
  return (
    <LangProvider>
      <ScrollProvider>
        <MotionConfig reducedMotion="user">
          <Inner />
        </MotionConfig>
      </ScrollProvider>
    </LangProvider>
  );
}
