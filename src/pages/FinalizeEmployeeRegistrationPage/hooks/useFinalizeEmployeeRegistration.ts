import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authApi } from "@/api/auth";
import {
  validateSetPasswordForm,
  type SetPasswordFormErrors,
} from "@/shared/validation/validators";

function parseLinkParams(searchParams: URLSearchParams) {
  const employeeId = Number(searchParams.get("employee_id"));
  const uuid = searchParams.get("uuid")?.trim() ?? "";

  if (!Number.isInteger(employeeId) || employeeId <= 0 || !uuid) {
    return null;
  }

  return { employeeId, uuid };
}

export function useFinalizeEmployeeRegistration() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const link = useMemo(() => parseLinkParams(searchParams), [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<SetPasswordFormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldError = (key: keyof SetPasswordFormErrors) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!link) {
      setError(t("common.confirm_account-invalid-link"));
      return;
    }

    const errors = validateSetPasswordForm({ password, confirmPassword });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await authApi.finalizeEmployeeRegistration({
        employeeId: link.employeeId,
        uuid: link.uuid,
        password,
        confirmPassword,
      });

      if (!response.success) {
        setError(
          response.errors?.[0] ??
            response.message ??
            t("common.confirm_account-error"),
        );
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError(t("common.confirm_account-error"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isValidLink: Boolean(link),
    password,
    setPassword: (value: string) => {
      setPassword(value);
      clearFieldError("password");
      clearFieldError("confirmPassword");
      if (error) setError(null);
    },
    confirmPassword,
    setConfirmPassword: (value: string) => {
      setConfirmPassword(value);
      clearFieldError("confirmPassword");
      if (error) setError(null);
    },
    fieldErrors,
    error,
    success,
    isLoading,
    handleSubmit,
    t,
  };
}
