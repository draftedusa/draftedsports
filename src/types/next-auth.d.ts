import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      scoutXp: number;
      reputation: string;
    } & DefaultSession["user"];
  }

  interface User {
    scoutXp: number;
    reputation: string;
  }
}
