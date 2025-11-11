type Props = {
  rating: number;
  size?: "xs" | "sm";
};

export function RatingStars({ rating, size = "sm" }: Props) {
  const full = Math.round(rating);
  const cls = size === "xs" ? "text-[10px]" : "text-xs";
  return (
    <div className={`flex gap-0.5 ${cls} text-yellow-400`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
    </div>
  );
}
