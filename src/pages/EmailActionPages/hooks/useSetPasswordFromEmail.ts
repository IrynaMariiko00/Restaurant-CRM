import { authApi } from "@/api/auth";
import {
  validateSetPasswordForm,
  type SetPasswordFormErrors,
} from "@/shared/validation/validators";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useEmailTokenParams } from "./useEmailTokenParams";

export type SetPasswordFlow = "registration" | "reset";

export const useSetPasswordFromEmail = (flow: SetPasswordFlow) => {
  const { t } = useTranslation();
  const { employeeId, uuid, isValid } = useEmailTokenParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<SetPasswordFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setSubmitError(null);

    if (!isValid || employeeId === null) {
      setSubmitError(t("email_action.invalid_link"));
      return;
    }

    const errors = validateSetPasswordForm({ password, confirmPassword });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        employeeId,
        uuid,
        password,
        confirmPassword,
      };

      const response =
        flow === "registration"
          ? await authApi.finalizeEmployeeRegistration(payload)
          : await authApi.finalizePasswordReset(payload);

      if (!response.success) {
        setSubmitError(
          response.errors?.[0] ??
            (flow === "registration"
              ? t("email_action.registration_error")
              : t("email_action.reset_error")),
        );
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setSubmitError(
        flow === "registration"
          ? t("email_action.registration_error")
          : t("email_action.reset_error"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isValid,
    password,
    setPassword: (value: string) => {
      setPassword(value);
      clearFieldError("password");
      clearFieldError("confirmPassword");
      if (submitError) setSubmitError(null);
    },
    confirmPassword,
    setConfirmPassword: (value: string) => {
      setConfirmPassword(value);
      clearFieldError("confirmPassword");
      if (submitError) setSubmitError(null);
    },
    fieldErrors,
    submitError,
    success,
    isSubmitting,
    handleSubmit,
    t,
  };
};
