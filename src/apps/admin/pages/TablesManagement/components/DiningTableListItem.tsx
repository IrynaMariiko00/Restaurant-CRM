import { Loader2, QrCode } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { DiningTable } from "@/types/diningTable";
import { useDiningTableQr } from "../hooks/useDiningTableQr";

type DiningTableListItemProps = {
  table: DiningTable;
  isToggling: boolean;
  onSetActive: (id: number, isActive: boolean) => void;
};

export function DiningTableListItem({
  table,
  isToggling,
  onSetActive,
}: DiningTableListItemProps) {
  const { t } = useTranslation();
  const [showQr, setShowQr] = useState(false);
  const { qrUrl, isLoading: qrLoading, error: qrError } = useDiningTableQr(
    table.qrUuid,
    showQr && table.isActive,
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--bg-light)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[var(--primary-text)]">
            {t("admin.table_label", { id: table.id })}
          </p>
          <p className="mt-1 truncate font-mono text-xs text-[var(--secondary-text)]">
            {table.qrUuid}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            table.isActive
              ? "bg-[color-mix(in_srgb,var(--success-color),transparent_88%)] text-[var(--success-color)]"
              : "bg-[color-mix(in_srgb,var(--secondary-text),transparent_88%)] text-[var(--secondary-text)]"
          }`}
        >
          {table.isActive
            ? t("admin.table_active")
            : t("admin.table_inactive")}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
        <button
          type="button"
          className={`dining-table__action ${
            table.isActive ? "btn-ghost dining-table__off-btn" : "btn-ghost"
          }`}
          disabled={isToggling}
          onClick={() => onSetActive(table.id, !table.isActive)}
        >
          {isToggling ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : table.isActive ? (
            t("admin.tables_deactivate")
          ) : (
            t("admin.tables_activate")
          )}
        </button>
        <button
          type="button"
          className="btn-ghost dining-table__action dining-table__qr-btn"
          disabled={!table.isActive}
          onClick={() => setShowQr((open) => !open)}
        >
          <QrCode className="h-3.5 w-3.5" aria-hidden />
          {showQr ? t("admin.tables_qr_hide") : t("admin.tables_qr_show")}
        </button>
      </div>

      {showQr && (
        <div className="mt-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-center">
          {!table.isActive ? (
            <p className="text-sm text-[var(--secondary-text)]">
              {t("admin.tables_qr_inactive")}
            </p>
          ) : qrLoading ? (
            <Loader2
              className="mx-auto h-6 w-6 animate-spin text-[var(--color-violet-blue)]"
              aria-label={t("common.waiting")}
            />
          ) : qrError ? (
            <p className="text-sm text-[var(--error-color)]">{qrError}</p>
          ) : qrUrl ? (
            <img
              src={qrUrl}
              alt={t("admin.tables_qr_alt", { id: table.id })}
              className="mx-auto h-44 w-44 rounded-lg bg-white p-2"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
