import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { Demomodus } from "@/components/Demomodus";
import { Kunngjoring } from "@/components/Kunngjoring";
import { TemaRad } from "@/components/TemaBryter";
import { Toaster } from "@/components/ui/sonner";
import { OktProvider } from "@/lib/okt/OktProvider";
import { TEMA_SKRIPT } from "@/lib/temaSkript";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV-assistent",
  description: "Ærlig gap-analyse og søknadshjelp for studenter.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="nb"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // Skriptet i <head> kan sette klassen dark før React tar over.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: TEMA_SKRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <OktProvider>
          <Demomodus />
          <TemaRad />
          {children}
          <Kunngjoring />
          {/* UX-DR11: toast bare for kopiering, øverst på midten på alle skjermer. */}
          <Toaster position="top-center" customAriaLabel="Varsler" />
        </OktProvider>
      </body>
    </html>
  );
}
