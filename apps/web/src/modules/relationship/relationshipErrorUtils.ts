import { ApiError } from "@/api/client";
import { t } from "@/i18n";

export function getRelationshipErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return t("relationship.errors.generic");
  }

  const errorKeys: Record<string, string> = {
    DUPLICATE_RELATIONSHIP: "duplicate",
    RELATIONSHIP_CONFLICT: "conflict",
    RELATIONSHIP_CYCLE: "cycle",
    INVALID_RELATIONSHIP: "invalid",
    INVALID_RELATIONSHIP_DATE: "invalidDate",
    INVALID_RELATIONSHIP_DATE_ORDER: "dateOrder",
    SELF_RELATIONSHIP: "invalid",
  };
  const key = error.code ? errorKeys[error.code] : undefined;

  return t(`relationship.errors.${key ?? "generic"}`);
}
