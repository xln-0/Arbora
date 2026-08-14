import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import { t } from "@/i18n";

interface AuthPageShellProps {
  eyebrow: ReactNode;
  title: string;
  description: string;
  footer: string;
  children: ReactNode;
}

export default function AuthPageShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-muted p-3 sm:px-8 sm:py-8">
      <span className="pointer-events-none absolute -left-20 top-12 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <span className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-amber-200/25 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/80 bg-surface shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:min-h-[calc(100vh-4rem)] sm:rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-between bg-gradient-to-br from-primary-hover via-primary to-teal-500 p-6 text-white sm:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-sm ring-1 ring-white/25 backdrop-blur">
                <img
                  src="/brand/arbora-mark.png"
                  alt=""
                  className="h-8 w-8 brightness-0 invert"
                />
              </span>
              <div>
                <p className="text-xl font-bold tracking-tight">
                  {t("app.name")}
                </p>
                <p className="text-xs font-medium text-white/70">
                  {t("app.tagline")}
                </p>
              </div>
            </div>

            <div className="mt-8 max-w-md sm:mt-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                {eyebrow}
              </span>
              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:mt-6 sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 text-base leading-7 text-white/80">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-white/80 sm:mt-12">
            <ShieldCheck size={19} />
            {footer}
          </div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-12">
          {children}
        </section>
      </div>
    </main>
  );
}
