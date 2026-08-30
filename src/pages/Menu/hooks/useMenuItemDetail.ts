import { menuItemsApi } from "@/api/menuItems";
import type { MenuItem } from "@/types/menuItem";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function useMenuItemDetail() {
  const { id } = useParams();
  const itemId = Number(id);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await Promise.resolve();
      if (cancelled) return;

      if (!Number.isFinite(itemId) || itemId <= 0) {
        setError("menu.invalid_id");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await menuItemsApi.getMenuItem(itemId);
        if (cancelled) return;
        if (!response.success || !response.data) {
          setItem(null);
          setError(response.errors?.[0] ?? "menu.item_load_error");
          return;
        }
        setItem(response.data);
      } catch {
        if (cancelled) return;
        setItem(null);
        setError("menu.item_load_error");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  return { item, isLoading, error };
}
