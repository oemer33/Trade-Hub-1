import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  const { token } = await req.json();
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.type !== "verify" || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token ungültig" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { isVerified: true }
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
