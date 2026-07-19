import { CheckCircle2, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProfileDetail } from "./ProfileDetail";

type ProfileViewProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailConfirmed: boolean | null;
  avatarUrl?: string | null;
};

export const ProfileView = ({
  firstName,
  lastName,
  email,
  phone,
  emailConfirmed,
  avatarUrl,
}: ProfileViewProps) => {
  const { t } = useTranslation();
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--color-violet-blue)] text-2xl font-bold text-white shadow-lg shadow-[color-mix(in_srgb,var(--color-violet-blue),transparent_70%)]">
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
        <h2 className="title title--m title--primary">
          {firstName} {lastName}
        </h2>
        {emailConfirmed !== null && (
          <span
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              emailConfirmed
                ? "bg-[color-mix(in_srgb,var(--success-color),transparent_88%)] text-[var(--success-color)]"
                : "bg-[var(--bg-primary)] text-[var(--secondary-text)]"
            }`}
          >
            {emailConfirmed && <CheckCircle2 className="h-3.5 w-3.5" />}
            {emailConfirmed
              ? t("staff.email_confirmed")
              : t("staff.email_unconfirmed")}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
        <ProfileDetail
          icon={<Mail className="h-4 w-4" />}
          label={t("common.email")}
          value={email}
        />
        <ProfileDetail
          icon={<Phone className="h-4 w-4" />}
          label={t("staff.phone")}
          value={phone}
          isLast
        />
      </div>
    </div>
  );
};
