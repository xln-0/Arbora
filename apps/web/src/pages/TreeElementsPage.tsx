import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  GitFork,
  Heart,
  HeartCrack,
  HeartHandshake,
  UsersRound,
} from "lucide-react";

import {
  isCoupleRelationshipType,
  type CoupleRelationshipType,
  type Person,
  type Relationship,
} from "@arbora/shared";

import { AppLayout } from "@/components/layout";
import { Avatar } from "@/components/ui";
import { t } from "@/i18n";
import { getRelationshipCurrentDate } from "@/modules/relationship/relationshipUtils";
import { useTreeGraphQuery } from "@/modules/graph/hooks/useTreeGraphQuery";
import { useTreeStore } from "@/stores/treeStore";
import { formatDate, formatPersonLifespan } from "@/utils/dateUtils";

export default function TreeElementsPage() {
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const selectedTree = useTreeStore((state) =>
    state.trees.find((tree) => tree.id === state.selectedTreeId),
  );

  const { graph: elements, isLoading, errorMessage } = useTreeGraphQuery(
    selectedTreeId,
    t("elements.loadError"),
  );

  const persons = useMemo(
    () => [...elements.persons].sort((a, b) => a.id.localeCompare(b.id)),
    [elements.persons],
  );

  const relationships = useMemo(
    () =>
      [...elements.relationships].sort((a, b) => a.id.localeCompare(b.id)),
    [elements.relationships],
  );

  const personNames = useMemo(
    () =>
      new Map(
        persons.map((person) => [
          person.id,
          [person.firstName, person.lastName].filter(Boolean).join(" "),
        ]),
      ),
    [persons],
  );

  function getPersonLabel(personId: string) {
    return personNames.get(personId) ?? t("elements.unknownPerson");
  }

  const title = selectedTree
    ? `${t("navigation.elements")} - ${selectedTree.name}`
    : t("navigation.elements");

  return (
    <AppLayout title={title}>
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
        {!selectedTreeId && (
          <p className="text-muted">{t("elements.noTree")}</p>
        )}

        {selectedTreeId && isLoading && (
          <p className="text-muted">{t("elements.loading")}</p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        {selectedTreeId && !isLoading && !errorMessage && (
          <>
            <div>
              <h2 className="text-2xl font-semibold">
                {t("elements.title")}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {t("elements.description")}
              </p>
            </div>

            <ElementSection
              title={t("elements.persons")}
              count={persons.length}
              emptyLabel={t("elements.noPersons")}
              icon={<UsersRound size={20} />}
            >
              {persons.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </ElementSection>

            <ElementSection
              title={t("elements.relationships")}
              count={relationships.length}
              emptyLabel={t("elements.noRelationships")}
              icon={<GitFork size={20} />}
            >
              {relationships.map((relationship) => (
                <RelationshipCard
                  key={relationship.id}
                  relationship={relationship}
                  sourceName={getPersonLabel(relationship.sourcePersonId)}
                  targetName={getPersonLabel(relationship.targetPersonId)}
                />
              ))}
            </ElementSection>
          </>
        )}
      </div>
    </AppLayout>
  );
}

function ElementSection({
  title,
  count,
  emptyLabel,
  icon,
  children,
}: {
  title: string;
  count: number;
  emptyLabel: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <span className="rounded-full bg-surface-muted px-3 py-1 text-sm font-medium text-muted">
          {count}
        </span>
      </header>

      {count === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">
          {emptyLabel}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {children}
        </div>
      )}
    </section>
  );
}

function PersonCard({ person }: { person: Person }) {
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ");
  const lifespan = formatPersonLifespan(
    person.birthDate ?? undefined,
    person.deathDate ?? undefined,
  );

  const avatarStyle = {
    MALE: "bg-blue-100 text-blue-700",
    FEMALE: "bg-pink-100 text-pink-700",
    UNKNOWN: "bg-primary-soft text-primary",
  }[person.gender];

  return (
    <Link
      to={`/people/${person.id}`}
      className="flex min-h-28 items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <Avatar name={name} className={avatarStyle} />

      <div className="min-w-0">
        <h3 className="truncate font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-muted">
          {t(`gender.${person.gender}`)}
        </p>
        {lifespan && <p className="mt-1 text-xs text-muted">{lifespan}</p>}
      </div>
    </Link>
  );
}

function RelationshipCard({
  relationship,
  sourceName,
  targetName,
}: {
  relationship: Relationship;
  sourceName: string;
  targetName: string;
}) {
  const coupleStyle = isCoupleRelationshipType(relationship.type)
    ? getCoupleCardStyle(relationship.type)
    : undefined;
  const currentDate = getRelationshipCurrentDate(relationship);
  const CoupleIcon = coupleStyle?.icon;

  return (
    <article
      className={`min-h-28 rounded-2xl border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${coupleStyle?.border ?? "border-border"}`}
    >
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${coupleStyle?.badge ?? "bg-primary/10 text-primary"}`}
      >
        {CoupleIcon && <CoupleIcon size={13} />}
        {t(`relationship.types.${relationship.type}`)}
      </span>

      {coupleStyle && currentDate && (
        <span className="ml-2 text-xs text-muted">
          {formatDate(currentDate)}
        </span>
      )}

      <div className="mt-4 flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate font-medium" title={sourceName}>
          {sourceName}
        </span>
        {CoupleIcon ? (
          <CoupleIcon className={coupleStyle.text} size={16} />
        ) : (
          <ArrowRight className="shrink-0 text-muted" size={16} />
        )}
        <span
          className="min-w-0 flex-1 truncate text-right font-medium"
          title={targetName}
        >
          {targetName}
        </span>
      </div>
    </article>
  );
}

function getCoupleCardStyle(type: CoupleRelationshipType) {
  if (type === "FREE_UNION") {
    return {
      icon: HeartHandshake,
      border: "border-cyan-100",
      badge: "bg-cyan-50 text-cyan-700",
      text: "shrink-0 text-cyan-600",
    };
  }

  if (type === "DIVORCE") {
    return {
      icon: HeartCrack,
      border: "border-amber-100",
      badge: "bg-amber-50 text-amber-700",
      text: "shrink-0 text-amber-600",
    };
  }

  return {
    icon: Heart,
    border: "border-rose-100",
    badge: "bg-rose-50 text-rose-700",
    text: "shrink-0 text-rose-500",
  };
}
