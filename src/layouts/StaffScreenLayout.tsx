import type { ReactNode } from "react";

type StaffScreenLayoutProps = {
  children: ReactNode;
};

export const StaffScreenLayout = ({ children }: StaffScreenLayoutProps) => {
  return (
    <main className="mx-auto flex min-h-svh max-w-[430px] flex-col bg-[var(--bg-primary)] p-6">
      <div className="my-auto flex w-full flex-col">{children}</div>
    </main>
  );
};
