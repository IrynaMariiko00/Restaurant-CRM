import type {
  ActionResponse,
  ChangePasswordRequest,
  EmailRequest,
  EmployeeResponse,
  LoginRequest,
  RegisterEmployeeRequest,
  SetPasswordRequest,
} from "@/types/auth";
import { api } from "./api";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ActionResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  logout: async (): Promise<ActionResponse> => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
  changePassword: async (
    password: ChangePasswordRequest,
  ): Promise<ActionResponse> => {
    const response = await api.post("/auth/change-password", password);
    return response.data;
  },
  triggerFinalizeEmployeeRegistration: async (
    email: EmailRequest,
  ): Promise<ActionResponse> => {
    const response = await api.post(
      "/auth/trigger-finalize-employee-registration",
      email,
    );
    return response.data;
  },
  startPasswordReset: async (email: EmailRequest): Promise<ActionResponse> => {
    const response = await api.post("/auth/start-password-reset", email);
    return response.data;
  },
  registerEmployee: async (
    data: RegisterEmployeeRequest,
  ): Promise<EmployeeResponse> => {
    const response = await api.post("/auth/register-employee", data);
    return response.data;
  },
  finalizePasswordReset: async (
    data: SetPasswordRequest,
  ): Promise<ActionResponse> => {
    const response = await api.post("/auth/finalize-password-reset", data);
    return response.data;
  },
  finalizeEmployeeRegistration: async (
    data: SetPasswordRequest,
  ): Promise<EmployeeResponse> => {
    const response = await api.post(
      "/auth/finalize-employee-registration",
      data,
    );
    return response.data;
  },
};
