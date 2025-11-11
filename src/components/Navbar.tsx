"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

export function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 text-sm ${
      pathname === path
        ? "text-tradehub-blue font-semibold"
        : "text-slate-600 hover:text-tradehub-blue"
    }`;

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 gap-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/products" className={linkClass("/products")}>
            Produkte
          </Link>
          <Link href="/sell" className={linkClass("/sell")}>
            Jetzt verkaufen
          </Link>
          <Link href="/help" className={linkClass("/help")}>
            Hilfe
          </Link>
          <Link href="/legal/impressum" className={linkClass("/legal/impressum")}>
            Rechtliches
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="text-sm text-slate-600 hover:text-tradehub-blue"
          >
            Login
          </Link>
          <Link href="/auth/register" className="btn-primary text-xs">
            Registrieren
          </Link>
        </div>
      </div>
    </header>
  );
}
