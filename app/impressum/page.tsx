"use client";

/*
 * Legal: Impressum (German, legally binding) + English translation (non-binding).
 * Identity fields are placeholders ([...]) — fill them in before going live.
 */

import { motion } from "framer-motion";
import Link from "next/link";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-space text-silver px-6 pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan text-sm mb-12 hover:underline"
          >
            <span aria-hidden="true">←</span>
            <span>Nizent</span>
          </Link>

          <div className="eyebrow mb-4">
            <span className="eb-dot" />
            <span className="eb-rule" />
            <span className="eb-text">Rechtliche Angaben</span>
          </div>

          <h1 className="font-display text-4xl font-bold text-silver-light mb-6">
            Impressum
          </h1>

          {/* ===== German (legally binding) ===== */}
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                Angaben gemäß § 5 DDG
              </h2>
              <p className="leading-relaxed">
                Nizent<br />
                Niklas Kimmerle<br />
                Schulweg 19<br />
                72639 Neuffen
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                Kontakt
              </h2>
              <p className="leading-relaxed">
                E-Mail: <a href="mailto:kontakt@nizent.de" className="text-cyan underline hover:opacity-80">
                  kontakt@nizent.de
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                Umsatzsteuer
              </h2>
              <p className="leading-relaxed">
                Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: nicht
                erforderlich (Kleinunternehmer gemäß § 19 UStG).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
              </h2>
              <p className="leading-relaxed">
                Niklas Kimmerle<br />
                Schulweg 19<br />
                72639 Neuffen
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                EU-Streitbeilegung
              </h2>
              <p className="leading-relaxed">
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  className="text-cyan underline hover:opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                . Wir sind nicht verpflichtet und nicht bereit, an
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                Haftung für Inhalte
              </h2>
              <p className="leading-relaxed">
                Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
                nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch
                nicht verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die
                auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                Haftung für Links
              </h2>
              <p className="leading-relaxed">
                Unser Angebot kann Hyperlinks zu Seiten Dritter enthalten, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                Urheberrecht
              </h2>
              <p className="leading-relaxed">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge
                Dritter sind als solche gekennzeichnet.
              </p>
            </section>
          </div>

          {/* ===== English (non-binding) ===== */}
          <div className="mt-20 pt-12 border-t border-white/5">
            <div className="eyebrow mb-4">
              <span className="eb-dot" />
              <span className="eb-rule" />
              <span className="eb-text">English — non-binding</span>
            </div>

            <h2 className="font-display text-3xl font-bold text-silver-light mb-6">
              Imprint
            </h2>
            <p className="text-sm text-silver/50 mb-10">
              Informational translation only. The German version above is legally
              binding.
            </p>

            <div className="space-y-10 opacity-90">
              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  Information pursuant to § 5 DDG
                </h3>
                <p className="leading-relaxed">
                  Nizent<br />
                  Niklas Kimmerle<br />
                  Schulweg 19<br />
                  72639 Neuffen
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  Contact
                </h3>
                <p className="leading-relaxed">
                  Email: <a href="mailto:kontakt@nizent.de" className="text-cyan underline hover:opacity-80">
                    kontakt@nizent.de
                  </a>
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  VAT
                </h3>
                <p className="leading-relaxed">
                  VAT identification number pursuant to § 27a of the German VAT
                  Act: not required (small-business owner under § 19 UStG).
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  Responsible for content pursuant to § 18 (2) MStV
                </h3>
                <p className="leading-relaxed">
                  Niklas Kimmerle<br />
                  Schulweg 19<br />
                  72639 Neuffen
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  EU dispute resolution
                </h3>
                <p className="leading-relaxed">
                  The European Commission provides a platform for online dispute
                  resolution (OS):{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    className="text-cyan underline hover:opacity-80"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  . We are neither obliged nor willing to participate in dispute
                  resolution proceedings before a consumer arbitration board.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  Liability for content / links / copyright
                </h3>
                <p className="leading-relaxed">
                  As a service provider we are responsible for our own content on
                  these pages in accordance with the general laws. We are not
                  obligated to monitor transmitted or stored third-party
                  information. Our offer may contain hyperlinks to third-party
                  sites whose content we have no influence over and for which we
                  accept no liability. Content and works created by the site
                  operators are subject to German copyright law; third-party
                  contributions are marked as such.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
