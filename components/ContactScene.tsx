"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { sfx } from "@/lib/audio";
import Link from "next/link";

export default function ContactScene() {
  const { t } = useLang();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state !== "idle") return;
    sfx.click();
    setState("sending");
    setTimeout(() => setState("sent"), 1100);
  };

  return (
    <section id="contact" className="relative z-10 flex min-h-screen items-center pt-24 pb-10">
      <div className="mx-auto w-full max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <span className="mb-5 inline-block rounded-full border border-cyan/25 bg-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            {t("contact.badge")}
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-silver-light md:text-5xl">
            {t("contact.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-silver">
            {t("contact.intro")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mx-auto max-w-lg"
        >
          <AnimatePresence mode="wait">
            {state === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 rounded-3xl border border-cyan/25 bg-cyan/5 px-8 py-16 text-center"
              >
                <motion.svg viewBox="0 0 52 52" className="h-16 w-16">
                  <motion.circle
                    cx="26" cy="26" r="24" fill="none" stroke="#00e0ff" strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M15 27l7.5 7.5L38 19" fill="none" stroke="#00e0ff" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                  />
                </motion.svg>
                <p className="font-display text-lg text-silver-light">{t("contact.success")}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, scale: 0.96 }}
                onSubmit={submit}
                className="space-y-5"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <input
                    required
                    type="text"
                    placeholder={t("contact.form.name")}
                    className="field"
                  />
                  <input
                    required
                    type="email"
                    placeholder={t("contact.form.email")}
                    className="field"
                  />
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder={t("contact.form.message")}
                  className="field resize-none"
                />
                <motion.button
                  type="submit"
                  disabled={state === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={() => sfx.hover()}
                  className="group relative w-full overflow-hidden rounded-2xl bg-cyan py-4 font-display font-semibold text-space shadow-lg shadow-cyan/25 transition-shadow hover:shadow-cyan/50 disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative z-10">
                    {state === "sending" ? "…" : t("contact.form.submit")}
                  </span>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <footer className="mt-28 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="nizent" className="h-7 w-7" />
              <div>
                <span className="font-display text-sm font-bold text-silver-light">nizent</span>
                <span className="block text-xs text-silver/50">{t("footer.tagline")}</span>
              </div>
            </div>

            <nav className="flex items-center gap-6 text-sm text-silver/60">
              <Link href="/impressum" className="transition-colors hover:text-cyan">
                {t("legal.imprint")}
              </Link>
              <Link href="/datenschutz" className="transition-colors hover:text-cyan">
                {t("legal.privacy")}
              </Link>
            </nav>

            <span className="text-xs text-silver/40">
              © {new Date().getFullYear()} nizent · nizent.de
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}
