"use client";

/*
 * Projects section — showcases of the shipped apps (MPG, DLRG, Gallery):
 * screenshots, feature list and a PhoneMockup. Copy is pulled from i18n (de/en).
 */

import { motion, type Variants } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { sfx } from "@/lib/audio";
import PhoneMockup from "./PhoneMockup";
import Eyebrow from "./Eyebrow";

const MPG_SHOTS = [
  "/screenshots/mpg/dark/homescreen.webp",
  "/screenshots/mpg/dark/timetable.webp",
  "/screenshots/mpg/dark/subtitutes.webp",
  "/screenshots/mpg/dark/mensa.webp",
  "/screenshots/mpg/light/homescreen.webp",
  "/screenshots/mpg/light/timetable.webp",
];

const DLRG_SHOTS = [
  "/screenshots/dlrg/screenshot1.webp",
  "/screenshots/dlrg/screenshot2.webp",
  "/screenshots/dlrg/screenshot3.webp",
  "/screenshots/dlrg/screenshot4.webp",
  "/screenshots/dlrg/screenshot5.webp",
];

const GALLERY_SHOTS = [
  "/screenshots/gallery/01_pictures.webp",
  "/screenshots/gallery/02_viewer.webp",
  "/screenshots/gallery/03_albums.webp",
  "/screenshots/gallery/04_search.webp",
  "/screenshots/gallery/05_album.webp",
];

/*
 * Google Play listing of the Gallery app (de.nizent.gallery.app). Empty for
 * now: the button renders as disabled ("coming soon") until the URL is set —
 * paste the play.google.com link here on release day.
 */
const GALLERY_PLAY_URL = "";

const rise = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
});

function Arrow() {
  return (
    <svg className="nz-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 8h11M9 3.5L13.5 8 9 12.5" />
    </svg>
  );
}

function StoreButton({
  href,
  children,
  primary,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  if (!href) {
    return (
      <span className="nz-btn nz-btn-disabled" aria-disabled>
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => sfx.hover(primary ? 560 : 480)}
      onClick={() => sfx.click()}
      className={`nz-btn ${primary ? "nz-btn-primary" : "nz-btn-secondary"}`}
      data-hover
    >
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

function ProjectShowcase({
  id,
  index,
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
  index: string;
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
        <div className={`order-2 text-center lg:text-left ${flip ? "lg:order-2" : "lg:order-1"}`}>
          <motion.div
            variants={rise(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mb-6"
          >
            <Eyebrow index={index} label={badge} />
          </motion.div>

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
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                className="tag"
                data-hover
                onMouseEnter={() => sfx.chime()}
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

        <div className={`order-1 flex justify-center ${flip ? "lg:order-1" : "lg:order-2"}`}>
          <motion.div
            initial={{ opacity: 0, y: 70, rotateY: flip ? 18 : -18 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <PhoneMockup shots={shots} alt={alt} />

            <motion.img
              src={icon}
              alt=""
              loading="lazy"
              decoding="async"
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
        index="01"
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
        index="02"
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
        <StoreButton href="https://apps.apple.com/de/app/dlrg-neuffen-beuren/id6751463655">
          {t("dlrg.appstore")}
        </StoreButton>
        <StoreButton href="https://neuffen-beuren.dlrg.de/app-informationen/app-datenschutz">
          {t("dlrg.legal")}
        </StoreButton>
      </ProjectShowcase>

      <ProjectShowcase
        id="gallery"
        index="03"
        badge={t("gallery.badge")}
        title={t("gallery.title")}
        desc={t("gallery.desc")}
        features={[
          t("gallery.feature1"),
          t("gallery.feature2"),
          t("gallery.feature3"),
          t("gallery.feature4"),
        ]}
        shots={GALLERY_SHOTS}
        icon="/screenshots/gallery/icon.webp"
        alt="Gallery App Screenshot"
      >
        <StoreButton href={GALLERY_PLAY_URL || undefined} primary>
          {GALLERY_PLAY_URL ? t("gallery.playstore") : t("gallery.playstoreSoon")}
        </StoreButton>
        {/* Explicit index.html: Next dev (and hosts without directory indexes)
            would 404 / redirect `/gallery/` instead of serving the file. */}
        <StoreButton href="/gallery/index.html">{t("gallery.legal")}</StoreButton>
      </ProjectShowcase>
    </>
  );
}
