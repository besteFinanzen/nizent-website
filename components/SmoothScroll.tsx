"use client";

/*
 * Lenis smooth-scroll provider. Instantiates Lenis, runs its RAF loop, and
 * exposes the instance on window.__lenis so scrollToId() can drive it.
 */

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
  onProgress,
}: {
  children: React.ReactNode;
  onProgress: (p: number) => void;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      onProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const initialRaf = requestAnimationFrame(onScroll);
    lenis.on("scroll", onScroll);

    return () => {
      cancelAnimationFrame(initialRaf);
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [onProgress]);

  return <>{children}</>;
}
