import { defineConfig, env } from "prisma/config";
import { fileURLToPath } from "node:url";

if (!process.env.DATABASE_URL) {
  process.loadEnvFile(fileURLToPath(new URL("../../.env", import.meta.url)));
}

export default defineConfig({
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
