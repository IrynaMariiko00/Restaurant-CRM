import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForgotPassword } from "../LoginPage/hooks/useForgotPassword";
import { ForgotPasswordModal } from "./components/ForgotPasswordModal";
import { ForgotPasswordSuccess } from "./components/ForgotPasswordSuccess";

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { email, setEmail, error, success, isLoading, handleSubmit } =
    useForgotPassword();

  return (
    <AuthLayout
      title={t("common.forgot_password-title")}
      subtitle={
        success
          ? t("common.forgot_password-success-subtitle")
          : t("common.forgot_password-subtitle")
      }
      footer={
        <Link
          to="/login"
          className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("common.forgot_password-back-link-text")}
        </Link>
      }
    >
      {success ? (
        <ForgotPasswordSuccess email={email} />
      ) : (
        <AuthFormCard
          onSubmit={handleSubmit}
          submitText={
            isLoading
              ? t("common.forgot_password-loading")
              : t("common.forgot_password-button")
          }
          isLoading={isLoading}
          error={error}
        >
          <ForgotPasswordModal email={email} setEmail={setEmail} />
        </AuthFormCard>
      )}
    </AuthLayout>
  );
};
