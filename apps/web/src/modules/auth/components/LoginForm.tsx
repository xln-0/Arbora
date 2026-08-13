import { useState } from "react";
import { ArrowRight, LogIn } from "lucide-react";

import { ApiError } from "@/api/client";
import Button from "@/components/ui/Button";
import { t } from "@/i18n";
import { useAuth } from "@/modules/auth/useAuth";

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm outline-none transition placeholder:text-muted/60 focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError && caughtError.status === 401
          ? t("auth.invalidCredentials")
          : t("auth.loginError"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <LogIn size={22} />
      </span>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">
        {t("auth.loginTitle")}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        {t("auth.loginDescription")}
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
          {t("auth.password")}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className={inputClassName}
            required
          />
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="mt-7 h-11 w-full rounded-xl"
      >
        {submitting ? t("auth.loggingIn") : t("auth.login")}
        {!submitting && <ArrowRight size={17} />}
      </Button>

      <p className="mt-5 text-center text-xs leading-5 text-muted">
        {t("auth.noSignup")}
      </p>
    </form>
  );
}
