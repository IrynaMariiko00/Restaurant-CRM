import { AlertTriangle, Leaf, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MenuItemFormValues } from "../hooks/menuItemForm";

type MenuItemFlagTogglesProps = {
  form: MenuItemFormValues;
  setField: <K extends keyof MenuItemFormValues>(
    key: K,
    value: MenuItemFormValues[K],
  ) => void;
};

const FLAGS = [
  ["isAllergenic", "menu.allergenic", "warn", AlertTriangle],
  ["isVegetarian", "menu.vegetarian", "vegetarian", Leaf],
  ["isVegan", "menu.vegan", "vegan", Sprout],
] as const;

export function MenuItemFlagToggles({
  form,
  setField,
}: MenuItemFlagTogglesProps) {
  const { t } = useTranslation();

  return (
    <div
      className="menu-studio__flags"
      role="group"
      aria-label={t("menu.create_flags")}
    >
      {FLAGS.map(([key, labelKey, tone, Icon]) => {
        const on = form[key];
        return (
          <button
            key={key}
            type="button"
            className={`menu-dish-flag menu-dish-flag--toggle ${
              on ? `menu-dish-flag--${tone}` : "menu-dish-flag--idle"
            }`}
            aria-pressed={on}
            onClick={() => setField(key, !on)}
          >
            <Icon
              className="menu-dish-flag__icon"
              aria-hidden
              strokeWidth={2}
            />
            <span>{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
