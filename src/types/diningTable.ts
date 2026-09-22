import type { BaseResponse } from "./auth";

export interface DiningTable {
  id: number;
  qrUuid: string;
  isActive: boolean;
}

export interface DiningTableListParams {
  activeRequired?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface DiningTableGetParams {
  activeRequired?: boolean;
}

export interface DiningTablePageMeta {
  page: number;
  size: number;
  total: number;
}

export interface DiningTableListData {
  items: DiningTable[];
  meta: DiningTablePageMeta;
}

export type DiningTableResponse = BaseResponse<DiningTable>;
export type DiningTableListResponse = BaseResponse<DiningTableListData>;
