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
      <button
        type="button"
        className="btn-accent mb-8 inline-flex w-fit items-center justify-center gap-2"
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

      <div
        className="mb-4 grid grid-cols-3 gap-2"
        role="tablist"
        aria-label={t("admin.tables_filter_label")}
      >
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={activityFilter === filter}
            className={`rounded-xl border px-2 py-2 text-center text-xs font-semibold transition sm:text-sm ${
              activityFilter === filter
                ? "border-[var(--color-violet-blue)] bg-[color-mix(in_srgb,var(--color-violet-blue),transparent_90%)] text-[var(--color-violet-blue)]"
                : "border-[var(--border-color)] bg-[var(--bg-light)] text-[var(--secondary-text)] hover:border-[color-mix(in_srgb,var(--color-violet-blue),transparent_55%)]"
            }`}
            onClick={() => setActivityFilter(filter)}
          >
            {t(`admin.tables_filter_${filter}`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoader />
      ) : loadError ? (
        <p className="text-center text-sm text-[var(--error-color)]">
          {loadError}
        </p>
      ) : tables.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center text-sm text-[var(--secondary-text)]">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>
      )}
    </AdminPageShell>
  );
};
