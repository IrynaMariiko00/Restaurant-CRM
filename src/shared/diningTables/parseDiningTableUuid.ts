const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

export function parseDiningTableUuid(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  if (UUID_RE.test(value) && value.length <= 40) {
    const match = value.match(UUID_RE);
    return match?.[0] ?? null;
  }

  try {
    const url = new URL(value);
    const fromQuery =
      url.searchParams.get("uuid") ??
      url.searchParams.get("qrUuid") ??
      url.searchParams.get("table");
    if (fromQuery && UUID_RE.test(fromQuery)) {
      return fromQuery.match(UUID_RE)?.[0] ?? null;
    }

    const pathMatch = url.pathname.match(UUID_RE);
    if (pathMatch) return pathMatch[0];
  } catch {
    // not a URL — fall through
  }

  const embedded = value.match(UUID_RE);
  return embedded?.[0] ?? null;
}
