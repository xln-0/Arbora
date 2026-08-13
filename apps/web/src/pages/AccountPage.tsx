import { useState, type FormEvent } from "react";
import { Crown, Mail, Plus, Sprout, Trees, UserRound } from "lucide-react";

import { createTree } from "@/api/treesApi";
import { AppLayout } from "@/components/layout";
import { Avatar, Badge, Button } from "@/components/ui";
import { t } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";
import { useTreeStore } from "@/stores/treeStore";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const addTree = useTreeStore((state) => state.addTree);
  const selectTree = useTreeStore((state) => state.selectTree);
  const trees = useTreeStore((state) => state.trees);
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const [isCreatingTree, setIsCreatingTree] = useState(false);
  const [newTreeName, setNewTreeName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleCreateTree(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newTreeName.trim()) return;

    try {
      setIsCreatingTree(true);
      setErrorMessage(undefined);
      const tree = await createTree({ name: newTreeName.trim() });
      addTree(tree);
      selectTree(tree.id);
      setNewTreeName("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("account.createTreeError"),
      );
    } finally {
      setIsCreatingTree(false);
    }
  }

  const email = user?.email ?? t("settings.unknownUser");

  return (
    <AppLayout title={t("navigation.account")}>
      <main className="mx-auto max-w-5xl space-y-8 p-6 lg:p-8">
        <header className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/50" />
          <div className="px-6 pb-7 sm:px-8">
            <Avatar
              name={email}
              className="-mt-10 h-20 w-20 border-4 border-surface bg-primary text-2xl text-white shadow-sm"
            />
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  {t("account.profile")}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                  {email}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {user && (
                  <Badge
                    className={
                      user.role === "ADMIN"
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-primary/15 bg-primary-soft text-primary"
                    }
                  >
                    {user.role === "ADMIN" && (
                      <Crown className="mr-1.5" size={13} />
                    )}
                    {t(`administration.roles.${user.role}`)}
                  </Badge>
                )}
                <Badge>
                  <Trees className="mr-1.5" size={13} />
                  {t("account.treeCount", { count: String(trees.length) })}
                </Badge>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-surface-muted px-4 py-3">
              <Mail size={17} className="text-primary" />
              <div>
                <p className="text-xs text-muted">{t("account.email")}</p>
                <p className="text-sm font-medium">{email}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Trees size={20} />
              </span>
              <div>
                <h2 className="font-semibold">{t("account.trees")}</h2>
                <p className="mt-1 text-sm text-muted">
                  {t("account.treesDescription")}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleCreateTree}
              className="flex w-full gap-2 lg:max-w-md"
            >
              <input
                className={inputClassName}
                placeholder={t("tree.name")}
                value={newTreeName}
                onChange={(event) => setNewTreeName(event.target.value)}
              />
              <Button
                type="submit"
                disabled={!newTreeName.trim() || isCreatingTree}
                className="shrink-0 rounded-xl px-4"
              >
                <Plus size={16} />
                {t("tree.create")}
              </Button>
            </form>
          </div>

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          {trees.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
              <Sprout className="mx-auto text-primary" size={24} />
              <p className="mt-3 text-sm text-muted">{t("account.noTrees")}</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {trees.map((tree) => {
                const isSelected = tree.id === selectedTreeId;

                return (
                  <button
                    key={tree.id}
                    type="button"
                    onClick={() => selectTree(tree.id)}
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-primary/30 bg-primary/5 shadow-sm"
                        : "border-border hover:bg-surface-muted"
                    }`}
                  >
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isSelected ? "bg-primary text-white" : "bg-primary-soft text-primary"}`}>
                      <Trees size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {tree.name}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-xs text-muted">
                        {tree.role === "OWNER" && <Crown size={12} />}
                        {t(`settings.roles.${tree.role.toLowerCase()}`)}
                      </span>
                    </span>
                    {isSelected && (
                      <span className="rounded-full bg-primary px-2 py-1 text-[0.65rem] font-medium text-white">
                        {t("account.activeTree")}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {!user && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
            <UserRound size={18} />
            {t("account.profileUnavailable")}
          </div>
        )}
      </main>
    </AppLayout>
  );
}

const inputClassName =
  "h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
