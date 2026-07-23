import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StaffScreenLayout } from "@/layouts/StaffScreenLayout";

type AdminPageShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export const AdminPageShell = ({
  title,
  subtitle,
  children,
}: AdminPageShellProps) => {
  const { t } = useTranslation();

  return (
    <StaffScreenLayout>
      <header className="mb-6 text-center">
        <p className="title title--s title--accent mb-2 uppercase tracking-widest">
          Restaurant CRM
        </p>
        <h1 className="title title--m title--primary">{title}</h1>
        <p className="mt-2 text-sm text-[var(--secondary-text)]">{subtitle}</p>
      </header>

      {children}

      <div className="mt-8 text-center">
        <Link
          to="/staff"
          className="text-sm font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("staff.back_to_home")}
        </Link>
      </div>
    </StaffScreenLayout>
  );
};
