import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-surface

        border
        border-border

        rounded-card

        shadow-sm

        p-6

        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
