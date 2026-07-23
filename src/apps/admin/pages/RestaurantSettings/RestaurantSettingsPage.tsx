import { AdminPageShell } from "@/apps/admin/components/AdminPageShell";
import { useTranslation } from "react-i18next";

export const RestaurantSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <AdminPageShell
      title={t("admin.restaurant_title")}
      subtitle={t("admin.restaurant_desc")}
    >
      <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-light)] p-6 text-center text-sm text-[var(--secondary-text)]">
        {t("admin.coming_soon")}
      </div>
    </AdminPageShell>
  );
};
