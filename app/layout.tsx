import type { Metadata } from "next";
import { Baloo_2, Nunito_Sans } from "next/font/google";

import { eventoConfig } from "@/config/evento";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const fonteDisplay = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const fonteCorpo = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: eventoConfig.nomeEvento,
    template: `%s · ${eventoConfig.nomeEvento}`,
  },
  description: eventoConfig.descricaoCurta,
  openGraph: {
    title: eventoConfig.nomeEvento,
    description: eventoConfig.descricaoCurta,
    url: siteUrl,
    siteName: eventoConfig.nomeEvento,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: eventoConfig.nomeEvento,
    description: eventoConfig.descricaoCurta,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fonteDisplay.variable} ${fonteCorpo.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
