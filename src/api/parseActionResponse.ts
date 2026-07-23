import type { AxiosResponse } from "axios";
import type { ActionResponse } from "@/types/auth";

export function parseActionResponse(response: AxiosResponse): ActionResponse {
  const { status, data } = response;

  if (status >= 200 && status < 300) {
    if (data && typeof data === "object" && "success" in data) {
      return data as ActionResponse;
    }

    return {
      success: true,
      message: null,
      data: null,
      errors: null,
    };
  }

  if (data && typeof data === "object" && "success" in data) {
    return data as ActionResponse;
  }

  return {
    success: false,
    message: null,
    data: null,
    errors: null,
  };
}
