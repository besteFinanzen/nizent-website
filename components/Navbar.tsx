"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { scrollToId } from "@/lib/dom";
import { sfx } from "@/lib/audio";
import SoundToggle from "./SoundToggle";

const LINKS = [
  { id: "mpg", key: "nav.mpg" },
  { id: "dlrg", key: "nav.dlrg" },
  { id: "about", key: "nav.about" },
  { id: "services", key: "nav.services" },
  { id: "contact", key: "nav.contact" },
];

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    sfx.click();
    scrollToId(id);
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-3.5 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-space/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <button
        onClick={() => go("home")}
        onMouseEnter={() => sfx.hover()}
        className="group flex items-center gap-3"
        data-hover
      >
        <img
          src="/logo.svg"
          alt="nizent"
          className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110"
        />
        <span className="font-display text-lg font-bold tracking-tight text-silver-light">
          nizent
        </span>
      </button>

      <div className="hidden items-center gap-7 md:flex">
        {LINKS.map(({ id, key }) => (
          <button
            key={id}
            onClick={() => go(id)}
            onMouseEnter={() => sfx.hover()}
            className="group relative text-sm text-silver transition-colors hover:text-cyan"
            data-hover
          >
            {t(key)}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan transition-all duration-300 group-hover:w-full" />
          </button>
        ))}

        <div className="flex items-center gap-2">
          <SoundToggle compact />
          <button
            onClick={() => {
              sfx.click();
              setLang(lang === "de" ? "en" : "de");
            }}
            onMouseEnter={() => sfx.hover()}
            className="rounded-full border border-cyan/25 px-3.5 py-1.5 text-xs font-bold tracking-wider text-cyan transition-colors hover:bg-cyan/10"
            data-hover
          >
            {lang === "de" ? "EN" : "DE"}
          </button>
        </div>
      </div>

      {/* Mobile burger */}
      <div className="flex items-center gap-3 md:hidden">
        <SoundToggle compact />
        <button
          onClick={() => setLang(lang === "de" ? "en" : "de")}
          className="rounded-full border border-cyan/25 px-3 py-1.5 text-xs font-bold text-cyan"
        >
          {lang === "de" ? "EN" : "DE"}
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-5 bg-silver-light" />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-5 bg-silver-light" />
          <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-5 bg-silver-light" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-white/5 bg-space/95 p-5 backdrop-blur-xl md:hidden"
          >
            {LINKS.map(({ id, key }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className="rounded-xl px-4 py-3 text-left text-silver transition-colors hover:bg-white/5 hover:text-cyan"
              >
                {t(key)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
