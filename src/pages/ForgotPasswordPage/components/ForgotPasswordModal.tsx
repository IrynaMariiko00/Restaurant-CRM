import { useTranslation } from "react-i18next";

type ForgotPasswordModalProps = {
  email: string;
  setEmail: (email: string) => void;
};

export const ForgotPasswordModal = ({
  email,
  setEmail,
}: ForgotPasswordModalProps) => {
  const { t } = useTranslation();
  return (
    <div className="form-field">
      <label className="form-label" htmlFor="reset-email">
        {t("common.email")}
      </label>
      <input
        id="reset-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="form-input"
        placeholder="name@restaurant.com"
      />
    </div>
  );
};
