"use client";

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
    "nav.about": "Über",
    "nav.services": "Leistungen",
    "nav.contact": "Kontakt",
    "hero.title": "Software, der man vertraut",
    "hero.subtitle": "Maßgeschneidert für genau einen Zweck — gebaut, um etwas zu bewegen.",
    "hero.scroll": "Scrolle durch die Welt",
    "hero.chip1": "Individuelle Software",
    "hero.chip2": "Support & Wartung",
    "hero.chip3": "Apps mit Wirkung",
    "marq.1": "Individuelle Software",
    "marq.2": "Support & Wartung",
    "marq.3": "Mobile Apps",
    "marq.4": "Webplattformen",
    "mpg.badge": "Für den Schulalltag",
    "mpg.title": "MPG App",
    "mpg.desc": "Die offizielle App des Max-Planck-Gymnasiums Nürtingen. Stundenplan, Vertretungsplan, Mensaplan und mehr — immer aktuell, immer dabei. Von Schülern genutzt, jeden Tag.",
    "mpg.feature1": "Stundenplan",
    "mpg.feature2": "Vertretungsplan",
    "mpg.feature3": "Mensaplan",
    "mpg.feature4": "Dunkelmodus",
    "mpg.visit": "mpg-app.de",
    "mpg.playstore": "Google Play",
    "mpg.appstore": "App Store",
    "dlrg.badge": "Ehrenamtliche Entwicklung",
    "dlrg.title": "DLRG Neuffen-Beuren",
    "dlrg.desc": "Kommunikation zwischen Trainern und Mitgliedern der DLRG Ortsgruppe Neuffen-Beuren. Nachrichten, Trainingsorganisation und Gruppenchat — non-profit gebaut, weil die Wasserwacht Technik verdient, die einfach funktioniert.",
    "dlrg.feature1": "Trainingsorganisation",
    "dlrg.feature2": "Gruppenchat",
    "dlrg.feature3": "Push-Benachrichtigungen",
    "dlrg.feature4": "Mitgliederverwaltung",
    "dlrg.playstore": "Google Play",
    "dlrg.appstore": "App Store — demnächst",
    "about.title": "Was nizent ausmacht",
    "about.intro": "Software entsteht nicht am Fließband. Sie wird gebaut — Stein für Stein, mit Bedacht, Präzision und einem klaren Ziel vor Augen.",
    "pillar1.title": "Vertrauen",
    "pillar1.desc": "Keine Überraschungen. Langfristig an deiner Seite. Software, auf die du dich verlassen kannst — heute und in fünf Jahren.",
    "pillar2.title": "Präzision",
    "pillar2.desc": "Ein Zweck, perfekt umgesetzt. Kein Over-Engineering, keine Kompromisse. Handwerk statt Massenware.",
    "pillar3.title": "Wirkung",
    "pillar3.desc": "Software, die zählt — weil sie den Alltag erleichtert und einen echten Unterschied macht. Sinnvoll, nicht nur funktional.",
    "services.badge": "Für dein Projekt",
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
    "contact.badge": "Lass uns reden",
    "contact.title": "Schreib uns",
    "contact.intro": "Du hast ein Projekt, eine Idee oder eine Frage? Erzähl uns davon.",
    "contact.form.name": "Name",
    "contact.form.email": "E-Mail-Adresse",
    "contact.form.message": "Nachricht",
    "contact.form.submit": "Nachricht senden",
    "contact.success": "Nachricht gesendet — wir melden uns!",
    "footer.tagline": "Software, der man vertraut.",
    "legal.imprint": "Impressum",
    "legal.privacy": "Datenschutz",
  },
  en: {
    "nav.home": "Home",
    "nav.mpg": "MPG App",
    "nav.dlrg": "DLRG App",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "hero.title": "Software you can trust",
    "hero.subtitle": "Tailored to exactly one purpose — built to make a difference.",
    "hero.scroll": "Scroll through the world",
    "hero.chip1": "Custom Software",
    "hero.chip2": "Support & Maintenance",
    "hero.chip3": "Apps that matter",
    "marq.1": "Custom Software",
    "marq.2": "Support & Care",
    "marq.3": "Mobile Apps",
    "marq.4": "Web Platforms",
    "mpg.badge": "Built for school life",
    "mpg.title": "MPG App",
    "mpg.desc": "The official app of Max-Planck-Gymnasium Nürtingen. Timetable, substitution plan, cafeteria menu and more — always up to date, always in your pocket. Used by students, every single day.",
    "mpg.feature1": "Timetable",
    "mpg.feature2": "Substitution Plan",
    "mpg.feature3": "Cafeteria Menu",
    "mpg.feature4": "Dark Mode",
    "mpg.visit": "mpg-app.de",
    "mpg.playstore": "Google Play",
    "mpg.appstore": "App Store",
    "dlrg.badge": "Non-profit project",
    "dlrg.title": "DLRG Neuffen-Beuren",
    "dlrg.desc": "Communication between trainers and members of the DLRG Neuffen-Beuren chapter. Messages, training organization and group chat — built non-profit, because the lifeguards deserve technology that simply works.",
    "dlrg.feature1": "Training Organization",
    "dlrg.feature2": "Group Chat",
    "dlrg.feature3": "Push Notifications",
    "dlrg.feature4": "Member Management",
    "dlrg.playstore": "Google Play",
    "dlrg.appstore": "App Store — coming soon",
    "about.title": "What defines nizent",
    "about.intro": "Great software isn't mass-produced. It's built — block by block, with care, precision and a clear goal in sight.",
    "pillar1.title": "Trust",
    "pillar1.desc": "No surprises. By your side for the long run. Software you can rely on — today and five years from now.",
    "pillar2.title": "Precision",
    "pillar2.desc": "One purpose, perfectly executed. No over-engineering, no compromises. Craft over mass production.",
    "pillar3.title": "Impact",
    "pillar3.desc": "Software that matters — because it makes everyday life easier and creates real change. Meaningful, not just functional.",
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
    "footer.tagline": "Software you can trust.",
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
