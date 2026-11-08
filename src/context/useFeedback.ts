import { createContext, useContext } from "react";

export type FeedbackContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

export const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return ctx;
}
