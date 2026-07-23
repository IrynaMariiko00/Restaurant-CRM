import { authApi } from "@/api/auth";
import {
  validateChangePasswordForm,
  type ChangePasswordFormErrors,
} from "@/shared/validation/validators";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

export const useChangePassword = () => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ChangePasswordFormErrors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldError = (key: keyof ChangePasswordFormErrors) => {
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
    setSuccess(null);

    const errors = validateChangePasswordForm({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!response.success) {
        setError(response.errors?.[0] ?? t("admin.change_password_error"));
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(t("admin.change_password_success"));
    } catch {
      setError(t("admin.change_password_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword: (value: string) => {
      setCurrentPassword(value);
      clearFieldError("currentPassword");
      if (error) setError(null);
    },
    newPassword,
    setNewPassword: (value: string) => {
      setNewPassword(value);
      clearFieldError("newPassword");
      clearFieldError("confirmPassword");
      if (error) setError(null);
    },
    confirmPassword,
    setConfirmPassword: (value: string) => {
      setConfirmPassword(value);
      clearFieldError("confirmPassword");
      if (error) setError(null);
    },
    error,
    fieldErrors,
    success,
    isLoading,
    handleSubmit,
    t,
  };
};
