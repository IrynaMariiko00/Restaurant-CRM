import { AccentButton } from "@/ui/AccentButton";
import type { FormEventHandler, ReactNode } from "react";

type AuthFormCardProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitText: string;
  isLoading?: boolean;
  error?: string | null;
  hideSubmit?: boolean;
  className?: string;
  submitClassName?: string;
  children: ReactNode;
};

export const AuthFormCard = ({
  onSubmit,
  submitText,
  isLoading,
  error,
  hideSubmit = false,
  className = "",
  submitClassName = "",
  children,
}: AuthFormCardProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`auth-form-card ${className}`.trim()}
    >
      <div className="auth-form-card__fields">{children}</div>

      {error && (
        <p className="auth-form-card__error">{error}</p>
      )}

      {!hideSubmit && (
        <AccentButton
          type="submit"
          disabled={isLoading}
          className={`auth-form-card__submit ${submitClassName}`.trim()}
        >
          {submitText}
        </AccentButton>
      )}
    </form>
  );
};
