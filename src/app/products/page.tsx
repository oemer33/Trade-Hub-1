import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { q?: string; category?: string };
}) {
  const where: any = { active: true };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } }
    ];
  }

  if (searchParams.category) {
    where.category = searchParams.category;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      seller: true,
      images: { take: 1 }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Alle Produkte</h1>
      <form className="flex gap-2 text-xs mb-2">
        <input
          name="q"
          placeholder="Suche nach Artikeln..."
          defaultValue={searchParams.q}
          className="flex-1 border border-slate-200 rounded-md px-3 py-2"
        />
        <input
          name="category"
          placeholder="Kategorie"
          defaultValue={searchParams.category}
          className="w-32 border border-slate-200 rounded-md px-3 py-2"
        />
        <button className="btn-primary">Filtern</button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
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
    </div>
  );
}
