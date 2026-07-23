import { Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FieldError } from "@/shared/validation/FieldError";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string | null;
  hint?: string | null;
  labelAction?: ReactNode;
};

export const PasswordField = ({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error,
  hint,
  labelAction,
}: PasswordFieldProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="form-field">
      {labelAction ? (
        <div className="flex justify-between">
          <label className="form-label" htmlFor={id}>
            {label}
          </label>
          {labelAction}
        </div>
      ) : (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}

      <div className="form-input-wrapper">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`form-input form-input--with-toggle${error ? " form-input--error" : ""}`}
        />
        <button
          type="button"
          className="form-input-toggle"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={
            isVisible ? t("common.hide_password") : t("common.show_password")
          }
        >
          {isVisible ? (
            <EyeOff className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <Eye className="h-5 w-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {hint && (
        <p className="mt-1.5 text-xs text-[var(--secondary-text)]">{hint}</p>
      )}
      <FieldError message={error} />
    </div>
  );
};
