"use client";

/*
 * Services section — the offerings list with scroll-linked reveals.
 */

import { useRef } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { sfx } from "@/lib/audio";
import Eyebrow from "./Eyebrow";

const rise: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

function TiltCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(my, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(mx, { stiffness: 160, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set((px - 0.5) * 12);
    my.set(-(py - 0.5) * 10);
    ref.current?.style.setProperty("--glare-x", `${px * 100}%`);
    ref.current?.style.setProperty("--glare-y", `${py * 100}%`);
  };

  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      variants={rise}
      custom={index}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => sfx.chime()}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="service-card glare relative h-full"
        data-hover
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const SERVICES = [
  {
    key: "service1",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-11 w-11">
        <rect x="6" y="6" width="36" height="36" rx="5" stroke="#00e0ff" strokeWidth="2" opacity="0.45" />
        <rect x="13" y="13" width="10" height="10" rx="2" fill="#00e0ff" opacity="0.35" />
        <rect x="27" y="13" width="8" height="4" rx="1.5" fill="#00e0ff" opacity="0.5" />
        <rect x="27" y="20" width="8" height="4" rx="1.5" fill="#00e0ff" opacity="0.3" />
        <rect x="13" y="27" width="22" height="4" rx="1.5" fill="#00e0ff" opacity="0.22" />
      </svg>
    ),
  },
  {
    key: "service2",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-11 w-11">
        <circle cx="24" cy="24" r="17" stroke="#00e0ff" strokeWidth="2" opacity="0.45" />
        <path d="M24 13v11l8 6" stroke="#00e0ff" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
        <circle cx="24" cy="24" r="2.6" fill="#00e0ff" />
      </svg>
    ),
  },
];

export default function ServicesScene() {
  const { t } = useLang();

  return (
    <section id="services" className="relative z-10 flex min-h-screen items-center py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <Eyebrow index="04" label={t("services.badge")} />
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-silver-light md:text-5xl">
            {t("services.title")}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-10 md:grid-cols-2"
        >
          {SERVICES.map((s) => (
            <TiltCard key={s.key} index={0}>
              <div className="mb-6 inline-flex rounded-[6px] border border-cyan/25 bg-cyan/5 p-3">
                {s.icon}
              </div>
              <h3 className="mb-3 font-display text-2xl font-bold text-silver-light">
                {t(`${s.key}.title`)}
              </h3>
              <p className="mb-7 text-sm leading-relaxed text-silver">
                {t(`${s.key}.desc`)}
              </p>
              <ul className="space-y-2.5">
                {["f1", "f2", "f3", "f4"].map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.09, duration: 0.45 }}
                    className="flex items-center gap-3 text-sm text-silver"
                  >
                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center border border-cyan/40">
                      <svg viewBox="0 0 10 10" className="h-2 w-2"><path d="M1 5.5L3.5 8 9 2" stroke="#00e0ff" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
                    </span>
                    {t(`${s.key}.${f}`)}
                  </motion.li>
                ))}
              </ul>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
