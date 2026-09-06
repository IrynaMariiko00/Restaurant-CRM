/**
 * defaultLanguage ≈ English, secondLanguage ≈ Ukrainian (app convention).
 */
export function prefersUkrainian(language?: string | null) {
  return (language ?? "").toLowerCase().startsWith("uk");
}

export function pickLocalizedText(
  language: string | null | undefined,
  defaultValue?: string | null,
  secondValue?: string | null,
) {
  const defaultText = defaultValue?.trim() || "";
  const secondText = secondValue?.trim() || "";

  if (prefersUkrainian(language)) {
    return secondText || defaultText;
  }
  return defaultText || secondText;
}
