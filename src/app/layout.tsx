import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { Demomodus } from "@/components/Demomodus";
import { OktProvider } from "@/lib/okt/OktProvider";

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
    >
      <body className="min-h-full flex flex-col">
        <OktProvider>
          <Demomodus />
          {children}
        </OktProvider>
      </body>
    </html>
  );
}
