"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { scrollToId } from "@/lib/dom";
import { sfx } from "@/lib/audio";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
};

const wordAnim = {
  hidden: { y: "115%" },
  visible: { y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HeroScene() {
  const { t } = useLang();
  const words = t("hero.title").split(" ");
  const chips = [t("hero.chip1"), t("hero.chip2"), t("hero.chip3")];

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-28 text-center"
    >
      {/* Headline — word-by-word rise (the 3D logo cube floats above) */}
      <motion.h1
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-shimmer glow-text max-w-4xl bg-gradient-to-r from-silver-light via-cyan to-silver-light bg-clip-text font-display text-5xl font-bold leading-[1.06] tracking-tight text-transparent md:text-7xl lg:text-8xl"
        aria-label={t("hero.title")}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span variants={wordAnim} className="inline-block">
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.8 }}
        className="mt-10 max-w-xl text-lg leading-relaxed text-silver md:text-xl"
      >
        {t("hero.subtitle")}
      </motion.p>

      {/* Floating chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55 + i * 0.15, duration: 0.6 }}
            className="tag animate-float"
            style={{ animationDelay: `${i * 1.2}s` }}
            data-hover
          >
            {chip}
          </motion.span>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        onClick={() => {
          sfx.click();
          scrollToId("mpg");
        }}
        onMouseEnter={() => sfx.hover()}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-silver/60 transition-colors hover:text-cyan"
        data-hover
      >
        <span className="text-[11px] uppercase tracking-[0.25em]">{t("hero.scroll")}</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 items-start justify-center rounded-[7px] border border-current pt-1.5"
        >
          <span className="h-2 w-1 rounded-full bg-cyan" />
        </motion.span>
      </motion.button>
    </section>
  );
}
