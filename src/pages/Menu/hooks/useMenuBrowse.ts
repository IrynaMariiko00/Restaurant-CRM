import { useLocation } from "react-router-dom";

export type MenuBrowseVariant = "guest" | "table" | "staff";

export function useMenuBrowse() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/staff")) {
    return {
      variant: "staff" as const satisfies MenuBrowseVariant,
      listTo: "/staff/menu",
      itemTo: (id: number) => `/staff/menu/${id}`,
      homeTo: "/staff",
    };
  }

  const tableMatch = pathname.match(/^\/table\/([^/]+)/);
  if (tableMatch) {
    const tableId = tableMatch[1];
    return {
      variant: "table" as const satisfies MenuBrowseVariant,
      listTo: `/table/${tableId}/menu`,
      itemTo: (id: number) => `/table/${tableId}/menu/${id}`,
      homeTo: `/table/${tableId}`,
    };
  }

  return {
    variant: "guest" as const satisfies MenuBrowseVariant,
    listTo: "/menu",
    itemTo: (id: number) => `/menu/${id}`,
    homeTo: "/",
  };
}
