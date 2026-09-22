import type { ReactNode } from "react";

type AdminPageShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  narrow?: boolean;
};

export const AdminPageShell = ({
  title,
  subtitle,
  children,
  narrow = false,
}: AdminPageShellProps) => {
  return (
    <div className={`staff-page${narrow ? " staff-page--narrow" : ""}`}>
      <header className="staff-page__header">
        <p className="staff-page__eyebrow">Restaurant CRM</p>
        <h1 className="staff-page__title">{title}</h1>
        <p className="staff-page__subtitle">{subtitle}</p>
      </header>
      {children}
    </div>
  );
};
