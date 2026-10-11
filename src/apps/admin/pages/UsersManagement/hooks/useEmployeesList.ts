import { authApi } from "@/api/auth";
import { employeeApi } from "@/api/employee";
import { useFeedback } from "@/context/FeedbackContext";
import type { Employee } from "@/types/employee";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function withCurrentUserFirst(
  employees: Employee[],
  currentUserId: number | null,
) {
  if (currentUserId == null) return employees;

  const currentUser = employees.find((employee) => employee.id === currentUserId);
  if (!currentUser) return employees;

  return [
    currentUser,
    ...employees.filter((employee) => employee.id !== currentUserId),
  ];
}

export const useEmployeesList = () => {
  const { t } = useTranslation();
  const feedback = useFeedback();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [listResponse, meResponse] = await Promise.all([
        employeeApi.getAllEmployees({
          page: 0,
          size: 50,
          sort: "lastName,asc",
        }),
        employeeApi.getMe(),
      ]);

      if (!listResponse.success || !listResponse.data) {
        setLoadError(listResponse.errors?.[0] ?? t("admin.users_load_error"));
        setEmployees([]);
        return;
      }

      const meId =
        meResponse.success && meResponse.data ? meResponse.data.id : null;
      setCurrentUserId(meId);
      setEmployees(withCurrentUserFirst(listResponse.data.items, meId));
    } catch {
      setLoadError(t("admin.users_load_error"));
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  const resendRegistrationEmail = async (email: string) => {
    setResendingEmail(email);

    try {
      const response = await authApi.triggerFinalizeEmployeeRegistration({
        email,
      });

      if (!response.success) {
        feedback.error(
          response.errors?.[0] ?? t("admin.resend_email_error"),
        );
        return;
      }

      feedback.success(t("admin.resend_email_success", { email }));
    } catch {
      feedback.error(t("admin.resend_email_error"));
    } finally {
      setResendingEmail(null);
    }
  };

  return {
    employees,
    currentUserId,
    isLoading,
    loadError,
    resendingEmail,
    reload: loadEmployees,
    resendRegistrationEmail,
    t,
  };
};
