import { Link } from "react-router-dom";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useStaffHomePath } from "@/hooks/useStaffHomePath";
import { useChangePassword } from "./hooks/useChangePassword";

export const ChangePasswordPage = () => {
  const homePath = useStaffHomePath();
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    fieldErrors,
    success,
    isLoading,
    handleSubmit,
    t,
  } = useChangePassword();

  const fieldError = (key: keyof typeof fieldErrors) => {
    const code = fieldErrors[key];
    return code ? t(code) : null;
  };

  return (
    <AuthLayout
      title={t("admin.change_password_title")}
      subtitle={t("admin.change_password_page_subtitle")}
      footer={
        <Link
          to={homePath}
          className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("staff.back_to_home")}
        </Link>
      }
    >
      {success ? (
        <p className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center text-sm text-[var(--success-color)]">
          {success}
        </p>
      ) : (
        <AuthFormCard
          onSubmit={handleSubmit}
          submitText={
            isLoading
              ? t("admin.change_password_saving")
              : t("admin.change_password_submit")
          }
          isLoading={isLoading}
          error={error}
        >
          <PasswordField
            id="currentPassword"
            label={t("admin.current_password")}
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
            error={fieldError("currentPassword")}
          />
          <PasswordField
            id="newPassword"
            label={t("admin.new_password")}
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
            error={fieldError("newPassword")}
          />
          <PasswordField
            id="confirmPassword"
            label={t("admin.confirm_password")}
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            error={fieldError("confirmPassword")}
          />
        </AuthFormCard>
      )}
    </AuthLayout>
  );
};
