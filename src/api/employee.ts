import type {
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeResponse,
  FinalizeEmailChange,
  UpdateEmployeeRequest,
} from "@/types/employee";
import { toEmployeeMultipartBody } from "./employeeFormData";
import { api } from "./api";

function toUpdateEmployeeFormData(
  data: UpdateEmployeeRequest,
  profilePicture?: File | null,
): FormData {
  return toEmployeeMultipartBody(data, profilePicture);
}

export const employeeApi = {
  getMe: async (): Promise<EmployeeResponse> => {
    const response = await api.get("/employees/me");
    return response.data;
  },
  updateMe: async (
    data: UpdateEmployeeRequest,
    profilePicture?: File | null,
  ): Promise<EmployeeResponse> => {
    const response = await api.put(
      "/employees/me",
      toUpdateEmployeeFormData(data, profilePicture),
    );
    return response.data;
  },
  getEmployee: async (id: number): Promise<EmployeeResponse> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  updateEmployee: async (
    id: number,
    data: UpdateEmployeeRequest,
    profilePicture?: File | null,
  ): Promise<EmployeeResponse> => {
    const response = await api.put(
      `/employees/${id}`,
      toUpdateEmployeeFormData(data, profilePicture),
    );
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
