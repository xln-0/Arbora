import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span
      className="
        inline-flex
        items-center

        rounded-full

        border
        border-border

        bg-surface

        px-2.5
        py-1

        text-xs
        font-medium

        text-muted
      "
    >
      {children}
    </span>
  );
}
