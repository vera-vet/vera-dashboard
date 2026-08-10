export function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(normalized));
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

export function isExpiringSoon(exp: number | null, marginSeconds = 30): boolean {
  if (exp === null) return true;
  return Date.now() / 1000 >= exp - marginSeconds;
}
