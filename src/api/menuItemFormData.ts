import type { MenuItemRequest, UpdateMenuItemRequest } from "@/types/menuItem";

export function toMenuItemMultipartBody(
  menuItem: MenuItemRequest | UpdateMenuItemRequest,
  itemImage?: File | null,
): FormData {
  const formData = new FormData();
  formData.append(
    "menuItem",
    new Blob([JSON.stringify(menuItem)], { type: "application/json" }),
  );
  if (itemImage) {
    formData.append("itemImage", itemImage);
  }
  return formData;
}
