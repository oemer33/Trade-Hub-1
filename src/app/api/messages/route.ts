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

  const { productId, toUserId, content } = await req.json();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });

  const buyerId = user.id;
  const sellerId = toUserId || product.sellerId;

  let thread = await prisma.messageThread.findFirst({
    where: { productId, buyerId, sellerId }
  });

  if (!thread) {
    thread = await prisma.messageThread.create({
      data: { productId, buyerId, sellerId }
    });
  }

  const message = await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: user.id,
      content
    }
  });

  return NextResponse.json({ success: true, threadId: thread.id, message });
}
