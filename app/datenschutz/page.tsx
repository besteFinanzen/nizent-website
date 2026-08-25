"use client";

/*
 * Legal: Datenschutzerklärung (German, legally binding) + English translation
 * (non-binding). Identity fields are placeholders ([...]) — fill before going live.
 */

import { motion } from "framer-motion";
import Link from "next/link";

export default function Datenschutz() {
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
            <span className="eb-text">Datenschutz</span>
          </div>

          <h1 className="font-display text-4xl font-bold text-silver-light mb-6">
            Datenschutzerklärung
          </h1>

          {/* ===== German (legally binding) ===== */}
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                1. Verantwortlicher
              </h2>
              <p className="leading-relaxed">
                Nizent<br />
                Niklas Kimmerle<br />
                Schulweg 19<br />
                72639 Neuffen<br />
                E-Mail: <a href="mailto:kontakt@nizent.de" className="text-cyan hover:underline">
                  kontakt@nizent.de
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                2. Hosting und Server-Log-Dateien
              </h2>
              <p className="leading-relaxed">
                Diese Website wird über netcup GmbH, Daimlerstraße 25, 76185
                Karlsruhe (https://www.netcup.de) gehostet. Der Hoster erhebt und
                speichert automatisch Informationen in sogenannten
                Server-Log-Dateien, die dein Browser bei jedem Zugriff
                übermittelt. Dies umfasst in der Regel: IP-Adresse, Datum und
                Uhrzeit der Anfrage, abgerufene Seite/Datei, Referrer-URL,
                Browsertyp und Betriebssystem. Die Daten werden nicht mit anderen
                Datenquellen zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1
                lit. f DSGVO (berechtigtes Interesse an einem störungsfreien und
                sicheren Betrieb).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                3. Kontaktformular und E-Mail-Kontakt
              </h2>
              <p className="leading-relaxed">
                Wenn du uns über das Kontaktformular oder per E-Mail erreichst,
                verarbeiten wir die von dir angegebenen Daten (Name,
                E-Mail-Adresse, Nachricht) zur Bearbeitung deiner Anfrage.
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
                (Anbahnung eines Vertragsverhältnisses) sowie lit. f DSGVO
                (berechtigtes Interesse an der Beantwortung). Die Übermittlung
                erfolgt über unseren Mail-Dienst (netcup GmbH) an{" "}
                <a href="mailto:kontakt@nizent.de" className="text-cyan hover:underline">
                  kontakt@nizent.de
                </a>. Eine Weitergabe
                an Dritte erfolgt nicht ohne deine Einwilligung.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                4. Speicherung auf dem Endgerät (Ton-Einstellung)
              </h2>
              <p className="leading-relaxed">
                Wenn du die Ton-Steuerung nutzt, speichern wir deine Präferenz
                lokal in deinem Browser (localStorage, Schlüssel
                &quot;nizent-sound&quot;). Dies ist technisch notwendig, um deine
                Auswahl über Sitzungen hinweg beizubehalten (§ 25 Abs. 2 Nr. 2
                TTDSG). Es werden dabei keine personenbezogenen Daten an uns
                übertragen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                5. Keine Cookies, keine Analyse, lokale Schriftarten
              </h2>
              <p className="leading-relaxed">
                Diese Website setzt keine Cookies (außer der unter Punkt 4
                genannten lokalen Speicherung der Toneinstellung) und verwendet
                keine Analyse- oder Tracking-Tools (etwa Google Analytics). Die
                verwendeten Schriftarten (Space Grotesk, Inter) werden lokal
                ausgeliefert; es erfolgt keine Verbindung zu Servern von Google.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                6. Auftragsverarbeiter
              </h2>
              <p className="leading-relaxed">
                Wir setzen folgenden Auftragsverarbeiter ein: netcup GmbH,
                Daimlerstraße 25, 76185 Karlsruhe (Hosting und E-Mail-Versand).
                Die Auftragsverarbeitung erfolgt auf Grundlage von Art. 28 DSGVO.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                7. Speicherdauer
              </h2>
              <p className="leading-relaxed">
                Server-Log-Dateien werden in der Regel nach wenigen Tagen
                automatisch gelöscht. Anfragen über Kontaktformular und E-Mail
                speichern wir so lange, wie es zur Bearbeitung erforderlich ist,
                längstens jedoch bis zum Ablauf gesetzlicher
                Aufbewahrungsfristen, und löschen sie danach.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                8. Deine Rechte
              </h2>
              <p className="leading-relaxed">
                Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
                (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung
                (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen
                die Verarbeitung (Art. 21 DSGVO). Du hast zudem das Recht, dich
                bei einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                9. SSL-/TLS-Verschlüsselung
              </h2>
              <p className="leading-relaxed">
                Diese Website nutzt aus Sicherheitsgründen eine
                SSL-/TLS-Verschlüsselung. Du erkennst dies an dem
                &quot;https://&quot; in der Adresszeile deines Browsers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-silver-light mb-3">
                10. Änderung dieser Datenschutzerklärung
              </h2>
              <p className="leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung an geänderte
                rechtliche Vorgaben oder bei neuen Funktionen anzupassen.
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
              Privacy Policy
            </h2>
            <p className="text-sm text-silver/50 mb-10">
              Informational translation only. The German version above is legally
              binding.
            </p>

            <div className="space-y-10 opacity-90">
              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  1. Controller
                </h3>
                <p className="leading-relaxed">
                  Nizent<br />
                  Niklas Kimmerle<br />
                  Schulweg 19<br />
                  72639 Neuffen<br />
                  Email: <a href="mailto:kontakt@nizent.de" className="text-cyan hover:underline">
                    kontakt@nizent.de
                  </a>
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  2. Hosting and server log files
                </h3>
                <p className="leading-relaxed">
                  This website is hosted by netcup GmbH, Daimlerstraße 25, 76185
                  Karlsruhe (https://www.netcup.de). The host automatically
                  collects information in so-called server log files that your
                  browser transmits on each request, typically: IP address, date
                  and time of the request, requested page/file, referrer URL,
                  browser type and operating system. This data is not merged with
                  other data sources. The legal basis is Art. 6(1)(f) GDPR
                  (legitimate interest in secure and uninterrupted operation).
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  3. Contact form and email
                </h3>
                <p className="leading-relaxed">
                  If you contact us via the contact form or by email, we process
                  the data you provide (name, email address, message) to handle
                  your request. The legal basis is Art. 6(1)(b) GDPR (steps
                  preceding a contract) and Art. 6(1)(f) GDPR (legitimate
                  interest in replying). Transmission is handled by our mail
                  service (netcup GmbH) to <a href="mailto:kontakt@nizent.de" className="text-cyan hover:underline">
                    kontakt@nizent.de
                  </a>.
                  We do not disclose your data to third parties without your
                  consent.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  4. Storage on your device (sound setting)
                </h3>
                <p className="leading-relaxed">
                  When you use the sound toggle, we store your preference locally
                  in your browser (localStorage, key &quot;nizent-sound&quot;).
                  This is technically necessary to keep your choice across
                  sessions (Section 25(2) no. 2 TTDSG). No personal data is
                  transmitted to us in the process.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  5. No cookies, no analytics, local fonts
                </h3>
                <p className="leading-relaxed">
                  This website does not use cookies (apart from the local sound
                  preference storage mentioned in section 4) and does not use any
                  analytics or tracking tools (e.g. Google Analytics). The fonts
                  used (Space Grotesk, Inter) are served locally; no connection
                  to Google servers is made.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  6. Data processors
                </h3>
                <p className="leading-relaxed">
                  We engage the following data processor: netcup GmbH,
                  Daimlerstraße 25, 76185 Karlsruhe (hosting and email delivery).
                  Processing is based on Art. 28 GDPR.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  7. Retention period
                </h3>
                <p className="leading-relaxed">
                  Server log files are usually deleted automatically after a few
                  days. Requests submitted via the contact form or email are
                  stored only as long as necessary to handle them, and at most
                  until applicable statutory retention periods expire, after
                  which they are deleted.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  8. Your rights
                </h3>
                <p className="leading-relaxed">
                  You have the right to access (Art. 15), rectification (Art. 16),
                  erasure (Art. 17), restriction of processing (Art. 18), data
                  portability (Art. 20) and to object to processing (Art. 21
                  GDPR). You also have the right to lodge a complaint with a
                  supervisory authority (Art. 77 GDPR).
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  9. SSL/TLS encryption
                </h3>
                <p className="leading-relaxed">
                  For security reasons this website uses SSL/TLS encryption, which
                  you can recognise by the &quot;https://&quot; in your browser
                  address bar.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg font-semibold text-silver-light mb-2">
                  10. Changes to this privacy policy
                </h3>
                <p className="leading-relaxed">
                  We reserve the right to adapt this privacy policy to changed
                  legal requirements or new features.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
