import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AccentButton } from "@/ui/AccentButton";
import { useAuth } from "@/context/AuthContext";

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const { isAdmin } = await login(email, password);
      const defaultPath = isAdmin ? "/staff/admin" : "/staff";
      navigate(from ?? defaultPath, { replace: true });
    } catch {
      setError(t("staff.login_error"));
    }
  };

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)] p-6">
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[var(--color-violet-blue)] opacity-[0.07] blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[var(--color-violet-blue-dark)] opacity-[0.05] blur-3xl" />

      <div className="z-10 w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="title title--s title--accent mb-2 uppercase tracking-widest">
            Restaurant CRM
          </p>
          <h1 className="title title--m title--primary">{t("staff.login")}</h1>
          <p className="mt-2 text-sm text-[var(--secondary-text)]">
            {t("staff.login_subtitle")}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-light)] p-6 shadow-sm"
        >
          <div className="form-field">
            <label className="form-label" htmlFor="email">
              {t("staff.email")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-input"
              placeholder="name@restaurant.com"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="password">
              {t("staff.password")}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-[var(--error-color)]">{error}</p>
          )}

          <AccentButton type="submit" disabled={isLoading} className="w-full">
            {isLoading ? t("staff.logging_in") : t("staff.login")}
          </AccentButton>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--secondary-text)] opacity-70">
          {t("staff.guest_hint")}{" "}
          <Link
            to="/"
            className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
          >
            {t("staff.guest_link")}
          </Link>
        </p>
      </div>
    </main>
  );
};
