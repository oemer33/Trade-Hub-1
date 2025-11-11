import { prisma } from "@/src/lib/db";
import { RatingStars } from "@/src/components/RatingStars";
import Link from "next/link";

export default async function ProductDetailPage({
  params
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      seller: true
    }
  });

  if (!product || !product.active) {
    return <div>Artikel nicht gefunden.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="w-full h-72 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 text-xs">Kein Bild verfügbar</span>
          )}
        </div>
        <div className="flex gap-2">
          {product.images.slice(1).map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={img.url}
              alt=""
              className="w-16 h-16 rounded-md object-cover border border-slate-200"
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          {product.title}
        </h1>
        <div className="text-2xl font-bold text-tradehub-blue">
          {product.price.toFixed(2)} €
        </div>
        <p className="text-sm text-slate-700 whitespace-pre-line">
          {product.description}
        </p>
        <div className="text-xs text-slate-500 space-y-1">
          <div>Kategorie: {product.category}</div>
          <div>Zustand: {product.condition === "NEW" ? "Neu" : "Gebraucht"}</div>
          <div>Versand: ab {product.shippingPrice.toFixed(2)} €</div>
          <div>Versandländer: {product.shippingCountries}</div>
        </div>
        <div className="border-t border-slate-200 pt-3 text-xs">
          <div className="font-semibold">Verkäufer: {product.seller.name}</div>
          {product.seller.ratingCount > 0 && (
            <div className="flex items-center gap-1">
              <RatingStars rating={product.seller.ratingAverage || 0} size="xs" />
              <span className="text-[10px] text-slate-500">
                ({product.seller.ratingCount} Bewertungen)
              </span>
            </div>
          )}
          <Link
            href={`/account/messages?to=${product.sellerId}&product=${product.id}`}
            className="text-[10px] text-tradehub-blue"
          >
            Verkäufer kontaktieren
          </Link>
        </div>
        <div className="flex gap-3 pt-2">
          <form action="/cart" method="POST">
            <input type="hidden" name="productId" value={product.id} />
            <button className="btn-outline w-32" type="submit">
              In den Warenkorb
            </button>
          </form>
          <form action="/checkout" method="POST">
            <input type="hidden" name="productId" value={product.id} />
            <button className="btn-primary w-32" type="submit">
              Sofort kaufen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
