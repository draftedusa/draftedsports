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
        // Double-cast needed because AdapterUser doesn't overlap Record<string, unknown>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = user as unknown as any;
        token.role       = u.role       ?? "user";
        token.scoutXp    = u.scoutXp    ?? 0;
        token.reputation = u.reputation ?? "";
      }
      return token;
    },
    // Map token claims → session.user so client components can read them.
    session({ session, token }) {
      if (session.user) {
        session.user.id         = (token.sub ?? token.id) as string;
        session.user.scoutXp    = (token.scoutXp    as number) ?? 0;
        session.user.reputation = (token.reputation as string) ?? "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role ?? "user";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
