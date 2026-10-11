import { Loader2, Plus } from "lucide-react";
import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { PageLoader } from "@/ui/PageLoader";
import { DiningTableListItem } from "./components/DiningTableListItem";
import {
  type TablesActivityFilter,
  useDiningTablesList,
} from "./hooks/useDiningTablesList";

const FILTERS: TablesActivityFilter[] = ["all", "active", "inactive"];

export const TablesManagementPage = () => {
  const {
    tables,
    activityFilter,
    setActivityFilter,
    isLoading,
    loadError,
    isCreating,
    togglingId,
    createTable,
    setTableActive,
    t,
  } = useDiningTablesList();

  const emptyLabel =
    activityFilter === "active"
      ? t("admin.tables_empty_active")
      : activityFilter === "inactive"
        ? t("admin.tables_empty_inactive")
        : t("admin.tables_empty");

  return (
    <AdminPageShell
      title={t("admin.tables_title")}
      subtitle={t("admin.tables_desc")}
    >
      <div className="tables-page">
        <div className="tables-page__toolbar">
          <div
            className="tables-page__filters"
            role="tablist"
            aria-label={t("admin.tables_filter_label")}
          >
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={activityFilter === filter}
                className={`tables-page__filter${
                  activityFilter === filter
                    ? " tables-page__filter--active"
                    : ""
                }`}
                onClick={() => setActivityFilter(filter)}
              >
                {t(`admin.tables_filter_${filter}`)}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-accent tables-page__create"
            disabled={isCreating || isLoading}
            onClick={() => void createTable()}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Plus className="h-4 w-4" aria-hidden />
            )}
            {isCreating ? t("admin.tables_creating") : t("admin.tables_create")}
          </button>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : loadError ? (
          <p className="text-center text-sm text-[var(--error-color)]">
            {loadError}
          </p>
        ) : tables.length === 0 ? (
          <p className="tables-page__empty">{emptyLabel}</p>
        ) : (
          <ul className="tables-page__list">
            {tables.map((table) => (
              <DiningTableListItem
                key={table.id}
                table={table}
                isToggling={togglingId === table.id}
                onSetActive={(id, isActive) => {
                  void setTableActive(id, isActive);
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </AdminPageShell>
  );
};
