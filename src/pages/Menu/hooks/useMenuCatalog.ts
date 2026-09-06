import type { MenuCategory } from "@/types/menuCategory";
import type { MenuItem } from "@/types/menuItem";
import { useEffect, useMemo, useState } from "react";
import {
  loadAllParents,
  loadChildrenForParents,
  loadItemsForChild,
} from "./menuCatalogApi";

export type MenuCategorySection = {
  category: MenuCategory;
  parent: MenuCategory | null;
  items: MenuItem[];
};

export function useMenuCatalog() {
  const [sections, setSections] = useState<MenuCategorySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const parents = await loadAllParents();
        if (cancelled) return;

        if (!parents) {
          setSections([]);
          setError("menu.create_categories_error");
          return;
        }

        const childrenWithParent = await loadChildrenForParents(parents);
        if (cancelled) return;

        const itemsByChild = await Promise.all(
          childrenWithParent.map(async ({ child, parent }) => {
            const items = await loadItemsForChild(child.id);
            return { child, parent, items };
          }),
        );
        if (cancelled) return;

        if (itemsByChild.some((entry) => entry.items == null)) {
          setSections([]);
          setError("menu.load_error");
          return;
        }

        const nextSections: MenuCategorySection[] = itemsByChild
          .map(({ child, parent, items }) => ({
            category: child,
            parent,
            items: items ?? [],
          }))
          .filter((section) => section.items.length > 0);

        setSections(nextSections);
      } catch {
        if (!cancelled) {
          setSections([]);
          setError("menu.load_error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalItems = useMemo(
    () => sections.reduce((sum, section) => sum + section.items.length, 0),
    [sections],
  );

  const removeItem = (itemId: number) => {
    setSections((prev) =>
      prev
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => item.id !== itemId),
        }))
        .filter((section) => section.items.length > 0),
    );
  };

  return {
    sections,
    totalItems,
    isLoading,
    error,
    removeItem,
  };
}
