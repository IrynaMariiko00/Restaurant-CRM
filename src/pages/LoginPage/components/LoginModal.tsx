import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

      <div className="form-field">
        <div className="flex justify-between">
          <label className="form-label" htmlFor="password">
            {t("common.password")}
          </label>
          <Link
            className="form-label hover:!text-[var(--accent-text)]"
            to="/forgot-password"
          >
            {t("common.forgot_password-link")}
          </Link>
        </div>
        <div className="form-input-wrapper">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input form-input--with-toggle"
            placeholder="••••••••"
          />
          <button
            type="button"
            className="form-input-toggle"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            aria-label={
              isPasswordVisible
                ? t("common.hide_password")
                : t("common.show_password")
            }
          >
            {isPasswordVisible ? (
              <EyeOff className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Eye className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
