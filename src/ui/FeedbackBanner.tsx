import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { ReactNode } from "react";

export type FeedbackTone = "success" | "error";

/** Toast host item, or inline form submit error (via AuthFormCard). Not for email terminal screens. */
type FeedbackBannerProps = {
  tone: FeedbackTone;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
};

export function FeedbackBanner({
  tone,
  children,
  onClose,
  className = "",
}: FeedbackBannerProps) {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={`feedback-banner feedback-banner--${tone} ${className}`.trim()}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon className="feedback-banner__icon" aria-hidden />
      <div className="feedback-banner__body">{children}</div>
      {onClose && (
        <button
          type="button"
          className="feedback-banner__close"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
