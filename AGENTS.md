# AGENTS.md

Quick orientation for AI agents working in this repository.

## What this is
A **static** Next.js 16 (App Router) single-page portfolio for *Nizent* (custom-software developer). It features a React-Three-Fiber isometric-cube hero, DE/EN i18n, a Web-Audio sound layer, and a contact form whose submissions are emailed by a **separate** Node/Express mailer service. There is **no server** in the site build — the contact form calls an external API instead of Next API routes.

## Commands
- `npm run dev` — local dev server (http://localhost:3000)
- `npm run build` — type-check + static export to `out/`
- `npm run lint` — eslint
- **Node 20+ required.** *Sandbox note:* in this environment Node is at `/tmp/node-v20.18.0-linux-x64/bin` — prepend it to `PATH` (or use the system Node 20).
- Headless QA: `URL=http://localhost:4173 node scripts/shoot.mjs` (Playwright; the script already sets software-WebGL flags).

## Read these first
- `settings.json` + `lib/settings.ts` — **all tunables** (site, audio incl. `music.enabled`, visuals, mail). Single source of truth shared with the mailer.
- `lib/audio.ts` — Web-Audio engine. Background music bed is *static*; `sfx.level()` exposes smoothed `{bass,mid,high}` that drives the reactive 3D visuals. Turn music off via `settings.audio.music.enabled`. `sfx.chime()` is a glockenspiel bell for label/container hovers (config `audio.fx.chime`); store/submit buttons keep their own hover/click, and `PhoneMockup` is silent.
- `components/IsometricCube.tsx` — logo geometry + scroll choreography (pieces stay flush at section boundaries; centroid-relative extrusion).
- `components/ContactScene.tsx` — the form; `POST`s to `settings.site.contactApiUrl`.
- `mailer/server.js` — `POST /send` (validation, honeypot, rate limit, SMTP) + `GET /health`. Reads `settings.json` for non-secret defaults; secrets only from env.
- `app/globals.css` — Tailwind v4 design tokens (`@theme`). **No `tailwind.config`** (CSS-first).

## Conventions & gotchas
- **Static export** (`output: "export"`): no server/API routes. Backend is the `mailer/` app.
- **Tailwind v4 is CSS-first** — do **not** add a global CSS reset (it previously clobbered utility classes).
- **i18n**: every user-facing string needs entries in BOTH the `de` and `en` blocks of `lib/i18n.tsx` under the same key; use `t("key")`.
- **Secrets** (SMTP user/pass) are never committed — supply via env (`SMTP_USER`, `SMTP_PASS`); defaults live in `settings.json` as blanks.
- **Legal pages** (`app/impressum`, `app/datenschutz`) contain placeholder `[…]` copy.
- The cube choreography is computed so the 8 extruded pieces always meet flush; if you alter geometry, keep the centroid-relative extrusion (`geo.translate(0,0,-DEPTH/2)`).
- Reactive visuals read `sfx.level()` once per frame and are intentionally subtle / static when sound is off.

## Common changes
- Tune appearance / sound / contact target → edit `settings.json` (no code change).
- Add a UI string → add to both `de` and `en` blocks in `lib/i18n.tsx`.
- Deploy site → root `Dockerfile` (build → `out/` → nginx) on `nizent.de`.
- Deploy mailer → `mailer/Dockerfile` on `api.nizent.de` with SMTP env vars; `settings.json` supplies non-secret defaults.
