import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PasswordField } from "@/components/auth/PasswordField";

type LoginModalProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
};

export const LoginModal = ({
  email,
  setEmail,
  password,
  setPassword,
}: LoginModalProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="form-field">
        <label className="form-label" htmlFor="email">
          {t("common.email")}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          placeholder="name@restaurant.com"
        />
      </div>

      <PasswordField
        id="password"
        label={t("common.password")}
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        labelAction={
          <Link
            className="form-label hover:!text-[var(--accent-text)]"
            to="/forgot-password"
          >
            {t("common.forgot_password-link")}
          </Link>
        }
      />
    </>
  );
};
