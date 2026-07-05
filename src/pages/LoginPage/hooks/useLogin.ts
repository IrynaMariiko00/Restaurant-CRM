import { useAuth } from "@/context/AuthContext";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const { isAdmin } = await login(email, password);
      const defaultPath = isAdmin ? "/staff/admin" : "/staff";
      navigate(from ?? defaultPath, { replace: true });
    } catch {
      setError(t("`common`.login_error"));
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
    isLoading,
    t,
  };
};
