import Link from "next/link";
import { RatingStars } from "./RatingStars";

type Props = {
  id: string;
  title: string;
  price: number;
  image?: string;
  sellerName: string;
  rating?: number | null;
};

export function ProductCard({ id, title, price, image, sellerName, rating }: Props) {
  return (
    <Link
      href={`/products/${id}`}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex flex-col gap-2 hover:shadow-md transition"
    >
      <div className="w-full h-40 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={title} className="object-cover w-full h-full" />
        ) : (
          <span className="text-slate-400 text-xs">Kein Bild</span>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
          {title}
        </h3>
        <div className="text-tradehub-blue font-bold text-base">{price.toFixed(2)} €</div>
        <div className="text-[10px] text-slate-500">
          Verkäufer: {sellerName}
        </div>
        {typeof rating === "number" && (
          <RatingStars rating={rating} size="xs" />
        )}
      </div>
    </Link>
  );
}
