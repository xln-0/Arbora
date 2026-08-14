ALTER TABLE "Event"
ADD COLUMN IF NOT EXISTS "personId" TEXT,
ADD COLUMN IF NOT EXISTS "relationshipId" TEXT;

ALTER TABLE "Event" ALTER COLUMN "title" DROP NOT NULL;

UPDATE "Event" AS event
SET "personId" = (
  SELECT "personId"
  FROM "EventParticipant"
  WHERE "eventId" = event."id"
  ORDER BY "createdAt" ASC, "personId" ASC
  LIMIT 1
);

-- Preserve existing person dates as first-class events without duplicating
-- an event that may already have been entered manually.
INSERT INTO "Event" (
  "id", "treeId", "personId", "type", "title", "date", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  person."treeId",
  person."id",
  'BIRTH'::"EventType",
  NULL,
  person."birthDate",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Person" AS person
WHERE person."birthDate" IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM "Event" AS event
  WHERE event."personId" = person."id"
    AND event."type" = 'BIRTH'
    AND event."date" = person."birthDate"
);

INSERT INTO "Event" (
  "id", "treeId", "personId", "type", "title", "date", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  person."treeId",
  person."id",
  'DEATH'::"EventType",
  NULL,
  person."deathDate",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Person" AS person
WHERE person."deathDate" IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM "Event" AS event
  WHERE event."personId" = person."id"
    AND event."type" = 'DEATH'
    AND event."date" = person."deathDate"
);

INSERT INTO "Event" (
  "id", "treeId", "personId", "relationshipId", "type", "title", "date", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  relationship."treeId",
  relationship."sourcePersonId",
  relationship."id",
  milestone.type,
  NULL,
  milestone.date,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Relationship" AS relationship
CROSS JOIN LATERAL (
  VALUES
    ('FREE_UNION'::"EventType", relationship."unionDate"),
    ('MARRIAGE'::"EventType", relationship."marriageDate"),
    ('DIVORCE'::"EventType", relationship."divorceDate")
) AS milestone(type, date)
WHERE milestone.date IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM "Event" AS event
  WHERE event."relationshipId" = relationship."id"
    AND event."type" = milestone.type
    AND event."date" = milestone.date
);

-- Refuse to silently discard legacy tree-level events. If one exists, this
-- NOT NULL constraint deliberately stops the migration for manual review.
ALTER TABLE "Event" ALTER COLUMN "personId" SET NOT NULL;

ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_personId_fkey";
DROP TABLE "EventParticipant";

ALTER TABLE "Person"
DROP COLUMN "birthDate",
DROP COLUMN "deathDate";

ALTER TABLE "Relationship"
DROP COLUMN "unionDate",
DROP COLUMN "marriageDate",
DROP COLUMN "divorceDate";

CREATE INDEX "Event_personId_idx" ON "Event"("personId");
CREATE INDEX "Event_relationshipId_idx" ON "Event"("relationshipId");

ALTER TABLE "Event"
ADD CONSTRAINT "Event_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "Person"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Event"
ADD CONSTRAINT "Event_relationshipId_fkey"
FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
