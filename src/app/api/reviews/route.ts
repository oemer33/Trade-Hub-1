import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) return NextResponse.json({ error: "User nicht gefunden" }, { status: 404 });

  const { orderId, rating, comment } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { buyer: true, seller: true }
  });

  if (!order || order.buyerId != user.id || order.status !== "COMPLETED") {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      orderId: order.id,
      sellerId: order.sellerId,
      rating,
      comment
    }
  });

  const stats = await prisma.review.aggregate({
    where: { sellerId: order.sellerId },
    _avg: { rating: true },
    _count: { rating: true }
  });

  await prisma.user.update({
    where: { id: order.sellerId },
    data: {
      ratingAverage: stats._avg.rating || 0,
      ratingCount: stats._count.rating
    }
  });

  return NextResponse.json({ success: true, review });
}
