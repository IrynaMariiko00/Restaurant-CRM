import { AccentButton } from "@/ui/AccentButton";
import { FeedbackBanner } from "@/ui/FeedbackBanner";
import type { FormEventHandler, ReactNode } from "react";

type AuthFormCardProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitText: string;
  isLoading?: boolean;
  /** Form submit error — local state only; do not also call useFeedback().error */
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
        <FeedbackBanner tone="error" className="auth-form-card__feedback">
          {error}
        </FeedbackBanner>
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
