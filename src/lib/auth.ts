import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const USERS = [
  { id: "1", email: "admin@undrafted.com", password: "admin123", role: "admin", name: "Admin" },
  { id: "2", email: "user@test.com",        password: "user123",  role: "user",  name: "Test User" },
];

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = USERS.find(
          (u) => u.email === credentials?.email && u.password === credentials?.password
        );
        return user ?? null;
      },
    }),
  ],
  pages: { signIn: "/login" },
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
