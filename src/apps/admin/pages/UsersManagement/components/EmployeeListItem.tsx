import { CheckCircle2, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Employee } from "@/types/employee";

type EmployeeListItemProps = {
  employee: Employee;
  isResending: boolean;
  onResendEmail: (email: string) => void;
};

export const EmployeeListItem = ({
  employee,
  isResending,
  onResendEmail,
}: EmployeeListItemProps) => {
  const { t } = useTranslation();
  const initials =
    `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase() ||
    "?";

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-light)] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-violet-blue),transparent_88%)] text-sm font-semibold text-[var(--color-violet-blue)]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--primary-text)]">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="mt-0.5 truncate text-sm text-[var(--secondary-text)]">
            {employee.email}
          </p>
          <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
            {employee.phone}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                employee.emailConfirmed
                  ? "bg-[color-mix(in_srgb,var(--success-color),transparent_88%)] text-[var(--success-color)]"
                  : "bg-[var(--bg-primary)] text-[var(--secondary-text)]"
              }`}
            >
              {employee.emailConfirmed && (
                <CheckCircle2 className="h-3 w-3" aria-hidden />
              )}
              {employee.emailConfirmed
                ? t("staff.email_confirmed")
                : t("staff.email_unconfirmed")}
            </span>
            {employee.isDeleted && (
              <span className="rounded-full bg-[color-mix(in_srgb,var(--error-color),transparent_88%)] px-2 py-0.5 text-xs font-medium text-[var(--error-color)]">
                {t("admin.user_deleted")}
              </span>
            )}
          </div>
        </div>
      </div>

      {!employee.emailConfirmed && !employee.isDeleted && (
        <button
          type="button"
          disabled={isResending}
          onClick={() => onResendEmail(employee.email)}
          className="btn-ghost mt-3 flex w-full items-center justify-center gap-2 text-sm"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {isResending
            ? t("admin.resend_email_sending")
            : t("admin.resend_email")}
        </button>
      )}
    </div>
  );
};
