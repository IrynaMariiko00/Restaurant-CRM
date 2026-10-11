import { useTranslation } from "react-i18next";

type ForgotPasswordSuccessProps = {
  email: string;
};

export const ForgotPasswordSuccess = ({ email }: ForgotPasswordSuccessProps) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center shadow-sm">
      <h2 className="title title--s title--primary mb-2">
        {t("common.forgot_password-success-title")}
      </h2>
      <p className="text-sm leading-relaxed text-[var(--secondary-text)]">
        {t("common.forgot_password-success", { email })}
      </p>
    </div>
  );
};
