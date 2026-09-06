import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  tone?: "default" | "danger";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onCancel();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-dialog" role="presentation">
      <button
        type="button"
        className="confirm-dialog__backdrop"
        aria-label={cancelLabel}
        disabled={isLoading}
        onClick={() => {
          if (!isLoading) onCancel();
        }}
      />
      <div
        className="confirm-dialog__panel"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <button
          type="button"
          className="confirm-dialog__close"
          aria-label={cancelLabel}
          disabled={isLoading}
          onClick={() => {
            if (!isLoading) onCancel();
          }}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        <h2 id={titleId} className="confirm-dialog__title">
          {title}
        </h2>
        {description && (
          <div id={descriptionId} className="confirm-dialog__description">
            {description}
          </div>
        )}
        <div className="confirm-dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="btn-ghost"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={tone === "danger" ? "btn-danger" : "btn-accent"}
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {confirmLabel}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
