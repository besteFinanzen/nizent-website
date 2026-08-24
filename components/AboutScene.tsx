"use client";

import { motion, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";
import Eyebrow from "./Eyebrow";

const parent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -12 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const PILLARS = [
  { key: "pillar1", num: "01", icon: "M12 2l8 5v10l-8 5-8-5V7l8-5z" },
  { key: "pillar2", num: "02", icon: "M12 2L2 12l10 10 10-10L12 2zm0 4.5L17.5 12 12 17.5 6.5 12 12 6.5z" },
  { key: "pillar3", num: "03", icon: "M12 2C8 8 4 10 4 15a8 8 0 0016 0c0-5-4-7-8-13z" },
];

export default function AboutScene() {
  const { t } = useLang();

  return (
    <section id="about" className="relative z-10 flex min-h-screen items-center py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <Eyebrow index="03" label="nizent" />
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-silver-light md:text-5xl">
            {t("about.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-silver">
            {t("about.intro")}
          </p>

          {/* Drawn connector line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1.1, ease: "easeOut" }}
            className="mx-auto mt-10 h-px w-2/3 origin-center bg-gradient-to-r from-transparent via-cyan/40 to-transparent"
          />
        </motion.div>

        {/* Three pillars — the three faces of the logo cube */}
        <motion.div
          variants={parent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ perspective: 1200 }}
          className="grid gap-8 md:grid-cols-3"
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.key}
              variants={card}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="pillar-card group relative overflow-hidden"
              data-hover
            >
              <span className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-bold text-white/[0.04] transition-colors duration-500 group-hover:text-cyan/10">
                {p.num}
              </span>

              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rotate-45 rounded-xl border border-cyan/20 transition-all duration-500 group-hover:rotate-[135deg] group-hover:border-cyan/50" />
                <svg viewBox="0 0 24 24" className="relative z-10 h-7 w-7 fill-cyan drop-shadow-[0_0_10px_rgba(0,224,255,0.6)]">
                  <path d={p.icon} />
                </svg>
              </div>

              <h3 className="mb-3 font-display text-xl font-bold text-silver-light">
                {t(`${p.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-silver">{t(`${p.key}.desc`)}</p>

              {/* Bottom glow line */}
              <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan/60 to-transparent transition-all duration-500 group-hover:w-3/4" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
