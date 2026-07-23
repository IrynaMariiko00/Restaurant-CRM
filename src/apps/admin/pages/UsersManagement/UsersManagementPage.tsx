import { Link, useLocation } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";
import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { EmployeeListItem } from "./components/EmployeeListItem";
import { useEmployeesList } from "./hooks/useEmployeesList";

export const UsersManagementPage = () => {
  const location = useLocation();
  const registeredEmail = (
    location.state as { registeredEmail?: string } | null
  )?.registeredEmail;

  const {
    employees,
    isLoading,
    loadError,
    resendingEmail,
    resendSuccess,
    resendError,
    resendRegistrationEmail,
    t,
  } = useEmployeesList();

  return (
    <AdminPageShell
      title={t("admin.users_title")}
      subtitle={t("admin.users_desc")}
    >
      <Link
        to="/staff/users/new"
        className="btn-accent mb-4 flex w-full items-center justify-center gap-2"
      >
        <UserPlus className="h-4 w-4" aria-hidden />
        {t("admin.register_employee")}
      </Link>

      {registeredEmail && (
        <p className="mb-4 rounded-2xl border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--success-color),transparent_92%)] p-4 text-center text-sm text-[var(--success-color)]">
          {t("admin.register_success", { email: registeredEmail })}
        </p>
      )}

      {resendSuccess && (
        <p className="mb-4 rounded-2xl border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--success-color),transparent_92%)] p-4 text-center text-sm text-[var(--success-color)]">
          {t("admin.resend_email_success", { email: resendSuccess })}
        </p>
      )}

      {resendError && (
        <p className="mb-4 text-center text-sm text-[var(--error-color)]">
          {resendError}
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2
            className="h-8 w-8 animate-spin text-[var(--color-violet-blue)]"
            aria-label={t("common.waiting")}
          />
        </div>
      ) : loadError ? (
        <p className="text-center text-sm text-[var(--error-color)]">
          {loadError}
        </p>
      ) : employees.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center text-sm text-[var(--secondary-text)]">
          {t("admin.users_empty")}
        </p>
      ) : (
        <div className="space-y-3">
          {employees.map((employee) => (
            <EmployeeListItem
              key={employee.id}
              employee={employee}
              isResending={resendingEmail === employee.email}
              onResendEmail={(email) => void resendRegistrationEmail(email)}
            />
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};
