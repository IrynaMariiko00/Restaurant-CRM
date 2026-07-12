import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className={`theme-toggle${isDark ? " theme-toggle--dark" : ""} ${className}`.trim()}
      aria-label={isDark ? t("common.theme_light") : t("common.theme_dark")}
      title={isDark ? t("common.theme_light") : t("common.theme_dark")}
    >
      <span className="theme-toggle__track" aria-hidden>
        <span className="theme-toggle__glow" />
      </span>

      <span className="theme-toggle__knob">
        <span className="theme-toggle__icon theme-toggle__icon--sun">
          <Sun strokeWidth={2.25} />
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon">
          <Moon strokeWidth={2.25} />
        </span>
      </span>
    </button>
  );
};
