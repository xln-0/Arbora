-- Replace the generic PARTNER value while preserving every existing couple.
BEGIN;
CREATE TYPE "RelationshipType_new" AS ENUM (
  'PARENT',
  'FREE_UNION',
  'MARRIAGE',
  'DIVORCE'
);
ALTER TABLE "Relationship"
  ALTER COLUMN "type" TYPE "RelationshipType_new"
  USING (
    CASE
      WHEN "type"::text = 'PARTNER' THEN 'FREE_UNION'
      ELSE "type"::text
    END
  )::"RelationshipType_new";
ALTER TYPE "RelationshipType" RENAME TO "RelationshipType_old";
ALTER TYPE "RelationshipType_new" RENAME TO "RelationshipType";
DROP TYPE "RelationshipType_old";
COMMIT;
