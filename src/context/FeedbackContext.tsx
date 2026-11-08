import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FeedbackBanner,
  type FeedbackTone,
} from "@/ui/FeedbackBanner";
import { FeedbackContext, type FeedbackContextValue } from "./useFeedback";

type Toast = {
  tone: FeedbackTone;
  message: string;
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const dismiss = () => {
    clearTimer();
    setToast(null);
  };

  const push = (tone: FeedbackTone, message: string) => {
    const text = message.trim();
    if (!text) return;
    clearTimer();
    setToast({ tone, message: text });
    timerRef.current = window.setTimeout(
      dismiss,
      tone === "success" ? 4200 : 5600,
    );
  };

  const value: FeedbackContextValue = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {toast && (
        <div className="feedback-host" aria-live="polite">
          <FeedbackBanner
            tone={toast.tone}
            onClose={dismiss}
            className="feedback-host__item"
          >
            {toast.message}
          </FeedbackBanner>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
