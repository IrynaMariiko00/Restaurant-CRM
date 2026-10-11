function normalizeForCompare(value: unknown): unknown {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(normalizeForCompare);
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => [key, normalizeForCompare(nested)]);
    return Object.fromEntries(entries);
  }
  return value;
}

export function stableFormEqual(a: unknown, b: unknown): boolean {
  return (
    JSON.stringify(normalizeForCompare(a)) ===
    JSON.stringify(normalizeForCompare(b))
  );
}

type UseFormSubmitGateOptions<T> = {
  values: T;
  baseline?: T;
  isComplete: boolean;
  isBusy?: boolean;
};

export function useFormSubmitGate<T>({
  values,
  baseline,
  isComplete,
  isBusy = false,
}: UseFormSubmitGateOptions<T>) {
  const isDirty = baseline === undefined || !stableFormEqual(values, baseline);
  const canSubmit = !isBusy && isComplete && isDirty;

  return { canSubmit, isDirty };
}
