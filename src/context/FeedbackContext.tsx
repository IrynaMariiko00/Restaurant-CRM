import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  FeedbackBanner,
  type FeedbackTone,
} from "@/ui/FeedbackBanner";

type Toast = {
  tone: FeedbackTone;
  message: string;
};

/**
 * Transient toasts for background / list actions (create table, resend email, save+navigate).
 *
 * Do NOT use for form submit errors — keep those in local state and pass to
 * AuthFormCard `error` / inline FeedbackBanner so the message stays next to the form.
 * Do NOT call both channels for the same failure.
 */
type FeedbackContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

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

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return ctx;
}
