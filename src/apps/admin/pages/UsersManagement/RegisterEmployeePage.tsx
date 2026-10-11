import { Link } from "react-router-dom";
import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { ChangeAvatar } from "@/apps/staff/pages/EmployeeProfilePage/components/ChangeAvatar";
import { ProfileTextField } from "@/apps/staff/pages/EmployeeProfilePage/components/ProfileTextField";
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
    <AdminPageShell
      title={t("admin.register_employee")}
      subtitle={t("admin.register_subtitle")}
    >
      <div className="register-employee">
        <AuthFormCard
          onSubmit={handleSubmit}
          submitText={
            isSubmitting
              ? t("admin.register_saving")
              : t("admin.register_submit")
          }
          isLoading={isSubmitting}
          error={submitError}
          className="register-employee__card"
          submitClassName="register-employee__submit"
        >
          <div className="register-employee__top">
            <ChangeAvatar
              firstName={form.firstName}
              lastName={form.lastName}
              avatarUrl={avatarPreviewUrl}
              avatarError={errorText("avatar")}
              onAvatarChange={handleAvatarChange}
              size="lg"
              className="register-employee__avatar"
            />

            <div className="register-employee__fields">
              <div className="register-employee__row">
                <ProfileTextField
                  id="firstName"
                  label={t("staff.first_name")}
                  value={form.firstName}
                  error={errorText("firstName")}
                  autoComplete="given-name"
                  onChange={(value) => setField("firstName", value)}
                />
                <ProfileTextField
                  id="lastName"
                  label={t("staff.last_name")}
                  value={form.lastName}
                  error={errorText("lastName")}
                  autoComplete="family-name"
                  onChange={(value) => setField("lastName", value)}
                />
              </div>

              <div className="register-employee__row">
                <ProfileTextField
                  id="email"
                  label={t("common.email")}
                  value={form.email}
                  error={errorText("email")}
                  type="email"
                  autoComplete="email"
                  onChange={(value) => setField("email", value)}
                />
                <ProfileTextField
                  id="phone"
                  label={t("staff.phone")}
                  value={form.phone}
                  error={errorText("phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="0XXXXXXXXX"
                  onChange={(value) => setField("phone", value)}
                />
              </div>

              <label className="register-employee__admin flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3.5">
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
            </div>
          </div>
        </AuthFormCard>

        <div className="register-employee__footer">
          <Link
            to="/staff/users"
            className="text-sm font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
          >
            {t("admin.back_to_users")}
          </Link>
        </div>
      </div>
    </AdminPageShell>
  );
};
