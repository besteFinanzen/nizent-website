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
  title: "nizent — Software, der man vertraut",
  description:
    "nizent entwickelt individuelle Software, die genau auf deinen Zweck zugeschnitten ist. Maßgeschneidert, verlässlich und mit Wirkung.",
  metadataBase: new URL("https://nizent.de"),
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "nizent — Software, der man vertraut",
    description:
      "Individuelle Software, gebaut mit Handwerksqualität. Für Schulen, Vereine und alle, die Technologie zumuten, die wirklich wirkt.",
    url: "https://nizent.de",
    siteName: "nizent",
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
      <body>{children}</body>
    </html>
  );
}
