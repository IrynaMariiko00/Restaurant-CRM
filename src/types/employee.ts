import type { BaseResponse } from "./auth";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  phone: string;
  isDeleted: boolean;
}

export interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  isDeleted?: boolean;
}

export interface FinalizeEmailChange {
  employeeId: number;
  uuid: string;
}

export interface EmployeeListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageMeta {
  page: number;
  size: number;
  total: number;
}

export interface EmployeeListData {
  items: Employee[];
  meta: PageMeta;
}

export type EmployeeResponse = BaseResponse<Employee>;
export type EmployeeListResponse = BaseResponse<EmployeeListData>;
