import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/components/providers";
import { Suspense } from "react";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: "400",
});
const geist_Mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "On Time Oil",
  description: "The Best Oil Shop in the town.",
  generator: "developerz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${geist.variable} ${geist_Mono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppProviders>{children}</AppProviders>
          {/* <Analytics /> */}
        </Suspense>
      </body>
    </html>
  );
}
