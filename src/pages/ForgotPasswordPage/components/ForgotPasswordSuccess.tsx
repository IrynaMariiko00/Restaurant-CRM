import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type ForgotPasswordSuccessProps = {
  email: string;
};

export const ForgotPasswordSuccess = ({ email }: ForgotPasswordSuccessProps) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success-color)]/10">
        <CheckCircle2
          className="h-8 w-8 text-[var(--success-color)]"
          strokeWidth={1.75}
        />
      </div>

      <h2 className="title title--s title--primary mb-2">
        {t("common.forgot_password-success-title")}
      </h2>

      <p className="text-sm leading-relaxed text-[var(--secondary-text)]">
        {t("common.forgot_password-success", { email })}
      </p>
    </div>
  );
};
