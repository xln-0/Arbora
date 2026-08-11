-- CreateEnum
CREATE TYPE "TreeMemberRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- DropForeignKey
ALTER TABLE "FamilyTree" DROP CONSTRAINT "FamilyTree_ownerId_fkey";

-- AlterTable
ALTER TABLE "FamilyTree" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "TreeMember" (
    "id" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TreeMemberRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TreeMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TreeMember_userId_idx" ON "TreeMember"("userId");

-- CreateIndex
CREATE INDEX "TreeMember_treeId_idx" ON "TreeMember"("treeId");

-- CreateIndex
CREATE UNIQUE INDEX "TreeMember_treeId_userId_key" ON "TreeMember"("treeId", "userId");

-- CreateIndex
CREATE INDEX "Person_treeId_idx" ON "Person"("treeId");

-- CreateIndex
CREATE INDEX "Relationship_treeId_idx" ON "Relationship"("treeId");

-- CreateIndex
CREATE INDEX "Relationship_sourcePersonId_idx" ON "Relationship"("sourcePersonId");

-- CreateIndex
CREATE INDEX "Relationship_targetPersonId_idx" ON "Relationship"("targetPersonId");

-- AddForeignKey
ALTER TABLE "FamilyTree" ADD CONSTRAINT "FamilyTree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeMember" ADD CONSTRAINT "TreeMember_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "FamilyTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeMember" ADD CONSTRAINT "TreeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
