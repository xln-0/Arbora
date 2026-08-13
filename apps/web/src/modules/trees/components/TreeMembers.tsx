import { useEffect, useState } from "react";

import type { TreeMember } from "@arbora/shared";

import {
  getTreeMembers,
  removeTreeMember,
  updateTreeMemberRole,
} from "@/api/treeMembersApi";
import { ChevronDown, Crown, LoaderCircle, Trash2, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui";
import { t } from "@/i18n";

interface Props {
  treeId: string;
  refreshKey: number;
}

export default function TreeMembers({ treeId, refreshKey }: Props) {
  const [members, setMembers] = useState<TreeMember[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        setIsLoading(true);
        setErrorMessage(undefined);
        const result = await getTreeMembers(treeId);

        setMembers(result);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("settings.loadMembersError"),
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMembers();
  }, [treeId, refreshKey]);

  async function handleRoleChange(memberId: string, role: "EDITOR" | "VIEWER") {
    try {
      const updatedMember = await updateTreeMemberRole(treeId, memberId, role);

      setMembers((current) =>
        current.map((member) =>
          member.id === memberId
            ? {
                ...member,
                role: updatedMember.role,
              }
            : member,
        ),
      );
    } catch (error) {
      console.error("Failed to update member role", error);
      setErrorMessage(
        error instanceof Error ? error.message : t("settings.updateMemberError"),
      );
    }
  }

  async function handleDeleteMember(memberId: string) {
    try {
      await removeTreeMember(treeId, memberId);

      setMembers((current) =>
        current.filter((member) => member.id !== memberId),
      );
    } catch (error) {
      console.error("Failed to remove member", error);
      setErrorMessage(
        error instanceof Error ? error.message : t("settings.removeMemberError"),
      );
    }
  }

  return (
    <div className="space-y-3">
      {errorMessage && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border px-5 py-8 text-sm text-muted">
          <LoaderCircle className="animate-spin" size={18} />
          {t("settings.loadingMembers")}
        </div>
      )}

      {!isLoading && members.length === 0 && !errorMessage && (
        <div className="rounded-2xl border border-dashed border-border px-5 py-8 text-center">
          <UserRound className="mx-auto text-muted" size={22} />
          <p className="mt-3 text-sm text-muted">{t("settings.noMembers")}</p>
        </div>
      )}

      {!isLoading && members.map((member) => {
        const email = member.user?.email ?? t("settings.unknownUser");

        return (
          <div
            key={member.id}
            className="flex flex-col gap-3 rounded-2xl border border-border p-3 transition hover:bg-surface-muted/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                name={email}
                className="h-10 w-10 shrink-0 bg-primary-soft text-sm text-primary"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{email}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  {member.role === "OWNER" && <Crown size={12} />}
                  {t(`settings.roles.${member.role.toLowerCase()}`)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
            {member.role === "OWNER" ? (
              <span className="flex h-9 items-center rounded-xl border border-amber-200 bg-amber-50 px-3 text-xs font-medium text-amber-700">
                <Crown className="mr-1.5" size={13} />
                {t("settings.roles.owner")}
              </span>
            ) : (
              <div className="relative">
                <select
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(
                      member.id,
                      e.target.value as "EDITOR" | "VIEWER",
                    )
                  }
                  className="h-9 appearance-none rounded-xl border border-border bg-surface px-3 pr-8 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value="VIEWER">{t("settings.roles.viewer")}</option>
                  <option value="EDITOR">{t("settings.roles.editor")}</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => handleDeleteMember(member.id)}
              disabled={member.role === "OWNER"}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
              title={t("settings.removeMember")}
            >
              <Trash2 size={16} />
            </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
