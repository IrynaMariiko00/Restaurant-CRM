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
  fieldErrors: ProfileFormErrors;
};

export const ProfileForm = ({
  form,
  isEditing,
  setField,
  emailConfirmed,
  fieldErrors,
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
      />
    );
  }

  return (
    <ProfileEditFields
      firstName={form.firstName}
      lastName={form.lastName}
      email={form.email}
      phone={form.phone}
      errors={{
        firstName: errorText("firstName"),
        lastName: errorText("lastName"),
        email: errorText("email"),
        phone: errorText("phone"),
      }}
      onChange={(field, value) => setField(field, value)}
    />
  );
};
