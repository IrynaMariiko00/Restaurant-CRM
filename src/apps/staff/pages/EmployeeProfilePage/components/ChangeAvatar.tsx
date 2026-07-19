import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FieldError } from "@/shared/validation/FieldError";

type ChangeAvatarProps = {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  avatarError?: string | null;
  onAvatarChange?: (file: File) => void;
};

export const ChangeAvatar = ({
  firstName,
  lastName,
  avatarUrl,
  avatarError,
  onAvatarChange,
}: ChangeAvatarProps) => {
  const { t } = useTranslation();
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center pb-2">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--color-violet-blue)] text-3xl font-bold text-white shadow-lg shadow-[color-mix(in_srgb,var(--color-violet-blue),transparent_70%)]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <label
          htmlFor="avatar-upload"
          className="absolute right-0 bottom-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--bg-light)] bg-[var(--color-violet-blue)] text-white shadow-md transition hover:brightness-110 active:scale-95"
          title={t("staff.change_avatar")}
        >
          <Camera className="h-4 w-4" strokeWidth={2} aria-hidden />
          <span className="sr-only">{t("staff.change_avatar")}</span>
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onAvatarChange?.(file);
            e.target.value = "";
          }}
        />
      </div>

      <p className="mt-3 text-xs text-[var(--secondary-text)]">
        {t("staff.change_avatar_hint")}
      </p>
      <FieldError message={avatarError} />
    </div>
  );
};
