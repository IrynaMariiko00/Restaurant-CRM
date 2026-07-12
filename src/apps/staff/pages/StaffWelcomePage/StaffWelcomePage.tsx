import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { AccentButton } from "@/ui/AccentButton";
import { useAuth } from "@/context/AuthContext";
import { useStaffWelcome } from "./hooks/useStaffWelcome";

export const StaffWelcomePage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { name, isLoading } = useStaffWelcome();

  const greeting = name
    ? t("staff.welcome_waiter", {
        firstName: name.firstName,
        lastName: name.lastName,
      })
    : t("staff.welcome_waiter_fallback");

  return (
    <main className="mx-auto flex min-h-svh max-w-[430px] flex-col items-center justify-center bg-[var(--bg-primary)] p-6 text-center">
      <p className="title title--s title--accent mb-2 uppercase tracking-widest">
        Restaurant CRM
      </p>

      <h1 className="title title--l title--primary flex min-h-[2.5rem] items-center justify-center">
        {isLoading ? (
          <Loader2
            className="h-8 w-8 animate-spin text-[var(--color-violet-blue)]"
            aria-label={t("common.waiting")}
          />
        ) : (
          greeting
        )}
      </h1>

      <p className="mt-3 text-sm text-[var(--secondary-text)]">
        {t("staff.welcome_waiter_desc")}
      </p>

      <div className="mt-10 flex w-full max-w-xs flex-col items-center gap-2">
        <AccentButton
          type="button"
          onClick={() => navigate("/staff/profile")}
          className="w-full"
        >
          {t("staff.profile_title")}
        </AccentButton>

        <button
          type="button"
          onClick={() => void logout()}
          className="btn-ghost w-full"
        >
          {t("common.logout")}
        </button>
      </div>
    </main>
  );
};
