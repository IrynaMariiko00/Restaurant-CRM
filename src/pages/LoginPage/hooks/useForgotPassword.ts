import { authApi } from "@/api/auth";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

export const useForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const response = await authApi.startPasswordReset({ email });
      if (!response.success) throw new Error();
      setSuccess(true);
    } catch {
      setError(t("common.forgot_password-error"));
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, error, success, isLoading, handleSubmit };
};
