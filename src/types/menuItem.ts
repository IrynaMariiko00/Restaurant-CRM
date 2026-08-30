import type { ActionResponse, BaseResponse } from "./auth";

export interface MenuItem {
  id: number;
  nameDefaultLanguage: string;
  nameSecondLanguage: string;
  descriptionDefaultLanguage: string;
  descriptionSecondLanguage: string;
  ingredientsDefaultLanguage: string[];
  ingredientsSecondLanguage: string[];
  isAllergenic: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isAvailable?: boolean;
  maxQuantityPerPerson: number | null;
  weightGrams?: number | null;
  price: number;
  imageId: number | null;
  childCategoryId: number;
}

export interface MenuItemRequest {
  nameDefaultLanguage?: string;
  nameSecondLanguage?: string;
  descriptionDefaultLanguage?: string;
  descriptionSecondLanguage?: string;
  ingredientsDefaultLanguage?: string[];
  ingredientsSecondLanguage?: string[];
  isAllergenic: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  maxQuantityPerPerson?: number | null;
  weightGrams?: number | null;
  price: number;
  childCategoryId: number;
}

export interface UpdateMenuItemRequest {
  nameDefaultLanguage?: string;
  nameSecondLanguage?: string;
  descriptionDefaultLanguage?: string;
  descriptionSecondLanguage?: string;
  ingredientsDefaultLanguage?: string[];
  ingredientsSecondLanguage?: string[];
  isAllergenic?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isAvailable?: boolean;
  maxQuantityPerPerson?: number | null;
  weightGrams?: number | null;
  price?: number;
  childCategoryId?: number;
}

export interface MenuItemListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface MenuItemPageMeta {
  page: number;
  size: number;
  total: number;
}

export interface MenuItemListData {
  items: MenuItem[];
  meta: MenuItemPageMeta;
}

export type MenuItemResponse = BaseResponse<MenuItem>;
export type MenuItemListResponse = BaseResponse<MenuItemListData>;
export type MenuItemDeleteResponse = ActionResponse;
