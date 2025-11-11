import "./globals.css";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata = {
  title: "TradeHub – Dein moderner Online-Marktplatz",
  description: "TradeHub ist dein sicherer Marktplatz für neue und gebrauchte Artikel."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-6">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
