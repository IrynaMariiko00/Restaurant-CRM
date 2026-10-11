import { Link } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";
import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { EmployeeListItem } from "./components/EmployeeListItem";
import { useEmployeesList } from "./hooks/useEmployeesList";

export const UsersManagementPage = () => {
  const {
    employees,
    currentUserId,
    isLoading,
    loadError,
    resendingEmail,
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
        className="btn-accent mb-8 inline-flex w-fit items-center justify-center gap-2"
      >
        <UserPlus className="h-4 w-4" aria-hidden />
        {t("admin.register_employee")}
      </Link>

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
        <div className="employees-grid grid grid-cols-1 gap-4 md:grid-cols-2">
          {employees.map((employee) => (
            <EmployeeListItem
              key={employee.id}
              employee={employee}
              isCurrentUser={employee.id === currentUserId}
              isResending={resendingEmail === employee.email}
              onResendEmail={(email) => void resendRegistrationEmail(email)}
            />
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};
