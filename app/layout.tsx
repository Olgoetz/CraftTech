import type { Metadata } from "next";
import { Chivo, Chivo_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
});

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "baulink",
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
        <SessionProvider>
          {children}
          <Toaster richColors theme="light" />
        </SessionProvider>
      </body>
    </html>
  );
}
