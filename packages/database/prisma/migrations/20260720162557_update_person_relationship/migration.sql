/*
  Warnings:

  - The `gender` column on the `Person` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `positionMode` column on the `Person` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Relationship` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('PARENT', 'PARTNER');

-- CreateEnum
CREATE TYPE "PositionMode" AS ENUM ('AUTO', 'MANUAL');

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "lastName" DROP NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
DROP COLUMN "positionMode",
ADD COLUMN     "positionMode" "PositionMode" NOT NULL DEFAULT 'AUTO';

-- AlterTable
ALTER TABLE "Relationship" DROP COLUMN "type",
ADD COLUMN     "type" "RelationshipType" NOT NULL;
