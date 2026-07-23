import type { RegisterEmployeeRequest } from "@/types/auth";
import type { UpdateEmployeeRequest } from "@/types/employee";

export function toEmployeeMultipartBody(
  employeeRequest: RegisterEmployeeRequest | UpdateEmployeeRequest,
  profilePicture?: File | null,
): FormData {
  const formData = new FormData();
  formData.append(
    "employeeRequest",
    new Blob([JSON.stringify(employeeRequest)], {
      type: "application/json",
    }),
  );
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }
  return formData;
}
