import type { MenuCategory } from "@/types/menuCategory";
import type { MenuItem } from "@/types/menuItem";
import { menuCategoriesApi } from "@/api/menuCategories";
import { menuItemsApi } from "@/api/menuItems";

const PAGE_SIZE = 50;

type PageResult<T> = {
  items: T[];
  meta: { page: number; size: number; total: number };
};

async function fetchAllPages<T>(
  loadPage: (page: number, size: number) => Promise<PageResult<T> | null>,
  size = PAGE_SIZE,
): Promise<T[] | null> {
  const first = await loadPage(0, size);
  if (!first) return null;

  const items = [...first.items];
  const pageSize = first.meta.size || size;
  const totalPages = Math.max(1, Math.ceil(first.meta.total / pageSize));

  if (totalPages <= 1) return items;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      loadPage(index + 1, pageSize),
    ),
  );

  for (const page of rest) {
    if (!page) return null;
    items.push(...page.items);
  }

  return items;
}

export async function loadAllParents() {
  return fetchAllPages<MenuCategory>(async (page, size) => {
    const response = await menuCategoriesApi.getParents({
      page,
      size,
      sort: "nameDefaultLanguage,asc",
    });
    if (!response.success || !response.data) return null;
    return response.data;
  });
}

export async function loadItemsForChild(childCategoryId: number) {
  return fetchAllPages<MenuItem>(async (page, size) => {
    const response = await menuItemsApi.getMenuItemsByCategory(
      childCategoryId,
      {
        page,
        size,
        sort: "id,asc",
      },
    );
    if (!response.success || !response.data) return null;
    return response.data;
  });
}

export async function loadChildrenForParents(parents: MenuCategory[]) {
  const nested = await Promise.all(
    parents.map(async (parent) => {
      const children = await fetchAllPages<MenuCategory>(async (page, size) => {
        const response = await menuCategoriesApi.getChildren(parent.id, {
          page,
          size,
          sort: "nameDefaultLanguage,asc",
        });
        if (!response.success || !response.data) return null;
        return response.data;
      });
      if (!children) return [] as { child: MenuCategory; parent: MenuCategory }[];
      return children.map((child) => ({ child, parent }));
    }),
  );
  return nested.flat();
}
