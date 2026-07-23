export type ValidationResult = string | null;

const NAME_PATTERN = /^[\p{L}'’\- ]+$/u;

const UA_PHONE_DIGITS = /^(?:\+?380|0)(\d{9})$/;

export function validateRequired(value: string): ValidationResult {
  if (!value.trim()) return "validation.required";
  return null;
}

export function validateName(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return "validation.required";
  if (trimmed.length < 2) return "validation.name_min";
  if (trimmed.length > 50) return "validation.name_max";
  if (!NAME_PATTERN.test(trimmed)) return "validation.name_format";
  return null;
}

export function validateEmail(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return "validation.required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "validation.email_format";
  }
  return null;
}

/** Strip spaces, dashes, parentheses. */
export function normalizePhoneInput(value: string): string {
  return value.replace(/[\s\-()]/g, "");
}

/**
 * Accepts UA numbers with or without +38 / leading 0.
 * Returns local format 0XXXXXXXXX (what the backend expects).
 */
export function normalizeUaPhone(value: string): string | null {
  const digits = normalizePhoneInput(value);
  const match = digits.match(UA_PHONE_DIGITS);
  if (!match) return null;
  return `0${match[1]}`;
}

export function validateUaPhone(value: string): ValidationResult {
  if (!value.trim()) return "validation.required";
  if (!normalizeUaPhone(value)) return "validation.phone_ua";
  return null;
}

export function validatePasswordPolicy(value: string): ValidationResult {
  if (!value) return "validation.required";
  if (value.length < 8) return "validation.password_policy";
  if (!/[A-Z]/.test(value)) return "validation.password_policy";
  if (!/[a-z]/.test(value)) return "validation.password_policy";
  if (!/\d/.test(value)) return "validation.password_policy";
  if (!/[^A-Za-z0-9]/.test(value)) return "validation.password_policy";
  return null;
}

export type ChangePasswordFormErrors = Partial<
  Record<"currentPassword" | "newPassword" | "confirmPassword", string>
>;

export function validateChangePasswordForm(values: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): ChangePasswordFormErrors {
  const errors: ChangePasswordFormErrors = {};

  const currentPassword = validateRequired(values.currentPassword);
  if (currentPassword) errors.currentPassword = currentPassword;

  const newPassword = validatePasswordPolicy(values.newPassword);
  if (newPassword) errors.newPassword = newPassword;

  const confirmPassword = validatePasswordPolicy(values.confirmPassword);
  if (confirmPassword) errors.confirmPassword = confirmPassword;

  if (
    !errors.newPassword &&
    !errors.confirmPassword &&
    values.newPassword !== values.confirmPassword
  ) {
    errors.confirmPassword = "validation.password_mismatch";
  }

  return errors;
}

export type SetPasswordFormErrors = Partial<
  Record<"password" | "confirmPassword", string>
>;

export function validateSetPasswordForm(values: {
  password: string;
  confirmPassword: string;
}): SetPasswordFormErrors {
  const errors: SetPasswordFormErrors = {};

  const password = validatePasswordPolicy(values.password);
  if (password) errors.password = password;

  const confirmPassword = validatePasswordPolicy(values.confirmPassword);
  if (confirmPassword) errors.confirmPassword = confirmPassword;

  if (
    !errors.password &&
    !errors.confirmPassword &&
    values.password !== values.confirmPassword
  ) {
    errors.confirmPassword = "validation.password_mismatch";
  }

  return errors;
}

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ProfileFormErrors = Partial<
  Record<keyof ProfileFormValues | "avatar", string>
>;

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

export function validateProfilePicture(file: File): ValidationResult {
  if (!AVATAR_MIME_TYPES.has(file.type)) {
    return "validation.avatar_format";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return "validation.avatar_size";
  }
  return null;
}

export function validateProfileForm(
  values: ProfileFormValues,
): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  const firstName = validateName(values.firstName);
  if (firstName) errors.firstName = firstName;

  const lastName = validateName(values.lastName);
  if (lastName) errors.lastName = lastName;

  const email = validateEmail(values.email);
  if (email) errors.email = email;

  const phone = validateUaPhone(values.phone);
  if (phone) errors.phone = phone;

  return errors;
}
