import { Check, Copy, Loader2, Power, QrCode } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const { qrUrl, isLoading: qrLoading, error: qrError } = useDiningTableQr(
    table.qrUuid,
    showQr && table.isActive,
  );

  const copyUuid = async () => {
    try {
      await navigator.clipboard.writeText(table.qrUuid);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <li
      className={`dining-table-row${
        table.isActive ? "" : " dining-table-row--inactive"
      }${showQr ? " dining-table-row--open" : ""}`}
    >
      <div className="dining-table-row__main">
        <span
          className={`dining-table-row__dot${
            table.isActive
              ? " dining-table-row__dot--on"
              : " dining-table-row__dot--off"
          }`}
          aria-hidden
        />

        <div className="dining-table-row__label">
          <p className="dining-table-row__title">
            {t("admin.table_label", { id: table.id })}
          </p>
          <p className="dining-table-row__status">
            {table.isActive
              ? t("admin.table_active")
              : t("admin.table_inactive")}
          </p>
        </div>

        <div className="dining-table-row__actions">
          <button
            type="button"
            className="dining-table-row__icon-btn"
            onClick={() => void copyUuid()}
            title={
              copied
                ? t("admin.tables_uuid_copied")
                : t("admin.tables_copy_uuid")
            }
            aria-label={
              copied
                ? t("admin.tables_uuid_copied")
                : t("admin.tables_copy_uuid")
            }
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
          </button>

          <button
            type="button"
            className={`dining-table-row__icon-btn${
              table.isActive
                ? " dining-table-row__icon-btn--off"
                : " dining-table-row__icon-btn--on"
            }`}
            disabled={isToggling}
            onClick={() => onSetActive(table.id, !table.isActive)}
            title={
              table.isActive
                ? t("admin.tables_deactivate")
                : t("admin.tables_activate")
            }
            aria-label={
              table.isActive
                ? t("admin.tables_deactivate")
                : t("admin.tables_activate")
            }
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Power className="h-4 w-4" aria-hidden />
            )}
          </button>

          <button
            type="button"
            className={`dining-table-row__icon-btn dining-table-row__icon-btn--qr${
              showQr ? " is-open" : ""
            }`}
            disabled={!table.isActive}
            onClick={() => setShowQr((open) => !open)}
            title={
              showQr ? t("admin.tables_qr_hide") : t("admin.tables_qr_show")
            }
            aria-label={
              showQr ? t("admin.tables_qr_hide") : t("admin.tables_qr_show")
            }
            aria-expanded={showQr}
          >
            <QrCode className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {showQr && (
        <div className="dining-table-row__qr">
          {!table.isActive ? (
            <p className="dining-table-row__qr-note">
              {t("admin.tables_qr_inactive")}
            </p>
          ) : qrLoading ? (
            <Loader2
              className="mx-auto h-5 w-5 animate-spin text-[var(--color-violet-blue)]"
              aria-label={t("common.waiting")}
            />
          ) : qrError ? (
            <p className="text-sm text-[var(--error-color)]">{qrError}</p>
          ) : qrUrl ? (
            <img
              src={qrUrl}
              alt={t("admin.tables_qr_alt", { id: table.id })}
              className="dining-table-row__qr-img"
            />
          ) : null}
        </div>
      )}
    </li>
  );
}
