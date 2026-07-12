import { useTranslation } from "react-i18next";
import { AccentButton } from "@/ui/AccentButton";
import { useAuth } from "@/context/AuthContext";

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <main className="mx-auto flex min-h-svh max-w-[430px] flex-col items-center justify-center bg-[var(--bg-primary)] p-6 text-center">
      <p className="title title--s title--accent mb-2 uppercase tracking-widest">
        Restaurant CRM
      </p>
      <h1 className="title title--l title--primary">
        {t("staff.welcome_admin")}
      </h1>
      <p className="mt-3 text-sm text-[var(--secondary-text)]">
        {t("staff.welcome_admin_desc")}
      </p>

      <AccentButton
        onClick={() => void logout()}
        className="mt-10 w-full max-w-xs"
      >
        {t("common.logout")}
      </AccentButton>
    </main>
  );
};
