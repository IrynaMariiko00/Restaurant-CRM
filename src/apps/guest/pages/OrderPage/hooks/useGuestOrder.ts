import { ordersApi } from "@/api/orders";
import { useFeedback } from "@/context/useFeedback";
import type { GuestCurrentOrder, UpdateOrderItemRequest } from "@/types/order";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const REFRESH_INTERVAL_MS = 15000;

export function useGuestOrder() {
  const { t } = useTranslation();
  const feedback = useFeedback();
  const [current, setCurrent] = useState<GuestCurrentOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async (silent: boolean) => {
      if (!silent) {
        setIsLoading(true);
        setLoadError(null);
        setIsEmpty(false);
      }

      try {
        const response = await ordersApi.getGuestCurrentOrder();
        if (cancelled) return;

        if (!response.success || !response.data) {
          if (!silent) {
            setCurrent(null);
            setIsEmpty(response.errors == null);
            setLoadError(
              response.errors?.[0] ?? null,
            );
          }
          return;
        }

        setCurrent(response.data);
        setLoadError(null);
        setIsEmpty(false);
      } catch {
        if (!cancelled && !silent) {
          setCurrent(null);
          setLoadError(t("orders.guest_load_error"));
        }
      } finally {
        if (!cancelled && !silent) setIsLoading(false);
      }
    };

    void load(false);
    const timer = window.setInterval(
      () => void load(true),
      REFRESH_INTERVAL_MS,
    );

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [reloadKey, t]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const updateItem = useCallback(
    async (itemId: number, data: UpdateOrderItemRequest) => {
      setBusyItemId(itemId);
      try {
        const response = await ordersApi.updateGuestOrderItem(itemId, data);
        if (!response.success || !response.data) {
          feedback.error(response.errors?.[0] ?? t("orders.item_update_error"));
          return;
        }
        setCurrent(response.data);
      } catch {
        feedback.error(t("orders.item_update_error"));
      } finally {
        setBusyItemId(null);
      }
    },
    [feedback, t],
  );

  return { current, isLoading, loadError, isEmpty, busyItemId, reload, updateItem };
}
