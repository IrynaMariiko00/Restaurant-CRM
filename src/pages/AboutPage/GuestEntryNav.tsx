import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const GuestEntryNav = () => {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("about.nav_label")} className="guest-entry-nav mt-10">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `guest-entry-nav__link${isActive ? " guest-entry-nav__link--active" : ""}`
        }
      >
        {t("about.nav_scan")}
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `guest-entry-nav__link${isActive ? " guest-entry-nav__link--active" : ""}`
        }
      >
        {t("about.nav_about")}
      </NavLink>
    </nav>
  );
};
