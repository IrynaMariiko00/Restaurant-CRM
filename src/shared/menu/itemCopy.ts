import type { MenuItem } from "@/types/menuItem";
import { pickLocalizedText, prefersUkrainian } from "./localeCopy";

export function getMenuItemCopy(
  item: MenuItem,
  language?: string | null,
) {
  const useUk = prefersUkrainian(language);

  return {
    name: pickLocalizedText(
      language,
      item.nameDefaultLanguage,
      item.nameSecondLanguage,
    ),
    description: pickLocalizedText(
      language,
      item.descriptionDefaultLanguage,
      item.descriptionSecondLanguage,
    ),
    ingredients: useUk
      ? item.ingredientsSecondLanguage?.length
        ? item.ingredientsSecondLanguage
        : (item.ingredientsDefaultLanguage ?? [])
      : item.ingredientsDefaultLanguage?.length
        ? item.ingredientsDefaultLanguage
        : (item.ingredientsSecondLanguage ?? []),
  };
}

export function formatMenuPrice(price: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(price);
}
