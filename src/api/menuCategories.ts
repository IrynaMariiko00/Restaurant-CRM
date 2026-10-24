import type {
  MenuCategoryDeleteResponse,
  MenuCategoryListParams,
  MenuCategoryListResponse,
  MenuCategoryRequest,
  MenuCategoryResponse,
} from "@/types/menuCategory";
import { api } from "./api";
import { parseActionResponse } from "./parseActionResponse";

export const menuCategoriesApi = {
  updateParent: async (
    parentCategoryId: number,
    data: MenuCategoryRequest,
  ): Promise<MenuCategoryResponse> => {
    const response = await api.put(
      `/menu-categories/parents/${parentCategoryId}`,
      data,
    );
    return response.data;
  },

  deleteParent: async (
    parentCategoryId: number,
  ): Promise<MenuCategoryDeleteResponse> => {
    const response = await api.delete(
      `/menu-categories/parents/${parentCategoryId}`,
    );
    return parseActionResponse(response);
  },

  updateChild: async (
    childCategoryId: number,
    data: MenuCategoryRequest,
  ): Promise<MenuCategoryResponse> => {
    const response = await api.put(
      `/menu-categories/children/${childCategoryId}`,
      data,
    );
    return response.data;
  },

  deleteChild: async (
    childCategoryId: number,
  ): Promise<MenuCategoryDeleteResponse> => {
    const response = await api.delete(
      `/menu-categories/children/${childCategoryId}`,
    );
    return parseActionResponse(response);
  },

  createParent: async (
    data: MenuCategoryRequest,
  ): Promise<MenuCategoryResponse> => {
    const response = await api.post("/menu-categories", data);
    return response.data;
  },

  createChild: async (
    parentCategoryId: number,
    data: MenuCategoryRequest,
  ): Promise<MenuCategoryResponse> => {
    const response = await api.post(
      `/menu-categories/parents/${parentCategoryId}/children`,
      data,
    );
    return response.data;
  },

  getCategory: async (id: number): Promise<MenuCategoryResponse> => {
    const response = await api.get(`/menu-categories/${id}`);
    return response.data;
  },

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
