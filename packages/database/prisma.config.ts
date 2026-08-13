import { defineConfig } from "prisma/config";
import { fileURLToPath } from "node:url";

function getDatasourceUrl() {
  if (
    !process.env.DATABASE_URL &&
    !process.env.POSTGRES_USER &&
    !process.env.POSTGRES_HOST
  ) {
    process.loadEnvFile(fileURLToPath(new URL("../../.env", import.meta.url)));
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
  } = process.env;

  if (
    POSTGRES_USER &&
    POSTGRES_PASSWORD &&
    POSTGRES_HOST &&
    POSTGRES_PORT &&
    POSTGRES_DB
  ) {
    return `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
  }

  throw new Error("Missing PostgreSQL configuration");
}

export default defineConfig({
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: getDatasourceUrl(),
  },
});
