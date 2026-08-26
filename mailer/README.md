# nizent mailer service

A tiny standalone backend for the site's contact form. It receives a `POST`,
validates it, and emails the message to `kontakt@nizent.de` over SMTP.

It is deployed **separately** from the static site (e.g. on `contact-api.nizent.de`),
because the site itself is a static Next.js export with no server.

---

## API

### `POST /send`

Content-Type `application/json`:

```json
{ "name": "Max Mustermann", "email": "max@example.de", "message": "Hallo!" }
```

- `name`     ≤ 120 chars, required
- `email`    simple email check, ≤ 200 chars, required
- `message`  5–5000 chars, required
- `company`  **honeypot** — hidden field. If filled, the request is silently
  accepted (`{ "ok": true }`) without sending mail (catches bots).

Responses:

| Status | Body | Meaning |
| ------ | ---- | ------- |
| 200 | `{ "ok": true }` | Sent (or honeypot tripped) |
| 400 | `{ "ok": false, "error": "invalid_input" }` | Validation failed |
| 403 | `{ "ok": false, "error": "origin_not_allowed" }` | CORS origin mismatch |
| 429 | `{ "ok": false, "error": "rate_limited" }` | Per-IP limit exceeded |
| 500 | `{ "ok": false, "error": "mail_not_configured" }` | SMTP creds missing |
| 502 | `{ "ok": false, "error": "send_failed" }` | SMTP transport error |

CORS: only the configured origin (default `https://nizent.de`) may call this
endpoint. `OPTIONS /send` handles the preflight.

### `GET /health`

`{ "ok": true }` — for uptime probes.

---

## Configuration

Non-secret defaults are read from the shared **`settings.json`** at the repo
root (`mail` section). In a container the file may not be present, so the
service also has built-in defaults. **Configuration precedence (highest wins):
real environment variables  >  `.env` file  >  `settings.json` defaults.**

The service loads `.env` from its own directory (and the repo root, if run from
there) at startup using a tiny built-in parser — no extra dependency needed.
This means you can set `SMTP_*` (and the other) settings in a `.env` file
instead of (or on top of) platform environment variables.

| Env var | Fallback (settings.json / default) | Notes |
| ------- | ---------------------------------- | ----- |
| `PORT` | `3000` | Listen port |
| `TO_EMAIL` | `mail.toEmail` | Recipient of the form |
| `FROM_EMAIL` | `mail.fromEmail` | `From:` address |
| `FROM_NAME` | `mail.fromName` | `From:` display name |
| `ALLOWED_ORIGIN` | `mail.allowedOrigin` | CORS allow-list |
| `SMTP_HOST` | `mail.smtp.host` | **Required** to send |
| `SMTP_PORT` | `mail.smtp.port` (`587`) | |
| `SMTP_SECURE` | `mail.smtp.secure` (`false`) | `true` for port 465 |
| `SMTP_USER` | `mail.smtp.user` | **Secret** — use env |
| `SMTP_PASS` | `mail.smtp.pass` | **Secret** — use env |

> Never commit real SMTP credentials. Put them in a local `.env` file (already
> gitignored) or in the deployment environment (e.g. Dokploy). See
> `.env.example` for the full list.

---

## Run locally

```bash
npm install
SMTP_HOST=smtp.example.com SMTP_USER=you SMTP_PASS=secret npm start
# or: copy .env.example to .env and `npm start`
```

Health check: `curl http://localhost:3000/health`

---

## Deploy (Docker)

```bash
docker build -t nizent-mailer .
docker run -p 3000:3000 \
  -e SMTP_HOST=... -e SMTP_USER=... -e SMTP_PASS=... \
  -e TO_EMAIL=kontakt@nizent.de -e ALLOWED_ORIGIN=https://nizent.de \
  nizent-mailer
```

On Dokploy, create a second app from `mailer/Dockerfile`, expose port `3000`,
and set the environment variables above. Point `contact-api.nizent.de` at it.
