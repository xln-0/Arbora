import { useEffect, useState } from "react";
import type { AppRole, AppUser } from "@arbora/shared";
import { Crown, Mail, ShieldCheck, UserPlus, UsersRound } from "lucide-react";

import { createAppUser, getAppUsers } from "@/api/adminApi";
import { ApiError } from "@/api/client";
import { AppLayout } from "@/components/layout";
import Button from "@/components/ui/Button";
import { t } from "@/i18n";

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

export default function AdministrationPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>("USER");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAppUsers()
      .then(({ users: loadedUsers }) => setUsers(loadedUsers))
      .catch(() => setError(t("administration.loadError")))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { user } = await createAppUser({ email, password, role });
      setUsers((current) => [...current, user]);
      setEmail("");
      setPassword("");
      setRole("USER");
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 409) {
        setError(t("administration.emailExists"));
      } else if (
        caughtError instanceof ApiError &&
        caughtError.code === "PASSWORD_TOO_SHORT"
      ) {
        setError(t("administration.passwordHint"));
      } else {
        setError(t("administration.createError"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppLayout title={t("navigation.administration")}>
      <main className="mx-auto max-w-6xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
        <header className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="bg-gradient-to-br from-primary/15 via-surface to-amber-100/55 px-6 py-8 sm:px-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <ShieldCheck size={22} />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              {t("administration.title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              {t("administration.description")}
            </p>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <UsersRound size={20} />
                </span>
                <div>
                  <h2 className="font-semibold">{t("administration.users")}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {t("administration.userCount", {
                      count: String(users.length),
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {loading && (
                <p className="py-8 text-center text-sm text-muted">
                  {t("administration.loading")}
                </p>
              )}

              {!loading &&
                users.map((user) => (
                  <article
                    key={user.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-muted/45 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-border">
                        <Mail size={17} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.email}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {new Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                          }).format(new Date(user.createdAt))}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-primary-soft text-primary"
                      }`}
                    >
                      {user.role === "ADMIN" && <Crown size={13} />}
                      {t(`administration.roles.${user.role}`)}
                    </span>
                  </article>
                ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <UserPlus size={20} />
              </span>
              <div>
                <h2 className="font-semibold">
                  {t("administration.createUser")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {t("administration.createDescription")}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block text-sm font-medium">
                {t("administration.email")}
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="off"
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
                  {t("administration.passwordHint")}
                </span>
              </label>

              <label className="block text-sm font-medium">
                {t("administration.role")}
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as AppRole)}
                  className={inputClassName}
                >
                  <option value="USER">
                    {t("administration.roles.USER")}
                  </option>
                  <option value="ADMIN">
                    {t("administration.roles.ADMIN")}
                  </option>
                </select>
              </label>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="h-11 w-full rounded-xl"
              >
                <UserPlus size={17} />
                {submitting
                  ? t("administration.creating")
                  : t("administration.create")}
              </Button>
            </form>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}
