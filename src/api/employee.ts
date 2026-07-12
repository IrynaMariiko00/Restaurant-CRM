import type {
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeResponse,
  FinalizeEmailChange,
  UpdateEmployeeRequest,
} from "@/types/employee";
import { api } from "./api";

export const employeeApi = {
  getMe: async (): Promise<EmployeeResponse> => {
    const response = await api.get("/employees/me");
    return response.data;
  },
  updateMe: async (data: UpdateEmployeeRequest): Promise<EmployeeResponse> => {
    const response = await api.put("/employees/me", data);
    return response.data;
  },
  getEmployee: async (id: number): Promise<EmployeeResponse> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  updateEmployee: async (
    id: number,
    data: UpdateEmployeeRequest,
  ): Promise<EmployeeResponse> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },
  finalizeEmailChange: async (
    data: FinalizeEmailChange,
  ): Promise<EmployeeResponse> => {
    const response = await api.post("/employees/finalize-email-change", data);
    return response.data;
  },
  getAllEmployees: async (
    params?: EmployeeListParams,
  ): Promise<EmployeeListResponse> => {
    const response = await api.get("/employees", { params });
    return response.data;
  },
};
