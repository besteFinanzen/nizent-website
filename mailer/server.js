/*
 * Contact-form mailer service (separate Dokploy app at api.nizent.de).
 *   POST /send   -> validates input, applies a honeypot + per-IP rate limit,
 *                   then sends the message to settings.mail.toEmail via SMTP.
 *   GET  /health -> { ok: true } for uptime checks.
 *   OPTIONS /send-> CORS preflight.
 * Configuration precedence (highest wins):
 *   real environment variables  >  .env file  >  settings.json defaults.
 * So SMTP (and the other) settings can be supplied either by a .env file in
 * this directory, by the platform's environment variables (e.g. Dokploy), or by
 * settings.json (non-secret defaults only).
 */
import express from "express";
import nodemailer from "nodemailer";
import { createRequire } from "module";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);

// --- minimal .env loader (no dependency) ---
// Reads KEY=VALUE pairs from ./.env (and ../.env) into process.env, but never
// overwrites a variable already present (so real env vars always win).
const __dirname = dirname(fileURLToPath(import.meta.url));
for (const p of [join(__dirname, ".env"), join(__dirname, "..", ".env")]) {
  try {
    const txt = readFileSync(p, "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2];
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* no .env at this path — that's fine */
  }
}

// Pull non-secret defaults from the shared settings.json when present (repo
// root). In a container the file may not be copied, so we fall back to DEFAULTS
// and always let environment variables override. Secret SMTP values (user/pass)
// should be supplied via env (SMTP_USER / SMTP_PASS) in production.
let fileMail = {};
for (const candidate of ["../settings.json", "./settings.json", "/settings.json"]) {
  try {
    fileMail = require(candidate)?.mail ?? {};
    break;
  } catch {
    /* try the next candidate path */
  }
}

const DEFAULTS = {
  toEmail: "kontakt@nizent.de",
  fromEmail: "no-reply@nizent.de",
  fromName: "nizent",
  allowedOrigin: "https://nizent.de",
  honeypotField: "company",
  rateLimit: { max: 5, windowMs: 60000 },
  smtp: { host: "", port: 587, secure: false, user: "", pass: "" },
};
const M = { ...DEFAULTS, ...fileMail };

const app = express();
app.use(express.json({ limit: "64kb" }));

const PORT = Number(process.env.PORT || 3000);
const TO_EMAIL = process.env.TO_EMAIL || M.toEmail;
const FROM_EMAIL = process.env.FROM_EMAIL || M.fromEmail;
const FROM_NAME = process.env.FROM_NAME || M.fromName;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || M.allowedOrigin;
const HONEYPOT = M.honeypotField;
const RATE = M.rateLimit;
const SMTP = {
  host: process.env.SMTP_HOST || M.smtp.host || "",
  port: Number(process.env.SMTP_PORT || M.smtp.port || 587),
  secure: String(process.env.SMTP_SECURE ?? String(M.smtp.secure)).toLowerCase() === "true",
  user: process.env.SMTP_USER || M.smtp.user || "",
  pass: process.env.SMTP_PASS || M.smtp.pass || "",
};

// --- basic abuse protection: per-IP rate limit ---
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE.windowMs) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  hits.set(ip, entry);
  return entry.count > RATE.max;
}

// simple email sanity check
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/send", async (req, res) => {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGIN !== "*" && origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ ok: false, error: "origin_not_allowed" });
  }
  res.set("Access-Control-Allow-Origin", origin || ALLOWED_ORIGIN);
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";

  // honeypot: silently succeed if a bot filled the hidden field
  if (req.body && typeof req.body[HONEYPOT] === "string" && req.body[HONEYPOT].length > 0) {
    return res.json({ ok: true });
  }

  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "rate_limited" });
  }

  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!name || name.length > 120 || !EMAIL_RE.test(email) || email.length > 200 || !message || message.length < 5 || message.length > 5000) {
    return res.status(400).json({ ok: false, error: "invalid_input" });
  }

  if (!SMTP.host || !SMTP.user || !SMTP.pass) {
    return res.status(500).json({ ok: false, error: "mail_not_configured" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP.host,
      port: SMTP.port,
      secure: SMTP.secure,
      auth: { user: SMTP.user, pass: SMTP.pass },
    });

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Kontaktformular: ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>E-Mail:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("mail send failed:", err);
    return res.status(502).json({ ok: false, error: "send_failed" });
  }
});

app.options("/send", (req, res) => {
  const origin = req.headers.origin || "";
  res.set("Access-Control-Allow-Origin", origin || ALLOWED_ORIGIN);
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.status(204).end();
});

app.get("/health", (_req, res) => res.json({ ok: true }));

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.listen(PORT, () => console.log(`nizent-mailer listening on :${PORT}`));
