CREATE TYPE "EventType" AS ENUM (
  'BIRTH',
  'BAPTISM',
  'EDUCATION',
  'OCCUPATION',
  'RESIDENCE',
  'FREE_UNION',
  'MARRIAGE',
  'DIVORCE',
  'DEATH',
  'BURIAL',
  'OTHER'
);

CREATE TABLE "Event" (
  "id" TEXT NOT NULL,
  "treeId" TEXT NOT NULL,
  "type" "EventType" NOT NULL,
  "title" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "place" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EventParticipant" (
  "eventId" TEXT NOT NULL,
  "personId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("eventId", "personId")
);

CREATE INDEX "Event_treeId_date_idx" ON "Event"("treeId", "date");
CREATE INDEX "Event_treeId_type_idx" ON "Event"("treeId", "type");
CREATE INDEX "EventParticipant_personId_idx" ON "EventParticipant"("personId");

ALTER TABLE "Event"
ADD CONSTRAINT "Event_treeId_fkey"
FOREIGN KEY ("treeId") REFERENCES "FamilyTree"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventParticipant"
ADD CONSTRAINT "EventParticipant_eventId_fkey"
FOREIGN KEY ("eventId") REFERENCES "Event"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventParticipant"
ADD CONSTRAINT "EventParticipant_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "Person"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
