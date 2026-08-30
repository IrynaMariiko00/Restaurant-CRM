import type {
  MenuItemDeleteResponse,
  MenuItemListParams,
  MenuItemListResponse,
  MenuItemRequest,
  MenuItemResponse,
  UpdateMenuItemRequest,
} from "@/types/menuItem";
import { parseActionResponse } from "./parseActionResponse";
import { toMenuItemMultipartBody } from "./menuItemFormData";
import { api } from "./api";

export const menuItemsApi = {
  getMenuItem: async (id: number): Promise<MenuItemResponse> => {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  },
  updateMenuItem: async (
    id: number,
    data: UpdateMenuItemRequest,
    itemImage?: File | null,
  ): Promise<MenuItemResponse> => {
    const response = await api.put(
      `/menu-items/${id}`,
      toMenuItemMultipartBody(data, itemImage),
    );
    return response.data;
  },
  deleteMenuItem: async (id: number): Promise<MenuItemDeleteResponse> => {
    const response = await api.delete(`/menu-items/${id}`);
    return parseActionResponse(response);
  },
  getMenuItems: async (
    params?: MenuItemListParams,
  ): Promise<MenuItemListResponse> => {
    const response = await api.get("/menu-items", { params });
    return response.data;
  },
  createMenuItem: async (
    data: MenuItemRequest,
    itemImage?: File | null,
  ): Promise<MenuItemResponse> => {
    const response = await api.post(
      "/menu-items",
      toMenuItemMultipartBody(data, itemImage),
    );
    return response.data;
  },
  getMenuItemsByCategory: async (
    childCategoryId: number,
    params?: MenuItemListParams,
  ): Promise<MenuItemListResponse> => {
    const response = await api.get(
      `/menu-items/category/${childCategoryId}`,
      { params },
    );
    return response.data;
  },
};
