import {
  CalendarDays,
  KeyRound,
  Loader2,
  LogOut,
  SquareStack,
  Store,
  UserCircle,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminNavButton } from "@/apps/admin/components/AdminNavButton";
import { useAuth } from "@/context/AuthContext";
import { useWelcome } from "./hooks/useWelcome";

export const WelcomePage = () => {
  const { t } = useTranslation();
  const { logout, isAdmin } = useAuth();
  const { name, isLoading } = useWelcome();

  const greeting = name
    ? t(
        isAdmin ? "staff.welcome_admin_named" : "staff.welcome_waiter",
        { firstName: name.firstName, lastName: name.lastName },
      )
    : t(
        isAdmin ? "staff.welcome_admin" : "staff.welcome_waiter_fallback",
      );

  const subtitle = isAdmin
    ? t("admin.dashboard_subtitle")
    : t("staff.welcome_waiter_desc");

  const menuNav = (
    <AdminNavButton
      to="/staff/menu"
      label={t("admin.menu_title")}
      description={t("menu.nav_desc")}
      icon={UtensilsCrossed}
      accent={!isAdmin}
    />
  );

  return (
    <div className="staff-page">
      <header className="staff-page__header staff-hub__header">
        <p className="staff-page__eyebrow">Restaurant CRM</p>
        <h1 className="staff-page__title flex min-h-[2.5rem] items-center">
          {isLoading ? (
            <Loader2
              className="h-8 w-8 animate-spin text-[var(--color-violet-blue)]"
              aria-label={t("common.waiting")}
            />
          ) : (
            greeting
          )}
        </h1>
        <p className="staff-page__subtitle">{subtitle}</p>
      </header>

      <p className="staff-hub__desktop-note">{t("staff.hub_desktop_hint")}</p>

      <div className="staff-hub__nav">
        {isAdmin && (
          <div className="space-y-2">
            <AdminNavButton
              to="/staff/users"
              label={t("admin.users_title")}
              description={t("admin.users_desc")}
              icon={Users}
              accent
            />
            {menuNav}
            <AdminNavButton
              to="/staff/tables"
              label={t("admin.tables_title")}
              description={t("admin.tables_desc")}
              icon={SquareStack}
            />
            <AdminNavButton
              label={t("admin.restaurant_title")}
              description={t("admin.coming_soon_short")}
              icon={Store}
              disabled
            />
            <AdminNavButton
              label={t("admin.schedule_title")}
              description={t("admin.coming_soon_short")}
              icon={CalendarDays}
              disabled
            />
          </div>
        )}

        <div
          className={`space-y-2 ${isAdmin ? "mt-6 border-t border-[var(--border-color)] pt-6" : ""}`}
        >
          {!isAdmin && menuNav}
          <AdminNavButton
            to="/staff/profile"
            label={t("staff.profile_title")}
            description={t("admin.profile_desc")}
            icon={UserCircle}
          />
          <AdminNavButton
            to="/staff/change-password"
            label={t("admin.change_password_title")}
            description={t("admin.change_password_desc")}
            icon={KeyRound}
          />
        </div>

        <button
          type="button"
          onClick={() => void logout()}
          className="btn-ghost mt-6 flex w-full items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          {t("common.logout")}
        </button>
      </div>
    </div>
  );
};
