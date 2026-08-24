"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { scrollToId } from "@/lib/dom";
import { sfx } from "@/lib/audio";

const SECTIONS = [
  { id: "home", key: "nav.home" },
  { id: "mpg", key: "nav.mpg" },
  { id: "dlrg", key: "nav.dlrg" },
  { id: "about", key: "nav.about" },
  { id: "services", key: "nav.services" },
  { id: "contact", key: "nav.contact" },
];

export default function DotNav() {
  const { t } = useLang();
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
      {SECTIONS.map(({ id, key }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => {
              sfx.click();
              scrollToId(id);
            }}
            onMouseEnter={() => sfx.hover()}
            className="group relative flex items-center justify-end"
            aria-label={t(key)}
          >
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full border border-white/10 bg-space/90 px-3 py-1 text-xs text-silver opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
              {t(key)}
            </span>
            <motion.span
              animate={{
                scale: isActive ? 1.4 : 1,
                backgroundColor: isActive ? "#00e0ff" : "transparent",
                borderColor: isActive ? "#00e0ff" : "rgba(201,214,223,0.3)",
              }}
              className={`block h-2.5 w-2.5 rounded-full border ${isActive ? "shadow-[0_0_12px_rgba(0,224,255,0.7)]" : ""}`}
            />
          </button>
        );
      })}
    </nav>
  );
}
