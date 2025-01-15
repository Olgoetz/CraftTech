import type { Metadata } from "next";
import { Geist, Geist_Mono, Chivo, Chivo_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
});

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CraftTech",
  description: "Aufträge für Handwerker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chivo.variable} ${chivoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
