import { useEffect, useState } from "react";

import type { TreeMember } from "@arbora/shared";

import {
  getTreeMembers,
  removeTreeMember,
  updateTreeMemberRole,
} from "@/api/treeMembersApi";
import { ChevronDown, Trash2 } from "lucide-react";
import { t } from "@/i18n";

interface Props {
  treeId: string;
  refreshKey: number;
}

export default function TreeMembers({ treeId, refreshKey }: Props) {
  const [members, setMembers] = useState<TreeMember[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    async function loadMembers() {
      try {
        setErrorMessage(undefined);
        const result = await getTreeMembers(treeId);

        setMembers(result);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load members",
        );
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
        error instanceof Error ? error.message : "Failed to update member",
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
        error instanceof Error ? error.message : "Failed to remove member",
      );
    }
  }

  return (
    <div
      className="
        space-y-3
      "
    >
      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      {members.map((member) => (
        <div
          key={member.id}
          className="
            flex
            items-center
            justify-between

            rounded-lg

            border
            border-border

            p-3
          "
        >
          <div>
            <p className="text-sm font-medium">
              {member.user?.email ?? t("settings.unknownUser")}
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {member.role === "OWNER" ? (
              <span
                className="
                  h-8
                  flex
                  items-center
                  rounded-lg
                  border
                  border-border
                  px-3
                  text-sm
                  text-muted
                  bg-surface
                  opacity-60
                "
              >
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
                  className="
                    h-8
                    rounded-lg
                    border
                    border-border
                    px-3
                    pr-8
                    text-sm
                    appearance-none
                  "
                >
                  <option value="VIEWER">{t("settings.roles.viewer")}</option>
                  <option value="EDITOR">{t("settings.roles.editor")}</option>
                </select>
                <ChevronDown
                  size={14}
                  className="
                  pointer-events-none
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  text-muted
                "
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => handleDeleteMember(member.id)}
              disabled={member.role === "OWNER"}
              className="
                p-2
                rounded-lg
                text-muted
                hover:text-red-600
                hover:bg-red-50
                disabled:opacity-50
              "
              title={t("settings.removeMember")}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
