import { Link } from "react-router-dom";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { AuthLayout } from "@/layouts/AuthLayout";
import {
  useSetPasswordFromEmail,
  type SetPasswordFlow,
} from "./hooks/useSetPasswordFromEmail";

type SetPasswordPageProps = {
  flow: SetPasswordFlow;
};

export const SetPasswordPage = ({ flow }: SetPasswordPageProps) => {
  const {
    isValid,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fieldErrors,
    submitError,
    success,
    isSubmitting,
    handleSubmit,
    t,
  } = useSetPasswordFromEmail(flow);

  const fieldError = (key: keyof typeof fieldErrors) => {
    const code = fieldErrors[key];
    return code ? t(code) : null;
  };

  const title =
    flow === "registration"
      ? t("email_action.registration_title")
      : t("email_action.reset_title");

  const subtitle =
    flow === "registration"
      ? t("email_action.registration_subtitle")
      : t("email_action.reset_subtitle");

  const successMessage =
    flow === "registration"
      ? t("email_action.registration_success")
      : t("email_action.reset_success");

  const submitLabel =
    flow === "registration"
      ? t("email_action.registration_submit")
      : t("email_action.reset_submit");

  const savingLabel =
    flow === "registration"
      ? t("email_action.registration_saving")
      : t("email_action.reset_saving");

  if (!isValid) {
    return (
      <AuthLayout
        title={title}
        subtitle={t("email_action.invalid_link")}
        footer={
          <Link
            to="/login"
            className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
          >
            {t("email_action.back_to_login")}
          </Link>
        }
      >
        <p className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center text-sm text-[var(--error-color)]">
          {t("email_action.invalid_link_hint")}
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      footer={
        <Link
          to="/login"
          className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("email_action.back_to_login")}
        </Link>
      }
    >
      {success ? (
        <div className="space-y-4">
          <p className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center text-sm text-[var(--success-color)]">
            {successMessage}
          </p>
          <Link to="/login" className="btn-accent block w-full text-center">
            {t("common.login")}
          </Link>
        </div>
      ) : (
        <AuthFormCard
          onSubmit={handleSubmit}
          submitText={isSubmitting ? savingLabel : submitLabel}
          isLoading={isSubmitting}
          error={submitError}
        >
          <PasswordField
            id="password"
            label={t("email_action.new_password")}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            hint={t("validation.password_policy_hint")}
            error={fieldError("password")}
          />
          <PasswordField
            id="confirmPassword"
            label={t("email_action.confirm_password")}
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            error={fieldError("confirmPassword")}
          />
        </AuthFormCard>
      )}
    </AuthLayout>
  );
};
