import type { ReactNode } from "react";

type ProfileDetailProps = {
  icon: ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
};

export const ProfileDetail = ({
  icon,
  label,
  value,
  isLast,
}: ProfileDetailProps) => (
  <div
    className={`flex items-start gap-3 px-4 py-3.5 ${
      isLast ? "" : "border-b border-[var(--border-color)]"
    }`}
  >
    <span className="mt-0.5 text-[var(--color-violet-blue)]">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-[var(--secondary-text)]">{label}</p>
      <p className="truncate text-sm font-medium text-[var(--primary-text)]">
        {value || "—"}
      </p>
    </div>
  </div>
);
