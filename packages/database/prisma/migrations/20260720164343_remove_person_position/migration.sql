/*
  Warnings:

  - You are about to drop the column `positionMode` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `positionX` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `positionY` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "positionMode",
DROP COLUMN "positionX",
DROP COLUMN "positionY";

-- DropEnum
DROP TYPE "PositionMode";
