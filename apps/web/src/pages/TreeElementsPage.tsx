import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { ArrowRight, GitFork, UsersRound } from "lucide-react";

import type { Person, Relationship } from "@arbora/shared";

import { getTreeGraph } from "@/api/treesApi";
import { AppLayout } from "@/components/layout";
import { Avatar } from "@/components/ui";
import { t } from "@/i18n";
import { useTreeStore } from "@/stores/treeStore";
import { formatPersonLifespan } from "@/utils/dateUtils";

interface TreeElements {
  persons: Person[];
  relationships: Relationship[];
}

const emptyElements: TreeElements = {
  persons: [],
  relationships: [],
};

export default function TreeElementsPage() {
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const selectedTree = useTreeStore((state) =>
    state.trees.find((tree) => tree.id === state.selectedTreeId),
  );

  const [elements, setElements] = useState<TreeElements>(emptyElements);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!selectedTreeId) {
      setElements(emptyElements);
      setErrorMessage(undefined);
      return;
    }

    let cancelled = false;

    async function loadElements() {
      try {
        setIsLoading(true);
        setErrorMessage(undefined);

        const graph = await getTreeGraph(selectedTreeId!);

        if (!cancelled) {
          setElements(graph);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : t("elements.loadError"),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadElements();

    return () => {
      cancelled = true;
    };
  }, [selectedTreeId]);

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
      <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
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
  return (
    <article className="min-h-28 rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
        {t(`relationship.types.${relationship.type}`)}
      </span>

      <div className="mt-4 flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate font-medium" title={sourceName}>
          {sourceName}
        </span>
        <ArrowRight className="shrink-0 text-muted" size={16} />
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
