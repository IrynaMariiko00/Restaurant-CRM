import { AccentButton } from "@/ui/AccentButton";
import type { FormEventHandler, ReactNode } from "react";

type AuthFormCardProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitText: string;
  isLoading?: boolean;
  error?: string | null;
  children: ReactNode;
};

export const AuthFormCard = ({
  onSubmit,
  submitText,
  isLoading,
  error,
  children,
}: AuthFormCardProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-light)] p-6 shadow-sm"
    >
      <div className="space-y-4">{children}</div>

      {error && (
        <p className="mt-4 text-sm text-[var(--error-color)]">{error}</p>
      )}

      <AccentButton type="submit" disabled={isLoading} className="mt-6 w-full">
        {submitText}
      </AccentButton>
    </form>
  );
};
