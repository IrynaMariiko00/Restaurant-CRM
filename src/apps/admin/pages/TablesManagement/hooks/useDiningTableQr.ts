import { diningTablesApi } from "@/api/diningTables";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function useDiningTableQr(uuid: string | null, enabled: boolean) {
  const { t } = useTranslation();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !uuid) {
      setQrUrl(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      setQrUrl(null);

      try {
        const blob = await diningTablesApi.getDiningTableQrCode(uuid);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setQrUrl(objectUrl);
      } catch {
        if (!cancelled) setError(t("admin.tables_qr_error"));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [enabled, uuid, t]);

  return { qrUrl, isLoading, error };
}
