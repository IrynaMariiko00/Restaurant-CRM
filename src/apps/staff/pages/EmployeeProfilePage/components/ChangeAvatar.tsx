import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FieldError } from "@/shared/validation/FieldError";

type ChangeAvatarProps = {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  avatarError?: string | null;
  onAvatarChange?: (file: File) => void;
  className?: string;
  size?: "md" | "lg";
};

export const ChangeAvatar = ({
  firstName,
  lastName,
  avatarUrl,
  avatarError,
  onAvatarChange,
  className = "",
  size = "md",
}: ChangeAvatarProps) => {
  const { t } = useTranslation();
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
  const isLarge = size === "lg";

  return (
    <div className={`flex flex-col items-center pb-2 ${className}`.trim()}>
      <div className="relative">
        <div
          className={`flex items-center justify-center overflow-hidden rounded-full bg-[var(--color-violet-blue)] font-bold text-white shadow-lg shadow-[color-mix(in_srgb,var(--color-violet-blue),transparent_70%)] ${
            isLarge
              ? "h-36 w-36 text-5xl sm:h-40 sm:w-40"
              : "h-24 w-24 text-3xl"
          }`}
        >
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
          className={`absolute right-0 bottom-0 flex cursor-pointer items-center justify-center rounded-full border-2 border-[var(--bg-light)] bg-[var(--color-violet-blue)] text-white shadow-md transition hover:brightness-110 active:scale-95 ${
            isLarge ? "h-11 w-11" : "h-9 w-9"
          }`}
          title={t("staff.change_avatar")}
        >
          <Camera
            className={isLarge ? "h-5 w-5" : "h-4 w-4"}
            strokeWidth={2}
            aria-hidden
          />
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
