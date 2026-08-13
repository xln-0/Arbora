CREATE TYPE "AppRole" AS ENUM ('ADMIN', 'USER');

ALTER TABLE "User"
ADD COLUMN "role" "AppRole" NOT NULL DEFAULT 'USER';

-- Preserve access on existing installations: the oldest account becomes admin.
UPDATE "User"
SET "role" = 'ADMIN'
WHERE "id" = (
  SELECT "id"
  FROM "User"
  ORDER BY "createdAt" ASC, "id" ASC
  LIMIT 1
);
