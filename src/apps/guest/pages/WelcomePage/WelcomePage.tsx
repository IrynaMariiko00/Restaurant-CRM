import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom";
import type { DiningTable } from "@/types/diningTable";

export const WelcomePage: React.FC = () => {
  const { t } = useTranslation();
  const { table } = useOutletContext<{ table: DiningTable }>();

  const settings = {
    restaurantName: "La Spezia",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3443/3443338.png",
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center bg-[var(--bg-primary)] px-6 py-10">
      <header className="mb-12 flex animate-in fade-in zoom-in flex-col items-center duration-700">
        <div className="relative mb-4 h-28 w-28">
          <div className="absolute inset-0 animate-pulse rounded-full border-2 border-[var(--color-violet-blue-light)] opacity-30" />
          <img
            src={settings.logoUrl}
            alt="Logo"
            className="h-full w-full rounded-full border-4 border-white object-contain shadow-lg"
          />
        </div>
        <span className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-text)]">
          {t("guest.table_welcome", { id: table.id })}
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--primary-text)]">
          {settings.restaurantName}
        </h1>
      </header>

      <nav className="flex w-full max-w-sm animate-in slide-in-from-bottom-10 flex-col gap-4 duration-1000">
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
            className="flex w-full items-center justify-between rounded-2xl border-2 border-[var(--border-color)] bg-white px-6 py-5 text-[var(--primary-text)] transition-all active:scale-[0.98]"
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

      <footer className="mt-auto pt-10 pb-4">
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
