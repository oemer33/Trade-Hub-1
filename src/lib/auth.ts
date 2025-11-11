import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { prisma } from "@/src/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user || !user.hashedPassword) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        } as any;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub }
        });
        if (user) {
          (session as any).user.id = user.id;
          (session as any).user.role = user.role;
        }
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    }
  },
  pages: {
    signIn: "/auth/login"
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET
};
