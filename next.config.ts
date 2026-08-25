// Next.js config. `output: "export"` builds a fully static site (no server),
// so the contact form talks to an external mailer service instead of API routes.
// Images are unoptimized for static hosting.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
