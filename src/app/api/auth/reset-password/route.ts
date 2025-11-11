import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  const { email, token, newPassword } = await req.json();

  if (email && !token) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ success: true });

    const t = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        email,
        token: t,
        type: "reset",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60)
      }
    });

    // TODO: E-Mail mit Reset-Link

    return NextResponse.json({ success: true });
  }

  if (token && newPassword) {
    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record || record.type !== "reset" || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token ungültig" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: record.email },
      data: { hashedPassword }
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
}
