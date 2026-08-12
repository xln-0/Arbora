ALTER TABLE "Relationship"
  ADD COLUMN "unionDate" DATE,
  ADD COLUMN "marriageDate" DATE,
  ADD COLUMN "divorceDate" DATE;

UPDATE "Relationship"
SET "unionDate" = "date"
WHERE "type" = 'FREE_UNION';

UPDATE "Relationship"
SET "marriageDate" = "date"
WHERE "type" = 'MARRIAGE';

UPDATE "Relationship"
SET "divorceDate" = "date"
WHERE "type" = 'DIVORCE';

ALTER TABLE "Relationship" DROP COLUMN "date";
