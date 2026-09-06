import {
  AlertTriangle,
  EyeOff,
  Leaf,
  Sprout,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";

export type MenuFlagSource = {
  isAvailable?: boolean;
  isAllergenic?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
};

type FlagTone = "muted" | "warn" | "vegetarian" | "vegan";

type FlagChip = {
  key: string;
  label: string;
  icon: LucideIcon;
  tone: FlagTone;
};

export function buildMenuFlagChips(
  item: MenuFlagSource,
  t: (key: string) => string,
): FlagChip[] {
  return [
    item.isAvailable === false
      ? {
          key: "unavailable",
          label: t("menu.unavailable"),
          icon: EyeOff,
          tone: "muted" as const,
        }
      : null,
    item.isAllergenic
      ? {
          key: "allergenic",
          label: t("menu.allergenic"),
          icon: AlertTriangle,
          tone: "warn" as const,
        }
      : null,
    item.isVegetarian
      ? {
          key: "vegetarian",
          label: t("menu.vegetarian"),
          icon: Leaf,
          tone: "vegetarian" as const,
        }
      : null,
    item.isVegan
      ? {
          key: "vegan",
          label: t("menu.vegan"),
          icon: Sprout,
          tone: "vegan" as const,
        }
      : null,
  ].filter((chip): chip is FlagChip => chip !== null);
}

export const MenuDishFlags = ({ item }: { item: MenuFlagSource }) => {
  const { t } = useTranslation();
  const chips = buildMenuFlagChips(item, t);

  if (chips.length === 0) return null;

  return (
    <ul className="menu-dish-flags">
      {chips.map(({ key, label, icon: Icon, tone }) => (
        <li key={key} className={`menu-dish-flag menu-dish-flag--${tone}`}>
          <Icon className="menu-dish-flag__icon" aria-hidden strokeWidth={2} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
};
