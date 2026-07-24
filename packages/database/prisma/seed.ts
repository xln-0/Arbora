import "dotenv/config";

import { createPrismaClient } from "../src/client.js";
import argon2 from "argon2";

const prisma = createPrismaClient();

async function main() {
  const passwordHash = await argon2.hash("demo123");

  const user = await prisma.user.upsert({
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

  const tree = await prisma.familyTree.upsert({
    where: {
      id: "demo-tree",
    },

    update: {},

    create: {
      id: "demo-tree",
      name: "Demo Tree",
      ownerId: user.id,
    },
  });

  console.log("✅ Database seed completed successfully");

  console.log({
    userId: user.id,
    email: user.email,
    treeId: tree.id,
    treeName: tree.name,
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
