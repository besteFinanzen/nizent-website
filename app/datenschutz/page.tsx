"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Datenschutz() {
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
            Datenschutzerklärung
          </h1>

          <div className="space-y-8 text-silver leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                1. Datenschutz auf einen Blick
              </h2>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit personenbezogenen Daten passiert, wenn du diese Website besuchst. Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert werden kannst.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                2. Verantwortliche Stelle
              </h2>
              <p>
                nizent<br />
                [Vor- und Nachname]<br />
                [Straße und Hausnummer]<br />
                [PLZ Ort]<br />
                E-Mail: [kontakt@nizent.de]
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                3. Datenerfassung auf dieser Website
              </h2>
              <h3 className="font-semibold text-silver-light mb-2">
                Server-Log-Dateien
              </h3>
              <p>
                Der Provider dieser Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die dein Browser automatisch an uns übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                4. Kontaktaufnahme
              </h2>
              <p>
                Wenn du uns per Kontaktformular oder E-Mail kontaktierst, wird deine Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten zum Zwecke der Bearbeitung bei uns gespeichert. Diese Daten geben wir nicht ohne deine Einwilligung weiter.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                5. Deine Rechte
              </h2>
              <p>
                Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung deiner personenbezogenen Daten. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz kannst du dich jederzeit an uns wenden.
              </p>
            </section>

            <div className="pt-6 border-t border-white/5 text-sm text-silver/60">
              <p>
                Hinweis: Dieses Impressum enthält Platzhalter. Bitte ersetze die eckigen Klammern durch deine tatsächlichen Angaben und ergänze die Datenschutzerklärung um weitere für deine Website relevante Punkte (z. B. Cookies, externe Dienste, Google Analytics etc.).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
