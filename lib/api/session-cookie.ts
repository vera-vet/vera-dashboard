export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
} as const;

export function accessCookieOptions() {
  return { ...SESSION_COOKIE_OPTIONS, secure: process.env.NODE_ENV === "production" };
}
