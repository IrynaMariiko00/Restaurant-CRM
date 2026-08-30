import { menuItemsApi } from "@/api/menuItems";
import type { MenuItem, MenuItemPageMeta } from "@/types/menuItem";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useMenuList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 0);

  const [items, setItems] = useState<MenuItem[]>([]);
  const [meta, setMeta] = useState<MenuItemPageMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await Promise.resolve();
      if (cancelled) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await menuItemsApi.getMenuItems({
          page: Number.isFinite(page) && page >= 0 ? page : 0,
        });

        if (cancelled) return;

        if (!response.success || !response.data) {
          setItems([]);
          setMeta(null);
          setError(response.errors?.[0] ?? "menu.load_error");
          return;
        }

        setItems(response.data.items);
        setMeta(response.data.meta);
      } catch {
        if (cancelled) return;
        setItems([]);
        setMeta(null);
        setError("menu.load_error");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 0) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return {
    items,
    meta,
    page: meta?.page ?? page,
    isLoading,
    error,
    setPage,
  };
}
