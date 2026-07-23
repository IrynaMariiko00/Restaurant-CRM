import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { useTranslation } from "react-i18next";

export const ScheduleManagementPage = () => {
  const { t } = useTranslation();

  return (
    <AdminPageShell
      title={t("admin.schedule_title")}
      subtitle={t("admin.schedule_desc")}
    >
      <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center text-sm text-[var(--secondary-text)]">
        {t("admin.coming_soon")}
      </div>
    </AdminPageShell>
  );
};
