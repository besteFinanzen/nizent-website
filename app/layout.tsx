import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nizent — Software, die den Unterschied macht",
  description:
    "Nizent entwickelt individuelle Software, die genau auf deinen Zweck zugeschnitten ist. Maßgeschneidert, verlässlich und mit Wirkung.",
  metadataBase: new URL("https://nizent.de"),
  openGraph: {
    title: "Nizent — Software, die den Unterschied macht",
    description:
      "Individuelle Software, gebaut mit Handwerksqualität. Für Alle, die Technologie brauchen, die wirkt und nicht nur da ist.",
    url: "https://nizent.de",
    siteName: "Nizent",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
          <filter id="nz-rough" x="-5%" y="-15%" width="110%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
