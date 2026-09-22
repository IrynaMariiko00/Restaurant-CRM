import { diningTablesApi } from "@/api/diningTables";
import type { DiningTable } from "@/types/diningTable";
import { PageLoader } from "@/ui/PageLoader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useParams } from "react-router-dom";

export const GuestLayout = () => {
  const { t } = useTranslation();
  const { tableId } = useParams<{ tableId: string }>();
  const [table, setTable] = useState<DiningTable | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = Number(tableId);

    const load = async () => {
      if (!Number.isFinite(id) || id <= 0) {
        setError(t("guest.table_invalid"));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await diningTablesApi.getDiningTable(id, {
          activeRequired: true,
        });
        if (cancelled) return;

        if (!response.success || !response.data) {
          setTable(null);
          setError(response.errors?.[0] ?? t("guest.table_unavailable"));
          return;
        }

        setTable(response.data);
      } catch {
        if (!cancelled) {
          setTable(null);
          setError(t("guest.table_unavailable"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [tableId, t]);

  if (isLoading) {
    return (
      <div className="guest-layout-wrapper flex min-h-svh items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (error || !table) {
    return (
      <div className="guest-layout-wrapper flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-[var(--error-color)]">
          {error ?? t("guest.table_unavailable")}
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-[var(--color-violet-blue)] underline-offset-2 hover:underline"
        >
          {t("guest.table_join_back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="guest-layout-wrapper">
      <Outlet context={{ table }} />
    </div>
  );
};
