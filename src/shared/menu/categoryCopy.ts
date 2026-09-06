import type { MenuCategory } from "@/types/menuCategory";
import { pickLocalizedText } from "./localeCopy";

export function getCategoryLabel(
  category: Pick<
    MenuCategory,
    "nameDefaultLanguage" | "nameSecondLanguage"
  >,
  language?: string | null,
) {
  return pickLocalizedText(
    language,
    category.nameDefaultLanguage,
    category.nameSecondLanguage,
  );
}
