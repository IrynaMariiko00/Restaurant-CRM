import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useEmailTokenParams = () => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const employeeIdRaw =
      searchParams.get("employeeId") ??
      searchParams.get("employee_id") ??
      searchParams.get("id");
    const uuid = searchParams.get("uuid") ?? searchParams.get("token") ?? "";
    const employeeId = employeeIdRaw ? Number(employeeIdRaw) : NaN;
    const isValid =
      Number.isFinite(employeeId) && employeeId > 0 && uuid.trim().length > 0;

    return {
      employeeId: isValid ? employeeId : null,
      uuid: uuid.trim(),
      isValid,
    };
  }, [searchParams]);
};
