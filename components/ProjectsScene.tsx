"use client";

import { motion, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { sfx } from "@/lib/audio";
import PhoneMockup from "./PhoneMockup";

const MPG_SHOTS = [
  "/screenshots/mpg/dark/homescreen.png",
  "/screenshots/mpg/dark/timetable.png",
  "/screenshots/mpg/dark/subtitutes.png",
  "/screenshots/mpg/dark/mensa.png",
  "/screenshots/mpg/light/homescreen.png",
  "/screenshots/mpg/light/timetable.png",
];

const DLRG_SHOTS = [
  "/screenshots/dlrg/screenshot1.webp",
  "/screenshots/dlrg/screenshot2.webp",
  "/screenshots/dlrg/screenshot3.webp",
  "/screenshots/dlrg/screenshot4.webp",
  "/screenshots/dlrg/screenshot5.webp",
];

const rise = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
});

function StoreButton({
  href,
  children,
  primary,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const cls = `relative overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
    primary
      ? "bg-cyan text-space shadow-lg shadow-cyan/25 hover:shadow-cyan/50 hover:brightness-110"
      : "border border-silver/25 text-silver hover:border-cyan/60 hover:text-cyan"
  }`;

  if (!href) {
    return (
      <span className={`${cls} cursor-not-allowed border-dashed opacity-60`} aria-disabled>
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => sfx.hover()}
      onClick={() => sfx.click()}
      className={cls}
      data-hover
    >
      {primary && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 hover:translate-x-full" />
      )}
      <span className="relative z-10">{children}</span>
    </a>
  );
}

function ProjectShowcase({
  id,
  badge,
  title,
  desc,
  features,
  shots,
  icon,
  alt,
  flip,
  children,
}: {
  id: string;
  badge: string;
  title: string;
  desc: string;
  features: string[];
  shots: string[];
  icon: string;
  alt: string;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative z-10 flex min-h-screen items-center py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12">
        {/* Text */}
        <div className={`order-2 text-center lg:text-left ${flip ? "lg:order-2" : "lg:order-1"}`}>
          <motion.span
            variants={rise(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mb-5 inline-block rounded-full border border-cyan/25 bg-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan"
          >
            {badge}
          </motion.span>

          <motion.h3
            variants={rise(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="font-display text-4xl font-bold tracking-tight text-silver-light md:text-5xl"
          >
            {title}
          </motion.h3>

          <motion.p
            variants={rise(0.16)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mx-auto mt-5 max-w-lg leading-relaxed text-silver lg:mx-0"
          >
            {desc}
          </motion.p>

          <motion.div
            variants={rise(0.24)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start"
          >
            {features.map((f, i) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-silver backdrop-blur-sm transition-colors hover:border-cyan/40 hover:text-cyan"
                data-hover
              >
                {f}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            variants={rise(0.34)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            {children}
          </motion.div>
        </div>

        {/* Phone */}
        <div className={`order-1 flex justify-center ${flip ? "lg:order-1" : "lg:order-2"}`}>
          <motion.div
            initial={{ opacity: 0, y: 70, rotateY: flip ? 18 : -18 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <PhoneMockup shots={shots} alt={alt} />

            {/* Floating app icon */}
            <motion.img
              src={icon}
              alt=""
              className="animate-float absolute -right-8 -top-8 h-20 w-20 rounded-[22%] border border-white/15 shadow-2xl shadow-black/60 md:h-24 md:w-24"
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, type: "spring", stiffness: 120, damping: 11 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function ProjectsScene() {
  const { t } = useLang();

  return (
    <>
      <ProjectShowcase
        id="mpg"
        badge={t("mpg.badge")}
        title={t("mpg.title")}
        desc={t("mpg.desc")}
        features={[t("mpg.feature1"), t("mpg.feature2"), t("mpg.feature3"), t("mpg.feature4")]}
        shots={MPG_SHOTS}
        icon="/screenshots/mpg/images/app_icon.png"
        alt="MPG App Screenshot"
      >
        <StoreButton href="https://mpg-app.de" primary>{t("mpg.visit")}</StoreButton>
        <StoreButton href="https://play.google.com/store/apps/details?id=de.bytecave.mpg&hl=de">
          {t("mpg.playstore")}
        </StoreButton>
        <StoreButton href="https://apps.apple.com/de/app/mpg-app/id1672365754">
          {t("mpg.appstore")}
        </StoreButton>
      </ProjectShowcase>

      <ProjectShowcase
        id="dlrg"
        badge={t("dlrg.badge")}
        title={t("dlrg.title")}
        desc={t("dlrg.desc")}
        features={[t("dlrg.feature1"), t("dlrg.feature2"), t("dlrg.feature3"), t("dlrg.feature4")]}
        shots={DLRG_SHOTS}
        icon="/screenshots/dlrg/icon.webp"
        alt="DLRG App Screenshot"
        flip
      >
        <StoreButton href="https://play.google.com/store/apps/details?id=de.dlrg.nb.bytecave" primary>
          {t("dlrg.playstore")}
        </StoreButton>
        <StoreButton>{t("dlrg.appstore")}</StoreButton>
      </ProjectShowcase>
    </>
  );
}
