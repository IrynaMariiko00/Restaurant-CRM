import { diningTablesApi } from "@/api/diningTables";
import { useFeedback } from "@/context/FeedbackContext";
import type { DiningTable } from "@/types/diningTable";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type TablesActivityFilter = "all" | "active" | "inactive";

export function useDiningTablesList() {
  const { t } = useTranslation();
  const feedback = useFeedback();
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [activityFilter, setActivityFilter] =
    useState<TablesActivityFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const loadTables = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await diningTablesApi.getDiningTables({
        page: 0,
        size: 50,
        sort: "id,asc",
        ...(activityFilter === "active" ? { activeRequired: true } : {}),
      });

      if (!response.success || !response.data) {
        setTables([]);
        setLoadError(response.errors?.[0] ?? t("admin.tables_load_error"));
        return;
      }

      const items =
        activityFilter === "inactive"
          ? response.data.items.filter((table) => !table.isActive)
          : response.data.items;

      setTables(items);
    } catch {
      setTables([]);
      setLoadError(t("admin.tables_load_error"));
    } finally {
      setIsLoading(false);
    }
  }, [activityFilter, t]);

  useEffect(() => {
    void loadTables();
  }, [loadTables]);

  const createTable = useCallback(async () => {
    setIsCreating(true);

    try {
      const response = await diningTablesApi.createDiningTable();

      if (!response.success || !response.data) {
        feedback.error(
          response.errors?.[0] ?? t("admin.tables_create_error"),
        );
        return;
      }

      const created = response.data;
      feedback.success(t("admin.tables_create_success"));

      if (activityFilter === "inactive") {
        return;
      }

      setTables((prev) => [...prev, created].sort((a, b) => a.id - b.id));
    } catch {
      feedback.error(t("admin.tables_create_error"));
    } finally {
      setIsCreating(false);
    }
  }, [activityFilter, feedback, t]);

  const setTableActive = useCallback(
    async (id: number, isActive: boolean) => {
      setTogglingId(id);

      try {
        const response = await diningTablesApi.updateDiningTableActivity(
          id,
          isActive,
        );

        if (!response.success || !response.data) {
          feedback.error(
            response.errors?.[0] ?? t("admin.tables_toggle_error"),
          );
          return;
        }

        const updated = response.data;
        setTables((prev) => {
          const fitsFilter =
            activityFilter === "all" ||
            (activityFilter === "active" && updated.isActive) ||
            (activityFilter === "inactive" && !updated.isActive);

          if (!fitsFilter) {
            return prev.filter((table) => table.id !== id);
          }

          return prev.map((table) => (table.id === id ? updated : table));
        });
      } catch {
        feedback.error(t("admin.tables_toggle_error"));
      } finally {
        setTogglingId(null);
      }
    },
    [activityFilter, feedback, t],
  );

  return {
    tables,
    activityFilter,
    setActivityFilter,
    isLoading,
    loadError,
    isCreating,
    togglingId,
    createTable,
    setTableActive,
    reload: loadTables,
    t,
  };
}
