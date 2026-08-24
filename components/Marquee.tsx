"use client";

import { useLang } from "@/lib/i18n";

export default function Marquee() {
  const { t } = useLang();
  const items = [t("marq.1"), t("marq.2"), t("marq.3"), t("marq.4")];
  const row = [...items, ...items, ...items];

  return (
    <div className="relative z-10 -rotate-1 scale-[1.02] overflow-hidden border-y border-white/5 bg-space-light/70 py-4 backdrop-blur-sm">
      <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap pr-12">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-12" aria-hidden={copy === 1}>
            {row.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className="flex items-center gap-12 font-display text-sm uppercase tracking-[0.3em] text-silver/40"
              >
                {item}
                <span className="inline-block h-1.5 w-1.5 rotate-45 bg-cyan/50" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
