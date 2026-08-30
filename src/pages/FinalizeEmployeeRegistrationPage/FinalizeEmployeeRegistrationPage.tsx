import { Link } from "react-router-dom";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { AuthLayout } from "@/layouts/AuthLayout";
import { FinalizeSuccess } from "./components/FinalizeSuccess";
import { useFinalizeEmployeeRegistration } from "./hooks/useFinalizeEmployeeRegistration";

export function FinalizeEmployeeRegistrationPage() {
  const {
    isValidLink,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fieldErrors,
    error,
    success,
    isLoading,
    handleSubmit,
    t,
  } = useFinalizeEmployeeRegistration();

  const fieldError = (key: keyof typeof fieldErrors) => {
    const code = fieldErrors[key];
    return code ? t(code) : null;
  };

  return (
    <AuthLayout
      title={t("common.confirm_account-title")}
      subtitle={
        success
          ? t("common.confirm_account-success-subtitle")
          : isValidLink
            ? t("common.confirm_account-subtitle")
            : t("common.confirm_account-invalid-link-subtitle")
      }
      footer={
        <Link
          to="/login"
          className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("common.confirm_account-login-link")}
        </Link>
      }
    >
      {success ? (
        <FinalizeSuccess />
      ) : isValidLink ? (
        <AuthFormCard
          onSubmit={handleSubmit}
          submitText={
            isLoading
              ? t("common.confirm_account-loading")
              : t("common.confirm_account-button")
          }
          isLoading={isLoading}
          error={error}
        >
          <PasswordField
            id="new-password"
            label={t("common.confirm_account-password")}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            hint={t("validation.password_policy")}
            error={fieldError("password")}
          />
          <PasswordField
            id="confirm-password"
            label={t("common.confirm_account-confirm-password")}
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            error={fieldError("confirmPassword")}
          />
        </AuthFormCard>
      ) : (
        <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center shadow-sm">
          <p className="text-sm text-[var(--error-color)]">
            {t("common.confirm_account-invalid-link")}
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
