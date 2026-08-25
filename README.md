# Nizent-website — portfolio site

A single-page, scroll-driven portfolio for **Nizent** (custom-software developer).
It pairs a React/Three.js "isometric cube" logo hero with a sketch/construction-line
design system, German/English i18n, a sound layer, and a real contact form whose
submissions are emailed via a small separate mailer service.

> Built as a **fully static export** (no Next.js server). The contact form calls
> an external API (`api.nizent.de`) instead of Next API routes.

---

## Tech stack

| Concern        | Choice |
| -------------- | ------ |
| Framework      | Next.js 16 (App Router, `output: "export"`) |
| 3D             | React Three Fiber v9 + three 0.185 + `@react-three/drei` |
| Animation      | Framer Motion, Lenis (smooth scroll) |
| Styling        | Tailwind CSS v4 (CSS-first config, no `tailwind.config`) |
| Language       | TypeScript, React 19 |
| Mailer (backend) | Node + Express + Nodemailer (separate service) |
| Hosting        | Docker + nginx on Dokploy |

---

## Project structure

```
nizent-website/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # <html>, fonts, the SVG #nz-rough filter, metadata
│   ├── page.tsx             # assembles all sections + global providers
│   ├── globals.css          # Tailwind import + design tokens (@theme)
│   ├── impressum/           # legal page (placeholder copy)
│   └── datenschutz/         # privacy page (placeholder copy)
├── components/              # UI + 3D
│   ├── IsometricCube.tsx    # the logo, rebuilt piece-by-piece + scroll choreography
│   ├── CubeCanvas.tsx       # R3F canvas: cube, shards, sound-reactive particles
│   ├── HeroScene.tsx        # hero (title chips, scroll hint)
│   ├── ProjectsScene.tsx    # MPG app showcase + PhoneMockup
│   ├── AboutScene.tsx       # mission, pillars, stats
│   ├── ServicesScene.tsx     # services list
│   ├── ContactScene.tsx     # contact form + footer (posts to the mailer)
│   ├── Navbar / DotNav / SoundToggle / Cursor / Marquee / Eyebrow
│   └── SmoothScroll / ScrollProgress / IsometricGrid / PhoneMockup
├── lib/
│   ├── settings.ts          # 🔑 typed wrapper over settings.json (the config reference)
│   ├── audio.ts             # Web Audio engine (music bed, UI sounds, analyser)
│   ├── i18n.tsx             # de/en string tables + useLang()
│   ├── sections.ts          # SECTION_IDS + scroll→section mapping
│   ├── scroll-context.tsx   # scroll-progress context
│   └── dom.ts               # smooth scrollToId helper
├── settings.json            # 🔑 single source of truth for all tunables
├── public/
│   ├── assets/…mp3          # background music file
│   ├── logo.svg / favicon   # brand assets
│   └── screenshots/         # project imagery
├── mailer/                  # contact-form backend (separate deployable app)
│   ├── server.js            # Express endpoint (POST /send, GET /health)
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── scripts/shoot.mjs        # headless Playwright screenshot helper
├── Dockerfile / nginx.conf  # site image (static export → nginx)
└── AGENTS.md                # AI-oriented quickstart (read this for agent onboarding)
```

---

## Quickstart

Requires **Node 20+**.

```bash
npm install          # install frontend deps
npm run dev          # http://localhost:3000 (Next dev)
npm run build        # type-check + produce the static export in ./out
npm run start        # (not used in static mode) Next production server
npm run lint         # eslint
```

The static site is emitted to `out/`. Serve it with any static host or the
provided `Dockerfile` + `nginx.conf`.

### Headless screenshots (dev/QA)

`scripts/shoot.mjs` uses Playwright to capture each section. It needs the site
running (e.g. `python3 -m http.server 4173 -d out`) and the Chromium flags for
software WebGL:

```bash
URL=http://localhost:4173 node scripts/shoot.mjs
```

---

## Configuration

### `settings.json` (🔑 all tunables)

One file drives the frontend **and** the mailer. See `lib/settings.ts` for the
fully-documented, typed shape. Highlights:

| Path | Purpose |
| ---- | ------- |
| `site.contactApiUrl` | Endpoint the contact form POSTs to |
| `audio.music.*` | **Background music**: `enabled` (master switch), `url`, `gain`, `cutoff`, `reverb`, fades |
| `audio.master.*` | Master volume + compressor |
| `audio.fx.*` | **Interaction sounds**: `busGain`, `hover`/`click`/`nav`/`toggleOn`/`toggleOff` notes, `chime` (glockenspiel bell for labels/containers), reverb IR |
| `audio.analysis.*` | Analyser tap → drives the reactive visuals (`sfx.level()`) |
| `visuals.particles.*` | Ambient sound-reactive particle cloud |
| `visuals.cube.*` | Reactive cube emissive / edge-line glow |
| `mail.*` | SMTP (placeholders), recipient, CORS origin, rate limit, honeypot |

Editing `settings.json` changes behaviour at build time — no code edits needed.

### Design tokens

Colors and fonts are defined as CSS custom properties in `app/globals.css`
(`@theme`): `navy`, `steel`, `cyan`, `silver`, `silver-light`, `space`,
`space-light`, plus the `Space Grotesk` / `Inter` font variables. Don't add a
global CSS reset — Tailwind v4 utilities already handle base styles, and an
extra reset previously clobbered utility classes.

### Internationalization

`lib/i18n.tsx` holds two string tables (`de`, `en`). Call `t("some.key")` from
components; the active language is toggled in the navbar. **Add new strings to
both tables under the same key.**

---

## Sound system (`lib/audio.ts`)

- The background music is a single looping MP3. It is intentionally **static**
  (the same in every section). Set `audio.music.enabled = false` in
  `settings.json` to turn it off entirely without changing code.
- Interaction/UI sounds (hover, click, nav, toggle) are synthesized and routed
  through a separate `fxBus`, so their volume is independent of the music bed.
- A glockenspiel-style `sfx.chime()` (bell partials, ~70 ms throttle, pentatonic
  scale) plays when hovering labels (`Eyebrow`) and containers (project tags,
  service/pillar cards, the contact form panel). The store/submit buttons keep
  their original hover/click sounds, and `PhoneMockup` stays silent.
- An `AnalyserNode` tap exposes `sfx.level()` → smoothed `{ bass, mid, high }`
  (0..1). The 3D scene uses this for subtle, non-disturbing reactive glow and
  particles. It returns zeros when sound is off.
- Public API: `sfx.init()`, `sfx.set(bool)`, `sfx.hover()`, `sfx.click()`,
  `sfx.nav()`, `sfx.chime(pitch?)`, `sfx.setMood(i)`, `sfx.level()`, `sfx.stats()`.

---

## Contact form → email

```
ContactScene ──POST /send──▶ mailer (api.nizent.de) ──SMTP──▶ kontakt@nizent.de
```

`components/ContactScene.tsx` sends `{ name, email, message }` (plus a hidden
`company` honeypot field) to `settings.site.contactApiUrl`. The mailer validates
input, blocks bots via the honeypot and a per-IP rate limit, and forwards the
mail over SMTP. See `mailer/README.md` for the endpoint contract and env vars.

---

## Deployment (Dokploy)

Two separate apps:

1. **Site** — build with the root `Dockerfile` (Next build → `out/` → nginx).
   Deploy on `nizent.de` / `www.nizent.de`. The `nginx.conf` handles SPA fallback
   and asset caching.
2. **Mailer** — build with `mailer/Dockerfile` (Node + Express). Deploy on
   `api.nizent.de` (or another subdomain) and set the SMTP + recipient
   environment variables (see `mailer/.env.example`). `settings.json` supplies
   non-secret defaults; **secrets (`SMTP_USER`, `SMTP_PASS`) come from env only**.

DNS: point `nizent.de` (and `www`) at the site, `api.nizent.de` at the mailer.

---

## Notes / caveats

- **Legal pages are placeholders.** `app/impressum` and `app/datenschutz` use
  bracketed `[…]` copy — replace with real Impressum/Datenschutz before launch.
- The cube choreography (`IsometricCube.tsx`) is computed so the extruded pieces
  always meet flush at the section boundaries. If you change the geometry, keep
  the centroid-relative extrusion (`geo.translate(0,0,-DEPTH/2)`).
- The developer account referenced in project links is `bytecave` (unchanged).
