interface FooterStatusProps {
  statusLabel: string;
  hintText: string;
}

export const FooterStatus = ({ statusLabel, hintText }: FooterStatusProps) => (
  <div className="mt-8 flex flex-col items-center gap-3">
    <div className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--bg-light),transparent_20%)] px-4 py-2 shadow-sm">
      <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--success-color)]" />
      <span className="text-sm font-medium text-[var(--secondary-text)]">
        {statusLabel}
      </span>
    </div>
    <p className="max-w-[220px] text-xs leading-relaxed text-[var(--secondary-text)] opacity-80">
      {hintText}
    </p>
  </div>
);
