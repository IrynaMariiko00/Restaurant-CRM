import { useTranslation } from "react-i18next";
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

type ProfileEditFieldsProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  errors: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  onChange: (field: "firstName" | "lastName" | "email" | "phone", value: string) => void;
};

export const ProfileEditFields = ({
  firstName,
  lastName,
  email,
  phone,
  errors,
  onChange,
}: ProfileEditFieldsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <ProfileTextField
        id="firstName"
        label={t("staff.first_name")}
        value={firstName}
        error={errors.firstName}
        autoComplete="given-name"
        onChange={(value) => onChange("firstName", value)}
      />
      <ProfileTextField
        id="lastName"
        label={t("staff.last_name")}
        value={lastName}
        error={errors.lastName}
        autoComplete="family-name"
        onChange={(value) => onChange("lastName", value)}
      />
      <ProfileTextField
        id="email"
        label={t("common.email")}
        value={email}
        error={errors.email}
        type="email"
        autoComplete="email"
        onChange={(value) => onChange("email", value)}
      />
      <ProfileTextField
        id="phone"
        label={t("staff.phone")}
        value={phone}
        error={errors.phone}
        type="tel"
        autoComplete="tel"
        placeholder="0XXXXXXXXX або +380XXXXXXXXX"
        onChange={(value) => onChange("phone", value)}
      />
    </div>
  );
};
