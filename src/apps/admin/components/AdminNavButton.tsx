import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AdminNavButtonProps = {
  to?: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  accent?: boolean;
  disabled?: boolean;
};

export const AdminNavButton = ({
  to,
  label,
  description,
  icon: Icon,
  accent = false,
  disabled = false,
}: AdminNavButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled && to) navigate(to);
      }}
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
        disabled
          ? "cursor-not-allowed border-[var(--border-color)] bg-[var(--bg-primary)] opacity-55"
          : accent
            ? "border-[color-mix(in_srgb,var(--color-violet-blue),transparent_60%)] bg-[color-mix(in_srgb,var(--color-violet-blue),transparent_92%)] active:scale-[0.99]"
            : "border-[var(--border-color)] bg-[var(--bg-light)] hover:border-[color-mix(in_srgb,var(--color-violet-blue),transparent_70%)] active:scale-[0.99]"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          disabled
            ? "bg-[var(--bg-light)] text-[var(--secondary-text)]"
            : "bg-[color-mix(in_srgb,var(--color-violet-blue),transparent_88%)] text-[var(--color-violet-blue)]"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[var(--primary-text)]">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs text-[var(--secondary-text)]">
            {description}
          </span>
        )}
      </span>
    </button>
  );
};
