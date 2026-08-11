/*
  Warnings:

  - The values [CHILD] on the enum `RelationshipType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationshipType_new" AS ENUM ('PARENT', 'PARTNER');
ALTER TABLE "Relationship" ALTER COLUMN "type" TYPE "RelationshipType_new" USING ("type"::text::"RelationshipType_new");
ALTER TYPE "RelationshipType" RENAME TO "RelationshipType_old";
ALTER TYPE "RelationshipType_new" RENAME TO "RelationshipType";
DROP TYPE "public"."RelationshipType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "birthDate" SET DATA TYPE DATE,
ALTER COLUMN "deathDate" SET DATA TYPE DATE;
