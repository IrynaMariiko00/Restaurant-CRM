import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const WelcomePage: React.FC = () => {
  const { t } = useTranslation();

  // Ці дані (лого та назва) зазвичай приходять з БД,
  // тому вони залишаються в об'єкті, але описи беремо з перекладів
  const settings = {
    restaurantName: "La Spezia",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3443/3443338.png",
  };

  return (
    <div className="flex flex-col items-center min-h-[100dvh] bg-[var(--bg-primary)] px-6 py-10">
      {/* 1. Header: Logo & Welcome Text */}
      <header className="flex flex-col items-center mb-12 animate-in fade-in zoom-in duration-700">
        <div className="relative w-28 h-28 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-violet-blue-light)] animate-pulse opacity-30"></div>
          <img
            src={settings.logoUrl}
            alt="Logo"
            className="w-full h-full object-contain rounded-full border-4 border-white shadow-lg"
          />
        </div>
        <span className="text-[var(--accent-text)] text-xs uppercase tracking-[0.2em] font-bold mb-2">
          {t("common.welcome")}
        </span>
        <h1 className="text-3xl font-extrabold text-[var(--primary-text)] tracking-tight">
          {settings.restaurantName}
        </h1>
      </header>

      {/* 2. Navigation Buttons */}
      <nav className="flex flex-col w-full gap-4 max-w-sm animate-in slide-in-from-bottom-10 duration-1000">
        {/* Головна кнопка - Меню */}
        <Link to="/menu" className="w-full">
          <button className="w-full py-5 px-6 rounded-2xl bg-[var(--color-violet-blue)] text-white shadow-xl flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🍽️</span>
              <div className="text-left">
                <span className="block font-bold text-lg leading-none">
                  {t("guest.main_menu")}
                </span>
                <span className="text-xs opacity-80 font-normal">
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

        {/* Напої */}
        <Link to="/drinks" className="w-full">
          <button className="w-full py-5 px-6 rounded-2xl bg-white border-2 border-[var(--border-color)] text-[var(--primary-text)] flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🍷</span>
              <div className="text-left">
                <span className="block font-bold text-lg leading-none">
                  {t("guest.drinks")}
                </span>
                <span className="text-xs text-[var(--secondary-text)] font-normal">
                  {t("guest.drinks_desc")}
                </span>
              </div>
            </div>
          </button>
        </Link>

        {/* Про заклад */}
        <Link to="/about" className="w-full">
          <button className="w-full py-5 px-6 rounded-2xl bg-white border-2 border-[var(--border-color)] text-[var(--primary-text)] flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🏛️</span>
              <div className="text-left">
                <span className="block font-bold text-lg leading-none">
                  {t("guest.about_us")}
                </span>
                <span className="text-xs text-[var(--secondary-text)] font-normal">
                  {t("guest.about_us_desc")}
                </span>
              </div>
            </div>
          </button>
        </Link>
      </nav>

      {/* 3. Footer / Help */}
      <footer className="mt-auto pt-10 pb-4">
        <button className="text-[var(--color-violet-blue)] font-bold text-sm flex items-center gap-2 py-3 px-6 rounded-full bg-[var(--bg-light)] border border-[var(--border-color)] active:bg-[var(--icon-color)] transition-colors">
          <span>🛎️</span> {t("guest.call_waiter")}
        </button>
      </footer>
    </div>
  );
};
