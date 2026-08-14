import { useState } from "react";
import { Check, LockKeyhole, Sparkles } from "lucide-react";

import { ApiError } from "@/api/client";
import Button from "@/components/ui/Button";
import { t } from "@/i18n";
import { useAuth } from "@/modules/auth/useAuth";
import AuthPageShell from "@/modules/auth/components/AuthPageShell";

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm outline-none transition placeholder:text-muted/60 focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

export default function SetupPage() {
  const { setupAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirmation) {
      setError(t("setup.passwordMismatch"));
      return;
    }

    setSubmitting(true);

    try {
      await setupAdmin(email, password);
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        if (caughtError.code === "INVALID_EMAIL") {
          setError(t("setup.invalidEmail"));
        } else if (caughtError.code === "PASSWORD_TOO_SHORT") {
          setError(t("setup.passwordHint"));
        } else {
          setError(caughtError.message);
        }
      } else {
        setError(t("setup.genericError"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow={
        <>
          <Sparkles size={14} />
          {t("setup.firstLaunch")}
        </>
      }
      title={t("setup.heroTitle")}
      description={t("setup.heroDescription")}
      footer={t("setup.localSecurity")}
    >
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <LockKeyhole size={22} />
            </span>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              {t("setup.formTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t("setup.formDescription")}
            </p>

            <div className="mt-8 space-y-5">
              <label className="block text-sm font-medium">
                {t("administration.email")}
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className={inputClassName}
                  required
                />
              </label>

              <label className="block text-sm font-medium">
                {t("administration.password")}
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={12}
                  className={inputClassName}
                  required
                />
                <span className="mt-2 block text-xs font-normal text-muted">
                  {t("setup.passwordHint")}
                </span>
              </label>

              <label className="block text-sm font-medium">
                {t("setup.confirmPassword")}
                <input
                  type="password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  autoComplete="new-password"
                  minLength={12}
                  className={inputClassName}
                  required
                />
              </label>
            </div>

            {error && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-7 h-11 w-full rounded-xl"
            >
              <Check size={17} />
              {submitting ? t("setup.creating") : t("setup.createAdmin")}
            </Button>
          </form>
    </AuthPageShell>
  );
}
