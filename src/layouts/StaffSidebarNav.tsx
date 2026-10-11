import {
  CalendarDays,
  Home,
  LogOut,
  SquareStack,
  Store,
  UserCircle,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

type NavItem = {
  to?: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};

type StaffSidebarNavProps = {
  onNavigate?: () => void;
};

export function StaffSidebarNav({ onNavigate }: StaffSidebarNavProps) {
  const { t } = useTranslation();
  const { isAdmin, logout } = useAuth();

  const items: NavItem[] = isAdmin
    ? [
        {
          to: "/staff/users",
          label: t("admin.users_title"),
          icon: Users,
        },
        {
          to: "/staff/menu",
          label: t("admin.menu_title"),
          icon: UtensilsCrossed,
        },
        {
          to: "/staff/tables",
          label: t("admin.tables_title"),
          icon: SquareStack,
        },
        {
          to: "/staff/restaurant",
          label: t("admin.restaurant_title"),
          icon: Store,
        },
        {
          label: t("admin.schedule_title"),
          icon: CalendarDays,
          disabled: true,
        },
        {
          to: "/staff/profile",
          label: t("staff.profile_title"),
          icon: UserCircle,
        },
      ]
    : [
        {
          to: "/staff/menu",
          label: t("admin.menu_title"),
          icon: UtensilsCrossed,
        },
        {
          to: "/staff/profile",
          label: t("staff.profile_title"),
          icon: UserCircle,
        },
      ];

  return (
    <nav className="staff-shell__nav" aria-label={t("staff.nav_label")}>
      <NavLink
        to="/staff"
        end
        className={({ isActive }) =>
          `staff-shell__link${isActive ? " staff-shell__link--active" : ""}`
        }
        onClick={onNavigate}
      >
        <Home className="staff-shell__link-icon" aria-hidden />
        <span>{t("staff.nav_home")}</span>
      </NavLink>

      {items.map((item) => {
        const Icon = item.icon;
        if (item.disabled || !item.to) {
          return (
            <span
              key={item.label}
              className="staff-shell__link staff-shell__link--disabled"
              aria-disabled="true"
            >
              <Icon className="staff-shell__link-icon" aria-hidden />
              <span>
                {item.label}
                <em>{t("admin.coming_soon_short")}</em>
              </span>
            </span>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `staff-shell__link${isActive ? " staff-shell__link--active" : ""}`
            }
            onClick={onNavigate}
          >
            <Icon className="staff-shell__link-icon" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <button
        type="button"
        className="staff-shell__link staff-shell__link--logout"
        onClick={() => {
          onNavigate?.();
          void logout();
        }}
      >
        <LogOut className="staff-shell__link-icon" aria-hidden />
        <span>{t("common.logout")}</span>
      </button>
    </nav>
  );
}
