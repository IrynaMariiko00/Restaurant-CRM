import { AccentButton } from "@/ui/AccentButton";
import type { FormEventHandler, ReactNode } from "react";

type AuthFormCardProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitText: string;
  isLoading?: boolean;
  error?: string | null;
  hideSubmit?: boolean;
  children: ReactNode;
};

export const AuthFormCard = ({
  onSubmit,
  submitText,
  isLoading,
  error,
  hideSubmit = false,
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

      {!hideSubmit && (
        <AccentButton
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full"
        >
          {submitText}
        </AccentButton>
      )}
    </form>
  );
};
