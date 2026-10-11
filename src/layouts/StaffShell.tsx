import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRestaurantProfile } from "@/hooks/useRestaurantProfile";
import { StaffSidebarNav } from "./StaffSidebarNav";

function StaffBrand() {
  const { t } = useTranslation();
  const { name, logoUrl } = useRestaurantProfile();

  return (
    <div className="staff-shell__brand">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="staff-shell__brand-logo"
        />
      ) : null}
      <div className="staff-shell__brand-copy">
        <p className="staff-shell__brand-eyebrow">
          {name ?? "Restaurant CRM"}
        </p>
        <p className="staff-shell__brand-title">{t("staff.nav_workspace")}</p>
      </div>
    </div>
  );
}

export function StaffShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const { name } = useRestaurantProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <div className="staff-shell">
      <aside className="staff-shell__aside staff-shell__aside--desktop">
        <StaffBrand />
        <StaffSidebarNav />
      </aside>

      <div className="staff-shell__mobile-bar">
        <button
          type="button"
          className="staff-shell__menu-btn"
          aria-expanded={mobileOpen}
          aria-controls="staff-mobile-drawer"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden />
          <span>{t("staff.nav_menu")}</span>
        </button>
        <p className="staff-shell__mobile-brand">
          {name ?? "Restaurant CRM"}
        </p>
      </div>

      {mobileOpen && (
        <div className="staff-shell__drawer" id="staff-mobile-drawer">
          <button
            type="button"
            className="staff-shell__backdrop"
            aria-label={t("common.cancel")}
            onClick={() => setMobileOpen(false)}
          />
          <aside className="staff-shell__aside staff-shell__aside--mobile">
            <div className="staff-shell__drawer-head">
              <StaffBrand />
              <button
                type="button"
                className="staff-shell__close"
                aria-label={t("common.cancel")}
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <StaffSidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="staff-shell__main">
        <Outlet />
      </div>
    </div>
  );
}
