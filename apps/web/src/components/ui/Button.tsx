import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-primary
    text-white
    hover:bg-primary-hover
  `,

  secondary: `
    bg-secondary
    text-secondary-foreground
    hover:bg-secondary-hover
  `,

  ghost: `
    text-foreground
    hover:bg-surface-muted
  `,

  danger: `
    bg-red-600
    text-white
    hover:bg-red-700
  `,
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        gap-2

        h-11
        sm:h-10
        px-3

        rounded-lg

        text-sm
        font-medium

        transition-colors

        disabled:opacity-50
        disabled:cursor-not-allowed

        ${variants[variant]}

        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
