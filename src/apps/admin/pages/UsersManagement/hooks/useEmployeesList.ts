import { authApi } from "@/api/auth";
import { employeeApi } from "@/api/employee";
import type { Employee } from "@/types/employee";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useEmployeesList = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await employeeApi.getAllEmployees({
        page: 0,
        size: 50,
        sort: "lastName,asc",
      });

      if (!response.success || !response.data) {
        setLoadError(response.errors?.[0] ?? t("admin.users_load_error"));
        setEmployees([]);
        return;
      }

      setEmployees(response.data.items);
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
    setResendError(null);
    setResendSuccess(null);

    try {
      const response = await authApi.triggerFinalizeEmployeeRegistration({
        email,
      });

      if (!response.success) {
        setResendError(response.errors?.[0] ?? t("admin.resend_email_error"));
        return;
      }

      setResendSuccess(email);
    } catch {
      setResendError(t("admin.resend_email_error"));
    } finally {
      setResendingEmail(null);
    }
  };

  return {
    employees,
    isLoading,
    loadError,
    resendingEmail,
    resendSuccess,
    resendError,
    reload: loadEmployees,
    resendRegistrationEmail,
    t,
  };
};
