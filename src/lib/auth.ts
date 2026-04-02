import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const USERS = [
  { id: "1", username: "SportsCentralAdmin", email: "admin@undrafted.com", password: "admin123", role: "admin", name: "Admin" },
  { id: "2", username: "testuser", email: "user@test.com", password: "user123", role: "user", name: "Test User" },
];

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = USERS.find(
          (u) =>
            (u.username === credentials?.username || u.email === credentials?.username) &&
            u.password === credentials?.password
        );
        return user ?? null;
      },
    }),
  ],
  pages: { signIn: "/auth/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) (token as Record<string, unknown>).role = (user as Record<string, unknown>).role;
      return token;
    },
    session({ session, token }) {
      (session.user as unknown as Record<string, unknown>).role = token.role;
      return session;
    },
  },
});
