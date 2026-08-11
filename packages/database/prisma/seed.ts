import "dotenv/config";

import { createPrismaClient } from "../src/client.js";
import argon2 from "argon2";

const prisma = createPrismaClient();

async function main() {
  const passwordHash = await argon2.hash("demo123");

  const demoUser = await prisma.user.upsert({
    where: {
      email: "demo@arbora.local",
    },

    update: {
      passwordHash,
    },

    create: {
      email: "demo@arbora.local",
      passwordHash,
    },
  });

  const testUser = await prisma.user.upsert({
    where: {
      email: "test@arbora.local",
    },

    update: {
      passwordHash,
    },

    create: {
      email: "test@arbora.local",
      passwordHash,
    },
  });

  console.log("✅ Database seed completed successfully");

  console.log({
    users: [
      {
        id: demoUser.id,
        email: demoUser.email,
      },
      {
        id: testUser.id,
        email: testUser.email,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
