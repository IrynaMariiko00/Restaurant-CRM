import { useTranslation } from "react-i18next";
import type { UpdateEmployeeRequest } from "@/types/employee";
import type { ProfileFormErrors } from "@/shared/validation/validators";
import { ProfileEditFields } from "./ProfileEditFields";
import { ProfileView } from "./ProfileView";

type ProfileFormProps = {
  form: UpdateEmployeeRequest;
  isEditing: boolean;
  setField: <K extends keyof UpdateEmployeeRequest>(
    key: K,
    value: UpdateEmployeeRequest[K],
  ) => void;
  emailConfirmed: boolean | null;
  avatarUrl?: string | null;
  fieldErrors: ProfileFormErrors;
  onAvatarChange?: (file: File) => void;
};

export const ProfileForm = ({
  form,
  isEditing,
  setField,
  emailConfirmed,
  avatarUrl,
  fieldErrors,
  onAvatarChange,
}: ProfileFormProps) => {
  const { t } = useTranslation();

  const errorText = (key: keyof ProfileFormErrors) => {
    const code = fieldErrors[key];
    return code ? t(code) : null;
  };

  if (!isEditing) {
    return (
      <ProfileView
        firstName={form.firstName}
        lastName={form.lastName}
        email={form.email}
        phone={form.phone}
        emailConfirmed={emailConfirmed}
        avatarUrl={avatarUrl}
      />
    );
  }

  return (
    <ProfileEditFields
      firstName={form.firstName}
      lastName={form.lastName}
      email={form.email}
      phone={form.phone}
      avatarUrl={avatarUrl}
      errors={{
        firstName: errorText("firstName"),
        lastName: errorText("lastName"),
        email: errorText("email"),
        phone: errorText("phone"),
        avatar: errorText("avatar"),
      }}
      onChange={(field, value) => setField(field, value)}
      onAvatarChange={onAvatarChange}
    />
  );
};
