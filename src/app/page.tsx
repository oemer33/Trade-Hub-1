import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export default async function HomePage() {
  const latest = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      seller: true,
      images: { take: 1 }
    },
    take: 12
  });

  return (
    <div className="flex flex-col gap-8">
      <section className="bg-tradehub-light border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-tradehub-dark">
            TradeHub – Dein vertrauenswürdiger Online-Marktplatz.
          </h1>
          <p className="text-sm text-slate-600">
            Kaufe und verkaufe sicher neue & gebrauchte Artikel.
          </p>
          <div className="flex gap-3">
            <Link href="/sell" className="btn-primary">
              Jetzt verkaufen
            </Link>
            <Link href="/products" className="btn-outline">
              Jetzt kaufen
            </Link>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          • Sichere Accounts & Login <br />
          • Produkt-Listing & Details <br />
          • Rechtliche Seiten als Platzhalter
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Neu auf TradeHub
          </h2>
          <Link href="/products" className="text-xs text-tradehub-blue">
            Alle ansehen
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latest.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              image={p.images[0]?.url}
              sellerName={p.seller.name}
              rating={p.seller.ratingAverage || undefined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
