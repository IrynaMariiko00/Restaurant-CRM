export interface LoginRequest {
  email: string;
  password: string;
}

export interface EmailRequest {
  email: string;
}

export interface RegisterEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SetPasswordRequest {
  employeeId: number;
  uuid: string;
  password: string;
  confirmPassword: string;
}

export interface BaseResponse<T = null> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}

export type ActionResponse = BaseResponse<null>;
