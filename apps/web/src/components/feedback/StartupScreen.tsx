import { LoaderCircle, RefreshCw, ServerOff } from "lucide-react";

import Button from "@/components/ui/Button";
import { t } from "@/i18n";

interface StartupScreenProps {
  unavailable?: boolean;
  scope?: "server" | "trees";
  onRetry?: () => void;
}

export default function StartupScreen({
  unavailable = false,
  scope = "server",
  onRetry,
}: StartupScreenProps) {
  const key = unavailable ? "unavailable" : "loading";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-muted px-6">
      <span className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <span className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-amber-200/25 blur-3xl" />

      <section className="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-surface p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-soft to-surface text-primary shadow-sm ring-1 ring-primary/15">
          {unavailable ? (
            <ServerOff size={27} />
          ) : (
            <LoaderCircle className="animate-spin" size={27} />
          )}
        </span>

        <img
          src="/brand/arbora-mark.png"
          alt=""
          className="mx-auto mt-7 h-8 w-8 object-contain"
        />
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {t("app.name")}
        </p>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          {t(`startup.${scope}.${key}Title`)}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          {t(`startup.${scope}.${key}Description`)}
        </p>

        {unavailable && onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            className="mt-7 h-11 rounded-xl px-5"
          >
            <RefreshCw size={16} />
            {t("startup.retry")}
          </Button>
        )}

        {unavailable && (
          <p className="mt-4 text-xs text-muted">
            {t("startup.automaticRetry")}
          </p>
        )}
      </section>
    </main>
  );
}
