import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Employee } from "@/types/employee";

type EmployeeListItemProps = {
  employee: Employee;
  isCurrentUser?: boolean;
  isResending: boolean;
  onResendEmail: (email: string) => void;
};

export const EmployeeListItem = ({
  employee,
  isCurrentUser = false,
  isResending,
  onResendEmail,
}: EmployeeListItemProps) => {
  const { t } = useTranslation();
  const initials =
    `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase() ||
    "?";
  const canResend = !employee.emailConfirmed && !employee.isDeleted;

  return (
    <div className="employee-card">
      {canResend && (
        <button
          type="button"
          disabled={isResending}
          onClick={() => onResendEmail(employee.email)}
          className="employee-card__resend"
          title={
            isResending
              ? t("admin.resend_email_sending")
              : t("admin.resend_email")
          }
          aria-label={
            isResending
              ? t("admin.resend_email_sending")
              : t("admin.resend_email")
          }
        >
          <Mail className="employee-card__resend-icon" aria-hidden />
        </button>
      )}

      <div className="employee-card__head">
        <div className="employee-card__avatar" aria-hidden>
          {initials}
        </div>
        <div className="employee-card__meta">
          <p className="employee-card__name">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="employee-card__email">{employee.email}</p>
          <p className="employee-card__phone">
            {employee.phone?.trim() ? employee.phone : "\u00A0"}
          </p>
          <div className="employee-card__chips">
            {isCurrentUser && (
              <span className="employee-card__chip employee-card__chip--you">
                {t("admin.you_chip")}
              </span>
            )}
            <span
              className={`employee-card__chip${
                employee.emailConfirmed
                  ? " employee-card__chip--ok"
                  : " employee-card__chip--pending"
              }`}
            >
              {employee.emailConfirmed ? (
                <CheckCircle2 className="employee-card__chip-icon" aria-hidden />
              ) : (
                <AlertCircle className="employee-card__chip-icon" aria-hidden />
              )}
              {employee.emailConfirmed
                ? t("staff.email_confirmed")
                : t("staff.email_unconfirmed")}
            </span>
            {employee.isDeleted && (
              <span className="employee-card__chip employee-card__chip--deleted">
                {t("admin.user_deleted")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
