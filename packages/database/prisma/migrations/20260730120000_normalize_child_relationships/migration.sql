-- Store all parent/child relationships in the canonical parent -> child direction.
-- The text cast keeps this migration safe if it is deployed on a database where
-- the legacy CHILD enum value has already been removed.
UPDATE "Relationship"
SET "sourcePersonId" = "targetPersonId",
    "targetPersonId" = "sourcePersonId",
    "type" = 'PARENT'
WHERE "type"::text = 'CHILD';
