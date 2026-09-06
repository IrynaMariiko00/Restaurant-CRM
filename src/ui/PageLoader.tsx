import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type PageLoaderProps = {
  className?: string;
};

export function PageLoader({ className = "" }: PageLoaderProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex justify-center py-10 ${className}`.trim()}
      role="status"
    >
      <Loader2
        className="h-8 w-8 animate-spin text-[var(--color-violet-blue)]"
        aria-label={t("common.waiting")}
      />
    </div>
  );
}
