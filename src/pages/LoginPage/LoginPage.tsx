import { Link } from "react-router-dom";
import { useLogin } from "./hooks/useLogin";
import { LoginModal } from "./components/LoginModal";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthFormCard } from "@/components/auth/AuthFormCard";

export const LoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
    isLoading,
    t,
  } = useLogin();

  return (
    <AuthLayout
      title={t("common.login")}
      subtitle={t("common.login_subtitle")}
      footer={
        <>
          {t("common.guest_hint")}{" "}
          <Link
            to="/"
            className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
          >
            {t("common.guest_link")}
          </Link>
        </>
      }
    >
      <AuthFormCard
        onSubmit={handleSubmit}
        submitText={isLoading ? t("common.logging_in") : t("common.login")}
        isLoading={isLoading}
        error={error}
      >
        <LoginModal
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      </AuthFormCard>
    </AuthLayout>
  );
};
