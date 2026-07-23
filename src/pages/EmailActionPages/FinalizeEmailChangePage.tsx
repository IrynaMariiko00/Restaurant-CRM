import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { employeeApi } from "@/api/employee";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useEmailTokenParams } from "./hooks/useEmailTokenParams";
import { useTranslation } from "react-i18next";

export const FinalizeEmailChangePage = () => {
  const { t } = useTranslation();
  const { employeeId, uuid, isValid } = useEmailTokenParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isValid || employeeId === null) {
      setStatus("error");
      setMessage(t("email_action.invalid_link"));
      return;
    }

    let cancelled = false;

    const finalize = async () => {
      try {
        const response = await employeeApi.finalizeEmailChange({
          employeeId,
          uuid,
        });

        if (cancelled) return;

        if (!response.success) {
          setStatus("error");
          setMessage(response.errors?.[0] ?? t("email_action.email_change_error"));
          return;
        }

        setStatus("success");
        setMessage(t("email_action.email_change_success"));
      } catch {
        if (cancelled) return;
        setStatus("error");
        setMessage(t("email_action.email_change_error"));
      }
    };

    void finalize();

    return () => {
      cancelled = true;
    };
  }, [employeeId, isValid, t, uuid]);

  return (
    <AuthLayout
      title={t("email_action.email_change_title")}
      subtitle={t("email_action.email_change_subtitle")}
      footer={
        <Link
          to="/login"
          className="font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("email_action.back_to_login")}
        </Link>
      }
    >
      {status === "loading" ? (
        <div className="flex justify-center py-10">
          <Loader2
            className="h-8 w-8 animate-spin text-[var(--color-violet-blue)]"
            aria-label={t("common.waiting")}
          />
        </div>
      ) : (
        <p
          className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center text-sm ${
            status === "success"
              ? "text-[var(--success-color)]"
              : "text-[var(--error-color)]"
          }`}
        >
          {message}
        </p>
      )}
    </AuthLayout>
  );
};
