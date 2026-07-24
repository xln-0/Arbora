import { t } from "@/i18n";
import { Network, Settings } from "lucide-react";

import { NavLink } from "react-router-dom";

const items = [
  {
    key: "tree",
    icon: Network,
    to: "/",
  },
  // {
  //   label: "Liste des éléments",
  //   icon: Users,
  //   to: "/people",
  // },
  {
    key: "settings",
    icon: Settings,
    to: "/settings",
  },
];

export function SidebarNavigation() {
  return (
    <nav
      className="
        mt-8
        flex
        flex-col
        gap-2
      "
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3

                rounded-lg

                px-3
                py-2

                text-sm

                transition

                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface-muted"
                }
                `
            }
          >
            <Icon size={18} />

            {t(`navigation.${item.key}`)}
          </NavLink>
        );
      })}
    </nav>
  );
}
