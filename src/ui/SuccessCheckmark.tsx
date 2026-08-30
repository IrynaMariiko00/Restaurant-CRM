import { CheckCircle2 } from "lucide-react";

type SuccessCheckmarkProps = {
  className?: string;
};

export function SuccessCheckmark({ className = "" }: SuccessCheckmarkProps) {
  return (
    <div
      className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success-color)]/10 ${className}`}
      aria-hidden
    >
      <CheckCircle2
        className="h-8 w-8 text-[var(--success-color)]"
        strokeWidth={1.75}
      />
    </div>
  );
}
