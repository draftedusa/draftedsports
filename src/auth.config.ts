import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";

// ─────────────────────────────────────────────────────────────────────────────
// Edge-safe auth config — NO Prisma, NO pg, NO Node.js-only imports.
// Used directly by middleware (Edge Runtime) and spread into auth.ts.
// ─────────────────────────────────────────────────────────────────────────────
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: { signIn: "/auth/login" },
  callbacks: {
    // Populate JWT token on first sign-in so the middleware can read
    // user id, role, scoutXp, and reputation without a DB round-trip.
    jwt({ token, user }) {
      if (user) {
        token.id         = user.id;
        token.role       = (user as Record<string, unknown>).role       ?? "user";
        token.scoutXp    = (user as Record<string, unknown>).scoutXp    ?? 0;
        token.reputation = (user as Record<string, unknown>).reputation ?? "";
      }
      return token;
    },
    // Map token claims → session.user so client components can read them.
    session({ session, token }) {
      if (session.user) {
        session.user.id         = (token.sub ?? token.id) as string;
        session.user.scoutXp    = (token.scoutXp    as number) ?? 0;
        session.user.reputation = (token.reputation as string) ?? "";
        (session.user as Record<string, unknown>).role = token.role ?? "user";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
