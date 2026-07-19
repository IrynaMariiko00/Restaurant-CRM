import { FieldError } from "@/shared/validation/FieldError";

type ProfileTextFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string | null;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export const ProfileTextField = ({
  id,
  label,
  value,
  error,
  type = "text",
  autoComplete,
  placeholder,
  onChange,
}: ProfileTextFieldProps) => (
  <div className="form-field">
    <label className="form-label" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`form-input${error ? " form-input--error" : ""}`}
      autoComplete={autoComplete}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
    />
    <FieldError message={error} />
  </div>
);
