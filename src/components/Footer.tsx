import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs flex flex-wrap gap-4 justify-between text-slate-500">
        <div>© {new Date().getFullYear()} TradeHub – Dein Marktplatz.</div>
        <div className="flex gap-3">
          <Link href="/legal/impressum">Impressum</Link>
          <Link href="/legal/datenschutz">Datenschutz</Link>
          <Link href="/legal/agb">AGB</Link>
          <Link href="/legal/widerruf">Widerruf</Link>
        </div>
      </div>
    </footer>
  );
}
