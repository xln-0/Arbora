import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Crown, MailPlus, Settings2, ShieldCheck, Trees } from "lucide-react";

import { addTreeMember } from "@/api/treeMembersApi";
import { deleteTree, editTree } from "@/api/treesApi";
import { AppLayout } from "@/components/layout";
import { Badge, Button, ConfirmDialog } from "@/components/ui";
import { t } from "@/i18n";
import TreeMembers from "@/modules/trees/components/TreeMembers";
import { useTreeStore } from "@/stores/treeStore";

export default function TreeSettingsPage() {
  const navigate = useNavigate();
  const trees = useTreeStore((state) => state.trees);
  const selectedTreeId = useTreeStore((state) => state.selectedTreeId);
  const updateTree = useTreeStore((state) => state.updateTree);
  const removeTree = useTreeStore((state) => state.removeTree);
  const tree = trees.find((item) => item.id === selectedTreeId);
  const [treeName, setTreeName] = useState(tree?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [membersRefreshKey, setMembersRefreshKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    setTreeName(tree?.name ?? "");
  }, [tree]);

  if (!tree || tree.role !== "OWNER") {
    return (
      <AppLayout title={t("navigation.treeSettings")}>
        <main className="mx-auto max-w-4xl p-6 lg:p-8">
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <ShieldCheck size={28} className="text-primary" />
            <h1 className="mt-4 font-semibold">
              {t("settings.restrictedTitle")}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
              {tree ? t("settings.ownerOnly") : t("tree.empty")}
            </p>
          </div>
        </main>
      </AppLayout>
    );
  }

  async function handleSaveTreeName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tree) return;

    try {
      setIsSaving(true);
      setErrorMessage(undefined);
      updateTree(await editTree(tree.id, { name: treeName.trim() }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("settings.updateTreeError"),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tree || !memberEmail.trim()) return;

    try {
      setIsAddingMember(true);
      setErrorMessage(undefined);
      await addTreeMember(tree.id, {
        email: memberEmail.trim(),
        role: "VIEWER",
      });
      setMemberEmail("");
      setMembersRefreshKey((value) => value + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("settings.addMemberError"),
      );
    } finally {
      setIsAddingMember(false);
    }
  }

  async function handleDeleteTree() {
    if (!tree) return;

    try {
      setErrorMessage(undefined);
      await deleteTree(tree.id);
      removeTree(tree.id);
      setShowDelete(false);
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("settings.deleteTreeError"),
      );
    }
  }

  return (
    <AppLayout title={t("navigation.treeSettings")}>
      <main className="mx-auto max-w-5xl space-y-8 p-6 lg:p-8">
        <header className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="bg-gradient-to-br from-primary/15 via-surface to-secondary/40 px-6 py-8 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                <Trees size={22} />
              </span>
              <Badge>
                <Crown className="mr-1.5 text-amber-500" size={13} />
                {t("settings.roles.owner")}
              </Badge>
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              {tree.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              {t("settings.treeDescription")}
            </p>
          </div>
        </header>

        {errorMessage && (
          <p role="alert" className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
          <SectionHeader
            icon={<Settings2 size={20} />}
            title={t("settings.treeName")}
            description={t("settings.treeNameDescription")}
          />
          <form
            onSubmit={handleSaveTreeName}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              className={inputClassName}
              value={treeName}
              onChange={(event) => setTreeName(event.target.value)}
              aria-label={t("settings.treeName")}
            />
            <Button
              type="submit"
              className="shrink-0 rounded-xl px-5"
              disabled={
                isSaving || !treeName.trim() || treeName.trim() === tree.name
              }
            >
              {t("actions.save")}
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              icon={<MailPlus size={20} />}
              title={t("settings.members")}
              description={t("settings.membersDescription")}
            />
            <form
              onSubmit={handleAddMember}
              className="flex w-full gap-2 lg:max-w-md"
            >
              <input
                type="email"
                className={inputClassName}
                placeholder={t("settings.email")}
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
              />
              <Button
                type="submit"
                disabled={!memberEmail.trim() || isAddingMember}
                className="shrink-0 rounded-xl px-4"
              >
                {t("settings.addMember")}
              </Button>
            </form>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <TreeMembers treeId={tree.id} refreshKey={membersRefreshKey} />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-red-200 bg-surface shadow-sm">
          <div className="flex flex-col gap-5 bg-gradient-to-br from-red-50 via-surface to-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h2 className="font-semibold text-red-700">
                  {t("settings.dangerZone")}
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                  {t("settings.deleteTreeWarning")}
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              className="shrink-0 rounded-xl px-4"
              onClick={() => setShowDelete(true)}
            >
              {t("confirm.deleteTreeTitle")}
            </Button>
          </div>
        </section>
      </main>

      {showDelete && (
        <ConfirmDialog
          title={t("confirm.deleteTreeTitle")}
          message={`${t("confirm.deleteTreeMessage")}\n\n${t("confirm.deleteTypeToConfirm")}`}
          confirmationText={tree.name}
          confirmLabel={t("actions.delete")}
          onConfirm={handleDeleteTree}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </AppLayout>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        {icon}
      </span>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  );
}

const inputClassName =
  "h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
