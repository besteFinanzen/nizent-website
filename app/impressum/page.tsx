"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-space text-silver px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-cyan text-sm mb-12 hover:underline">
            ← nizent
          </Link>

          <h1 className="font-display text-4xl font-bold text-silver-light mb-8">
            Impressum
          </h1>

          <div className="space-y-6 text-silver leading-relaxed">
            <div>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-2">
                Angaben gemäß § 5 TMG
              </h2>
              <p>
                nizent<br />
                [Vor- und Nachname]<br />
                [Straße und Hausnummer]<br />
                [PLZ Ort]
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-2">
                Kontakt
              </h2>
              <p>
                E-Mail: [kontakt@nizent.de]
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-2">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>
                [Vor- und Nachname]<br />
                [Straße und Hausnummer]<br />
                [PLZ Ort]
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 text-sm text-silver/60">
              <p>
                Hinweis: Dieses Impressum enthält Platzhalter. Bitte ersetze die eckigen Klammern durch deine tatsächlichen Angaben.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
