import type { ReactNode } from "react";

type StaffScreenLayoutProps = {
  children: ReactNode;
  narrow?: boolean;
};

export const StaffScreenLayout = ({
  children,
  narrow = false,
}: StaffScreenLayoutProps) => {
  return (
    <div className={`staff-page${narrow ? " staff-page--narrow" : ""}`}>
      {children}
    </div>
  );
};
