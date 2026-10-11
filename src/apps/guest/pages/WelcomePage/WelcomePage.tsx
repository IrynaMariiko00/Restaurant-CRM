import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom";
import { useRestaurantProfile } from "@/hooks/useRestaurantProfile";
import type { DiningTable } from "@/types/diningTable";

export const WelcomePage: React.FC = () => {
  const { t } = useTranslation();
  const { table } = useOutletContext<{ table: DiningTable }>();
  const { name, logoUrl, backgroundUrl } = useRestaurantProfile();

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden bg-[var(--bg-primary)] px-6 py-10">
      {backgroundUrl && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--bg-primary),transparent_20%)_0%,var(--bg-primary)_55%,var(--bg-primary)_100%)]"
        aria-hidden
      />

      <header className="relative z-10 mb-12 flex animate-in fade-in zoom-in flex-col items-center duration-700">
        <div className="relative mb-4 h-28 w-28">
          <div className="absolute inset-0 animate-pulse rounded-full border-2 border-[var(--color-violet-blue-light)] opacity-30" />
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="h-full w-full rounded-full border-4 border-white bg-white object-contain shadow-lg"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-[var(--bg-light)] text-2xl font-bold text-[var(--color-violet-blue)] shadow-lg">
              {(name ?? "R").charAt(0)}
            </div>
          )}
        </div>
        <span className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-text)]">
          {t("guest.table_welcome", { id: table.id })}
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--primary-text)]">
          {name ?? t("guest.restaurant_fallback")}
        </h1>
      </header>

      <nav className="relative z-10 flex w-full max-w-sm animate-in slide-in-from-bottom-10 flex-col gap-4 duration-1000">
        <Link to="menu" className="w-full">
          <button
            type="button"
            className="group flex w-full items-center justify-between rounded-2xl bg-[var(--color-violet-blue)] px-6 py-5 text-white shadow-xl transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🍽️</span>
              <div className="text-left">
                <span className="block text-lg font-bold leading-none">
                  {t("guest.main_menu")}
                </span>
                <span className="text-xs font-normal opacity-80">
                  {t("guest.main_menu_desc")}
                </span>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Link>

        <Link to="/about" className="w-full">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-light)] px-6 py-5 text-[var(--primary-text)] transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🏛️</span>
              <div className="text-left">
                <span className="block text-lg font-bold leading-none">
                  {t("guest.about_us")}
                </span>
                <span className="text-xs font-normal text-[var(--secondary-text)]">
                  {t("guest.about_us_desc")}
                </span>
              </div>
            </div>
          </button>
        </Link>
      </nav>

      <footer className="relative z-10 mt-auto pt-10 pb-4">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-light)] px-6 py-3 text-sm font-bold text-[var(--color-violet-blue)] transition-colors active:bg-[var(--icon-color)]"
        >
          <span>🛎️</span> {t("guest.call_waiter")}
        </button>
      </footer>
    </div>
  );
};
