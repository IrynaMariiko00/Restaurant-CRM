import type { MenuItem } from "@/types/menuItem";

export function getMenuItemCopy(item: MenuItem) {
  return {
    name: item.nameDefaultLanguage?.trim() || "",
    description: item.descriptionDefaultLanguage?.trim() || "",
    ingredients: item.ingredientsDefaultLanguage ?? [],
  };
}

export function formatMenuPrice(price: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(price);
}
