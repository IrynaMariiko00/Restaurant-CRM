import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { useChangePassword } from "./hooks/useChangePassword";

export const ChangePasswordPage = () => {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    fieldErrors,
    isLoading,
    handleSubmit,
    t,
  } = useChangePassword();

  const fieldError = (key: keyof typeof fieldErrors) => {
    const code = fieldErrors[key];
    return code ? t(code) : null;
  };

  return (
    <AdminPageShell
      title={t("admin.change_password_title")}
      subtitle={t("admin.change_password_page_subtitle")}
      narrow
    >
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
    </AdminPageShell>
  );
};
