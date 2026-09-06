import type { BaseResponse } from "./auth";

export interface MenuCategory {
  id: number;
  nameDefaultLanguage: string;
  nameSecondLanguage: string;
  parentCategoryId: number | null;
}

export interface MenuCategoryListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface MenuCategoryPageMeta {
  page: number;
  size: number;
  total: number;
}

export interface MenuCategoryListData {
  items: MenuCategory[];
  meta: MenuCategoryPageMeta;
}

export type MenuCategoryListResponse = BaseResponse<MenuCategoryListData>;
