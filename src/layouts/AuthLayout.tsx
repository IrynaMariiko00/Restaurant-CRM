import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) => {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)] p-6">
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[var(--color-violet-blue)] opacity-[0.07] blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[var(--color-violet-blue-dark)] opacity-[0.05] blur-3xl" />

      <div className="z-10 w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="title title--s title--accent mb-2 uppercase tracking-widest">
            Restaurant CRM
          </p>
          <h1 className="title title--m title--primary">{title}</h1>
          <p className="mt-2 text-sm text-[var(--secondary-text)]">
            {subtitle}
          </p>
        </header>

        {children}

        {footer && (
          <div className="mt-6 text-center text-xs text-[var(--secondary-text)] opacity-70">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
};
