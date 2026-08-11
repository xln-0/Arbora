-- Restore ownerId as the canonical relation between a tree and its owner.
ALTER TABLE "FamilyTree" DROP CONSTRAINT IF EXISTS "FamilyTree_userId_fkey";
ALTER TABLE "FamilyTree" DROP COLUMN IF EXISTS "userId";

CREATE INDEX IF NOT EXISTS "FamilyTree_ownerId_idx" ON "FamilyTree"("ownerId");

ALTER TABLE "FamilyTree"
ADD CONSTRAINT "FamilyTree_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Trees created before memberships were introduced must remain visible to
-- their owners. IDs are text columns, so a deterministic value is sufficient.
INSERT INTO "TreeMember" ("id", "treeId", "userId", "role", "createdAt")
SELECT CONCAT('owner-', "id"), "id", "ownerId", 'OWNER', CURRENT_TIMESTAMP
FROM "FamilyTree"
ON CONFLICT ("treeId", "userId") DO UPDATE SET "role" = 'OWNER';
