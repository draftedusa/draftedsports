import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // process.env used directly so `prisma generate` succeeds without DATABASE_URL.
    // Migrations and db push still require the var to be set at runtime.
    url: process.env.DATABASE_URL ?? "",
  },
});
