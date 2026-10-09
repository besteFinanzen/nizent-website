"use client";

/*
 * Contact section + footer. Holds the (real) contact form that POSTs to
 * settings.site.contactApiUrl via the mailer service, with idle / sending /
 * sent / error states and a hidden honeypot field.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { sfx } from "@/lib/audio";
import { settings } from "@/lib/settings";
import Eyebrow from "./Eyebrow";
import Link from "next/link";

// Build-time env override takes precedence; otherwise use settings.json.
const API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API || settings.site.contactApiUrl;

export default function ContactScene() {
  const { t } = useLang();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state !== "idle") return;
    sfx.click();
    setState("sending");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setState("sent");
    } catch {
      setState("error");
    }
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
          <Eyebrow index="06" label={t("contact.badge")} />
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-silver-light md:text-5xl">
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
                {state === "error" && (
                  <p className="rounded-xl border border-rose-400/30 bg-rose-400/5 px-4 py-3 text-center text-sm text-rose-300">
                    {t("contact.error")}
                  </p>
                )}
                <div className="grid gap-5 md:grid-cols-2">
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    placeholder={t("contact.form.name")}
                    className="field"
                  />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder={t("contact.form.email")}
                    className="field"
                  />
                </div>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={update("message")}
                  placeholder={t("contact.form.message")}
                  className="field resize-none"
                />
                {/* honeypot — hidden from humans, catches bots */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={update("company")}
                  className="hidden"
                  aria-hidden="true"
                />
                <motion.button
                  type="submit"
                  disabled={state === "sending"}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => sfx.hover(560)}
                  className="nz-btn nz-btn-primary w-full"
                >
                  <span>{state === "sending" ? "…" : t("contact.form.submit")}</span>
                  <svg className="nz-arrow" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M2 8h11M9 3.5L13.5 8 9 12.5" />
                  </svg>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <footer className="mt-28 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Nizent Logo" className="h-7 w-7" />
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
