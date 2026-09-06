import type {
  MenuCategoryListParams,
  MenuCategoryListResponse,
} from "@/types/menuCategory";
import { api } from "./api";

export const menuCategoriesApi = {
  getParents: async (
    params?: MenuCategoryListParams,
  ): Promise<MenuCategoryListResponse> => {
    const response = await api.get("/menu-categories/parents", { params });
    return response.data;
  },
  getChildren: async (
    parentCategoryId: number,
    params?: MenuCategoryListParams,
  ): Promise<MenuCategoryListResponse> => {
    const response = await api.get(
      `/menu-categories/children/${parentCategoryId}`,
      { params },
    );
    return response.data;
  },
};
