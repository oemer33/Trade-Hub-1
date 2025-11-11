import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { images: true, seller: true }
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) {
    return NextResponse.json({ error: "User nicht gefunden" }, { status: 404 });
  }

  const body = await req.json();
  const {
    title,
    description,
    price,
    category,
    condition,
    shippingPrice,
    shippingCountries,
    images
  } = body;

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price,
      category,
      condition,
      shippingPrice,
      shippingCountries,
      sellerId: user.id,
      images: {
        create: (images || []).map((url: string) => ({ url }))
      }
    }
  });

  return NextResponse.json(product);
}
