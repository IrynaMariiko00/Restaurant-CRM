import {
  AlertTriangle,
  EyeOff,
  Leaf,
  Sprout,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "@/types/menuItem";
import type { LucideIcon } from "lucide-react";

type FlagTone = "muted" | "warn" | "ok";

type FlagChip = {
  key: string;
  label: string;
  icon: LucideIcon;
  tone: FlagTone;
};

export const MenuDishFlags = ({ item }: { item: MenuItem }) => {
  const { t } = useTranslation();

  const chips: FlagChip[] = [
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
          tone: "ok" as const,
        }
      : null,
    item.isVegan
      ? {
          key: "vegan",
          label: t("menu.vegan"),
          icon: Sprout,
          tone: "ok" as const,
        }
      : null,
  ].filter((chip): chip is FlagChip => chip !== null);

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
