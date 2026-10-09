"use client";

/*
 * Right-side dot navigation mirroring SECTION_IDS. Click to jump; the active
 * dot follows scroll progress.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { scrollToId } from "@/lib/dom";
import { sfx } from "@/lib/audio";

const SECTIONS = [
  { id: "home", key: "nav.home" },
  { id: "mpg", key: "nav.mpg" },
  { id: "dlrg", key: "nav.dlrg" },
  { id: "gallery", key: "nav.gallery" },
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
              sfx.nav();
              scrollToId(id);
            }}
            onMouseEnter={() => sfx.hover(600)}
            className="group relative flex items-center justify-end"
            aria-label={t(key)}
            data-hover
          >
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-[6px] border border-white/10 bg-space/90 px-3 py-1 font-display text-[11px] tracking-wider text-silver opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
              {t(key)}
            </span>
            <motion.span
              className="diamond block"
              initial={{ rotate: 45 }}
              animate={{
                rotate: 45,
                scale: isActive ? 1.3 : 1,
                backgroundColor: isActive ? "#00e0ff" : "rgba(4, 18, 31, 0)",
                borderColor: isActive ? "#00e0ff" : "rgba(201, 214, 223, 0.35)",
              }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.25 }}
            />
          </button>
        );
      })}
    </nav>
  );
}
