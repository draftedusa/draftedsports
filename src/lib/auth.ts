import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";

// ── NextAuth type augmentation ────────────────────────────────────────────
// Extends the built-in Session and User types with custom Prisma fields so
// session.user.scoutXp / .reputation are fully typed without @ts-ignore.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      scoutXp: number;
      reputation: number;
    } & DefaultSession["user"];
  }

  interface User {
    scoutXp?: number;
    reputation?: number;
  }
}

// ── Auth config ───────────────────────────────────────────────────────────
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id         = user.id;
        session.user.scoutXp    = user.scoutXp    ?? 0;
        session.user.reputation = user.reputation ?? 0;
      }
      return session;
    },
  },
});
