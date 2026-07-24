import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { getDatabaseUrl } from "./config.js";

export function createPrismaClient() {
  const url = getDatabaseUrl();

  const adapter = new PrismaPg({
    connectionString: url,
  });

  return new PrismaClient({
    adapter,
  });
}

export { PrismaClient };
