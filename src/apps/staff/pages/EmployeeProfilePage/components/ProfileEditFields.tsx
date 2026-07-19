import { useTranslation } from "react-i18next";
import { ChangeAvatar } from "./ChangeAvatar";
import { ProfileTextField } from "./ProfileTextField";

type ProfileEditFieldsProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string | null;
  errors: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    avatar?: string | null;
  };
  onChange: (
    field: "firstName" | "lastName" | "email" | "phone",
    value: string,
  ) => void;
  onAvatarChange?: (file: File) => void;
};

export const ProfileEditFields = ({
  firstName,
  lastName,
  email,
  phone,
  avatarUrl,
  errors,
  onChange,
  onAvatarChange,
}: ProfileEditFieldsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <ChangeAvatar
        firstName={firstName}
        lastName={lastName}
        avatarUrl={avatarUrl}
        avatarError={errors.avatar}
        onAvatarChange={onAvatarChange}
      />
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
