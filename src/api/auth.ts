import type {
  ActionResponse,
  ChangePasswordRequest,
  EmailRequest,
  LoginRequest,
  RegisterEmployeeRequest,
  SetPasswordRequest,
} from "@/types/auth";
import { toEmployeeMultipartBody } from "./employeeFormData";
import { parseActionResponse } from "./parseActionResponse";
import { api } from "./api";
import type { EmployeeResponse } from "@/types/employee";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ActionResponse> => {
    const response = await api.post("/auth/login", credentials);
    return parseActionResponse(response);
  },
  logout: async (): Promise<ActionResponse> => {
    const response = await api.post("/auth/logout");
    return parseActionResponse(response);
  },
  changePassword: async (
    password: ChangePasswordRequest,
  ): Promise<ActionResponse> => {
    const response = await api.post("/auth/change-password", password);
    return parseActionResponse(response);
  },
  triggerFinalizeEmployeeRegistration: async (
    email: EmailRequest,
  ): Promise<ActionResponse> => {
    const response = await api.post(
      "/auth/trigger-finalize-employee-registration",
      email,
    );
    return parseActionResponse(response);
  },
  startPasswordReset: async (email: EmailRequest): Promise<ActionResponse> => {
    const response = await api.post("/auth/start-password-reset", email);
    return parseActionResponse(response);
  },
  registerEmployee: async (
    data: RegisterEmployeeRequest,
    profilePicture?: File | null,
  ): Promise<EmployeeResponse> => {
    const response = await api.post(
      "/auth/register-employee",
      toEmployeeMultipartBody(data, profilePicture),
    );
    return response.data;
  },
  finalizePasswordReset: async (
    data: SetPasswordRequest,
  ): Promise<ActionResponse> => {
    const response = await api.post("/auth/finalize-password-reset", data);
    return parseActionResponse(response);
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
  /**
   * GET /test/admin-auth → 200 admin, 403 not admin.
   * Note: api error interceptor resolves 403 instead of throwing,
   * so we must check status (not try/catch alone).
   */
  checkRole: async (): Promise<boolean> => {
    const response = await api.get("/test/admin-auth", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      params: { _t: Date.now() },
    });

    return response.status === 200 && response.data?.success === true;
  },
};
