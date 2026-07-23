import { Link } from "react-router-dom";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProfileEditFields } from "@/apps/staff/pages/EmployeeProfilePage/components/ProfileEditFields";
import { useRegisterEmployee } from "./hooks/useRegisterEmployee";

export const RegisterEmployeePage = () => {
  const {
    form,
    setField,
    avatarPreviewUrl,
    handleAvatarChange,
    fieldErrors,
    submitError,
    isSubmitting,
    handleSubmit,
    t,
  } = useRegisterEmployee();

  const errorText = (key: keyof typeof fieldErrors) => {
    const code = fieldErrors[key];
    return code ? t(code) : null;
  };

  return (
    <AuthLayout
      title={t("admin.register_employee")}
      subtitle={t("admin.register_subtitle")}
      footer={
        <Link
          to="/staff/users"
          className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("admin.back_to_users")}
        </Link>
      }
    >
      <AuthFormCard
        onSubmit={handleSubmit}
        submitText={
          isSubmitting ? t("admin.register_saving") : t("admin.register_submit")
        }
        isLoading={isSubmitting}
        error={submitError}
      >
        <ProfileEditFields
          firstName={form.firstName}
          lastName={form.lastName}
          email={form.email}
          phone={form.phone}
          avatarUrl={avatarPreviewUrl}
          errors={{
            firstName: errorText("firstName"),
            lastName: errorText("lastName"),
            email: errorText("email"),
            phone: errorText("phone"),
            avatar: errorText("avatar"),
          }}
          onChange={(field, value) => setField(field, value)}
          onAvatarChange={handleAvatarChange}
        />

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3">
          <input
            type="checkbox"
            checked={form.isAdmin}
            onChange={(e) => setField("isAdmin", e.target.checked)}
            className="h-4 w-4 accent-[var(--color-violet-blue)]"
          />
          <span className="text-sm text-[var(--primary-text)]">
            {t("admin.register_is_admin")}
          </span>
        </label>
      </AuthFormCard>
    </AuthLayout>
  );
};
