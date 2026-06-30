interface FooterStatusProps {
  statusLabel: string;
  hintText: string;
}

export const FooterStatus = ({ statusLabel, hintText }: FooterStatusProps) => (
  <div className="mt-10 flex flex-col items-center gap-4">
    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] rounded-full shadow-sm border border-[var(--border-color)]">
      <div className="w-2 h-2 bg-[var(--success-color)] rounded-full animate-pulse" />
      <span className="text-sm font-medium text-[var(--secondary-text)]">
        {statusLabel}
      </span>
    </div>
    <p className="text-xs text-[var(--secondary-text)] opacity-60 max-w-[200px] leading-relaxed">
      {hintText}
    </p>
  </div>
);
