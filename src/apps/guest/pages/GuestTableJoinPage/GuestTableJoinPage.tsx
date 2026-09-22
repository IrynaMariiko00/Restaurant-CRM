import { diningTablesApi } from "@/api/diningTables";
import { parseDiningTableUuid } from "@/shared/diningTables/parseDiningTableUuid";
import { PageLoader } from "@/ui/PageLoader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export const GuestTableJoinPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const join = async () => {
      const raw =
        searchParams.get("uuid") ??
        searchParams.get("qrUuid") ??
        searchParams.get("table") ??
        "";
      const uuid = parseDiningTableUuid(raw);

      if (!uuid) {
        setError(t("guest.table_join_invalid"));
        return;
      }

      try {
        const response = await diningTablesApi.getGuestDiningTable(uuid);
        if (cancelled) return;

        if (!response.success || !response.data) {
          setError(
            response.errors?.[0] ?? t("guest.table_join_error"),
          );
          return;
        }

        navigate(`/table/${response.data.id}`, { replace: true });
      } catch {
        if (!cancelled) setError(t("guest.table_join_error"));
      }
    };

    void join();
    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams, t]);

  if (error) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[var(--bg-primary)] px-6 text-center">
        <p className="text-sm text-[var(--error-color)]">{error}</p>
        <Link
          to="/"
          className="text-sm font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("guest.table_join_back")}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[var(--bg-primary)]">
      <PageLoader />
    </main>
  );
};
