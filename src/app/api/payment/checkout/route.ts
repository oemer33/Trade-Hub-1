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

  const { items, method } = await req.json();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Keine Artikel" }, { status: 400 });
  }

  const productIds = items.map((i: any) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
    include: { seller: true }
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "Einige Produkte nicht verfügbar" }, { status: 400 });
  }

  const sellerId = products[0].sellerId;

  let total = 0;
  const orderItemsData: any[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    const quantity = item.quantity || 1;
    total += product.price * quantity + product.shippingPrice;
    orderItemsData.push({
      productId: product.id,
      price: product.price,
      quantity
    });
  }

  const order = await prisma.order.create({
    data: {
      buyerId: user.id,
      sellerId,
      total,
      status: "PAID",
      items: { create: orderItemsData },
      transaction: {
        create: {
          provider: method,
          amount: total,
          success: true,
          providerTxnId: "SANDBOX-" + Date.now()
        }
      }
    },
    include: { items: true }
  });

  return NextResponse.json({
    success: true,
    orderId: order.id
  });
}
