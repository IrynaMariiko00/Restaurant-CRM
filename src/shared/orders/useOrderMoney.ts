import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRestaurantProfile } from "@/hooks/useRestaurantProfile";
import { formatMenuPrice } from "@/shared/menu/itemCopy";

export function useOrderMoney() {
  const { i18n } = useTranslation();
  const { restaurant } = useRestaurantProfile();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const fallbackCurrency = restaurant?.currency;

  return useCallback(
    (amount: number, currency?: string | null) =>
      formatMenuPrice(amount, language, currency ?? fallbackCurrency),
    [language, fallbackCurrency],
  );
}
