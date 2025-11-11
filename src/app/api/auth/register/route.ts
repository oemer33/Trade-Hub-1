import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "E-Mail bereits registriert" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, hashedPassword }
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      email,
      token,
      type: "verify",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
    }
  });

  // TODO: E-Mail mit Verifizierungslink versenden
  // /auth/verify?token=TOKEN

  return NextResponse.json({ success: true });
}
