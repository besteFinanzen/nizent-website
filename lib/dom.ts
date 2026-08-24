"use client";

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis?.scrollTo) {
    lenis.scrollTo(el, { offset: -70, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
