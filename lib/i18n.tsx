"use client";

/*
 * Internationalization. Two string tables (de, en); useLang() returns a t()
 * translator plus the active language and a setter. UI copy lives here so the
 * whole site can switch language without re-rendering route data. When adding
 * strings, add them to BOTH blocks under the same key.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Lang = "de" | "en";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({ lang: "de", setLang: () => {}, t: (k) => k });

const translations: Record<Lang, Record<string, string>> = {
  de: {
    "nav.home": "Start",
    "nav.mpg": "MPG App",
    "nav.dlrg": "DLRG App",
    "nav.gallery": "Galerie App",
    "nav.about": "Über",
    "nav.services": "Leistungen",
    "nav.contact": "Kontakt",
    "hero.title": "Software, die den Unterschied macht",
    "hero.subtitle": "Maßgeschneidert für genau einen Zweck — gebaut, um etwas zu bewegen.",
    "hero.scroll": "Scrolle um mehr zu erfahren",
    "hero.chip1": "Individuelle Software",
    "hero.chip2": "Support & Wartung",
    "hero.chip3": "Apps mit Wirkung",
    "marq.1": "Individualsoftware",
    "marq.2": "SaaS",
    "marq.3": "Mobile Apps",
    "marq.4": "Webplattformen",
    "mpg.badge": "Für den Schulalltag",
    "mpg.title": "MPG App",
    "mpg.desc": "Die (mittlerweile) offizielle App des Max-Planck-Gymnasiums Nürtingen. Stundenplan, Vertretungsplan, Mensaplan und mehr — immer aktuell, immer dabei. Von Schülern genutzt, jeden Tag.",
    "mpg.feature1": "Stundenplan",
    "mpg.feature2": "Vertretungsplan",
    "mpg.feature3": "Mensaplan",
    "mpg.feature4": "Notenrechner",
    "mpg.visit": "mpg-app.de",
    "mpg.playstore": "Google Play",
    "mpg.appstore": "App Store",
    "dlrg.badge": "Ehrenamtliche Entwicklung",
    "dlrg.title": "DLRG Neuffen-Beuren",
    "dlrg.desc": "Kommunikation zwischen Trainern und Jugendlichen der DLRG Ortsgruppe Neuffen-Beuren. Nachrichten, Trainingsorganisation und Gruppenchat — non-profit gebaut, um das bestmögliche Training zu ermöglichen.",
    "dlrg.feature1": "Trainingsorganisation",
    "dlrg.feature2": "Gruppenchat",
    "dlrg.feature3": "Push-Benachrichtigungen",
    "dlrg.feature4": "Terminkalender",
    "dlrg.playstore": "Google Play",
    "dlrg.appstore": "App Store — demnächst",
    "dlrg.legal": "Rechtliches",
    "gallery.badge": "Komplett auf deinem Gerät",
    "gallery.title": "Galerie",
    "gallery.desc":
      "Eine schnelle, private Galerie für Android — Gesichtsgruppierung und Objektsuche laufen komplett auf dem Gerät, Fotos werden nie hochgeladen. Kein Konto, keine Cloud, keine Werbung.",
    "gallery.feature1": "Gesichtsgruppierung",
    "gallery.feature2": "Suche auf dem Gerät",
    "gallery.feature3": "Interaktive Karte",
    "gallery.feature4": "Keine Cloud, keine Werbung",
    "gallery.playstore": "Google Play",
    "gallery.playstoreSoon": "Google Play — demnächst",
    "gallery.legal": "Rechtliches",
    "about.title": "Was Nizent ausmacht",
    "about.intro": "Software entsteht nicht am Fließband. Sie wird gebaut — Stein für Stein, mit Bedacht, Präzision und einem klaren Ziel vor Augen.",
    "pillar1.title": "Exakt",
    "pillar1.desc": "Ein Zweck, perfekt umgesetzt. Kein Over-Engineering, keine Kompromisse. Handwerk statt Massenware.",
    "pillar2.title": "Prägend",
    "pillar2.desc": "Software, die zählt — weil sie den Alltag erleichtert und einen echten Unterschied macht. Sinnvoll, nicht nur funktional.",
    "pillar3.title": "Nachhaltig",
    "pillar3.desc": "Keine Überraschungen. Langfristig an deiner Seite. Software, auf die du dich verlassen kannst — heute und in fünf Jahren.",
    "services.badge": "Für dein Vorhaben",
    "services.title": "Leistungen",
    "service1.title": "Individualsoftware",
    "service1.desc": "Dein Projekt, deine Anforderungen, deine Software. Wir analysieren, konzipieren und entwickeln — genau auf deinen Zweck zugeschnitten, in Handwerksqualität.",
    "service1.f1": "Analyse & Konzeption",
    "service1.f2": "Individuelle Entwicklung",
    "service1.f3": "Web, Mobile & Desktop",
    "service1.f4": "Schnittstellen & Integration",
    "service2.title": "Support & Wartung",
    "service2.desc": "Software lebt. Wir bleiben an deiner Seite — mit Updates, Fehlerbehebung und kontinuierlicher Weiterentwicklung. Langfristig. Zuverlässig.",
    "service2.f1": "Technischer Support",
    "service2.f2": "Updates & Fehlerbehebung",
    "service2.f3": "Weiterentwicklung",
    "service2.f4": "Monitoring & Betrieb",
    "contact.badge": "Sprich uns an",
    "contact.title": "Schreib uns",
    "contact.intro": "Du hast ein Projekt, eine Idee oder eine Frage? Erzähl uns davon.",
    "contact.form.name": "Name",
    "contact.form.email": "E-Mail-Adresse",
    "contact.form.message": "Nachricht",
    "contact.form.submit": "Nachricht senden",
    "contact.success": "Nachricht gesendet — wir melden uns!",
    "contact.error": "Nachricht konnte nicht gesendet werden. Bitte versuch es später erneut.",
    "footer.tagline": "Software, die den Unterschied macht",
    "legal.imprint": "Impressum",
    "legal.privacy": "Datenschutz",
  },
  en: {
    "nav.home": "Home",
    "nav.mpg": "MPG App",
    "nav.dlrg": "DLRG App",
    "nav.gallery": "Gallery App",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "hero.title": "Software that makes a difference",
    "hero.subtitle": "Tailored to exactly one purpose — built to make a difference.",
    "hero.scroll": "Scroll to learn more",
    "hero.chip1": "Custom Software",
    "hero.chip2": "Support & Maintenance",
    "hero.chip3": "Apps that matter",
    "marq.1": "Custom Software",
    "marq.2": "SaaS",
    "marq.3": "Mobile Apps",
    "marq.4": "Web Platforms",
    "mpg.badge": "Built for school life",
    "mpg.title": "MPG App",
    "mpg.desc": "The official app of Max-Planck-Gymnasium Nürtingen. Timetable, substitution plan, cafeteria menu and more — always up to date, always in your pocket. Used by students, every single day.",
    "mpg.feature1": "Timetable",
    "mpg.feature2": "Substitution Plan",
    "mpg.feature3": "Cafeteria Menu",
    "mpg.feature4": "Grade Calculator",
    "mpg.visit": "mpg-app.de",
    "mpg.playstore": "Google Play",
    "mpg.appstore": "App Store",
    "dlrg.badge": "Voluntary development",
    "dlrg.title": "DLRG Neuffen-Beuren",
    "dlrg.desc": "Communication between trainers and youth of the DLRG Neuffen-Beuren local group. Messaging, training organization and group chat — built on a voluntary basis, to enable the best possible training.",
    "dlrg.feature1": "Training Organization",
    "dlrg.feature2": "Group Chat",
    "dlrg.feature3": "Push Notifications",
    "dlrg.feature4": "Appointment Calendar",
    "dlrg.playstore": "Google Play",
    "dlrg.appstore": "App Store — coming soon",
    "dlrg.legal": "Legal",
    "gallery.badge": "Private by design",
    "gallery.title": "Gallery",
    "gallery.desc":
      "A fast, private gallery for Android — face grouping and object search run entirely on your device, photos are never uploaded. No account, no cloud, no ads.",
    "gallery.feature1": "Face grouping",
    "gallery.feature2": "On-device search",
    "gallery.feature3": "Interactive map",
    "gallery.feature4": "No cloud, no ads",
    "gallery.playstore": "Google Play",
    "gallery.playstoreSoon": "Google Play — coming soon",
    "gallery.legal": "Legal",
    "about.title": "What defines Nizent",
    "about.intro": "Great software isn't mass-produced. It's built — block by block, with care, precision and a clear goal in sight.",
    "pillar1.title": "Precision",
    "pillar1.desc": "One purpose, perfectly executed. No over-engineering, no compromises. Craft over mass production.",
    "pillar2.title": "Impact",
    "pillar2.desc": "Software that counts — because it makes everyday life easier and makes a real difference. Meaningful, not just functional.",
    "pillar3.title": "Reliable",
    "pillar3.desc": "No surprises. By your side for the long run. Software you can rely on — today and in five years from now.",
    "services.badge": "For your project",
    "services.title": "Services",
    "service1.title": "Custom Software",
    "service1.desc": "Your project, your requirements, your software. We analyze, design and develop — tailored precisely to your purpose, with true craftsmanship.",
    "service1.f1": "Analysis & Design",
    "service1.f2": "Custom Development",
    "service1.f3": "Web, Mobile & Desktop",
    "service1.f4": "APIs & Integration",
    "service2.title": "Support & Maintenance",
    "service2.desc": "Software lives. We stay by your side — with updates, bug fixes and continuous improvement. Long-term. Reliable.",
    "service2.f1": "Technical Support",
    "service2.f2": "Updates & Bug Fixes",
    "service2.f3": "Continuous Improvement",
    "service2.f4": "Monitoring & Operations",
    "contact.badge": "Let's talk",
    "contact.title": "Get in touch",
    "contact.intro": "You have a project, an idea or a question? Tell us about it.",
    "contact.form.name": "Name",
    "contact.form.email": "Email address",
    "contact.form.message": "Message",
    "contact.form.submit": "Send message",
    "contact.success": "Message sent — we'll get back to you!",
    "contact.error": "Message could not be sent. Please try again later.",
    "footer.tagline": "Software that makes a difference",
    "legal.imprint": "Imprint",
    "legal.privacy": "Privacy Policy",
  },
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("de");

  const t = useCallback(
    (key: string) => translations[lang][key] ?? key,
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
