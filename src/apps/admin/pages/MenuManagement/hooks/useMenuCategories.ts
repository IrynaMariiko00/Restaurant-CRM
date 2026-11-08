import { menuCategoriesApi } from "@/api/menuCategories";
import type { MenuCategory } from "@/types/menuCategory";
import { useCallback, useEffect, useState } from "react";

export function useMenuCategories() {
  const [parents, setParents] = useState<MenuCategory[]>([]);
  const [children, setChildren] = useState<MenuCategory[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);
  const [isLoadingParents, setIsLoadingParents] = useState(true);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoadingParents(true);
      setError(null);
      try {
        const response = await menuCategoriesApi.getParents({
          page: 0,
          size: 50,
          sort: "nameDefaultLanguage,asc",
        });
        if (cancelled) return;
        if (!response.success || !response.data) {
          setParents([]);
          setError(response.errors?.[0] ?? "menu.create_categories_error");
          return;
        }
        setParents(response.data.items);
      } catch {
        if (!cancelled) {
          setParents([]);
          setError("menu.create_categories_error");
        }
      } finally {
        if (!cancelled) setIsLoadingParents(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (parentId == null) return;

    let cancelled = false;

    const load = async () => {
      setIsLoadingChildren(true);
      try {
        const response = await menuCategoriesApi.getChildren(parentId, {
          page: 0,
          size: 50,
          sort: "nameDefaultLanguage,asc",
        });
        if (cancelled) return;
        if (!response.success || !response.data) {
          setChildren([]);
          return;
        }
        setChildren(response.data.items);
      } catch {
        if (!cancelled) setChildren([]);
      } finally {
        if (!cancelled) setIsLoadingChildren(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [parentId]);

  const selectParent = useCallback((id: number | null) => {
    setParentId(id);
    setChildren([]);
  }, []);

  const hydrateFromChildId = useCallback(async (childCategoryId: number) => {
    try {
      const response = await menuCategoriesApi.getCategory(childCategoryId);
      const resolvedParentId = response.data?.parentCategoryId;
      if (response.success && resolvedParentId != null) {
        setParentId(resolvedParentId);
      }
    } catch {
      setParentId(null);
    }
  }, []);

  return {
    parents,
    children,
    parentId,
    selectParent,
    hydrateFromChildId,
    isLoadingParents,
    isLoadingChildren,
    error,
  };
}
