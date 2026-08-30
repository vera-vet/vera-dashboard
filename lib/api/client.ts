import { cookies } from "next/headers";

export function buildAuthHeaders(token: string | undefined, extra?: HeadersInit): HeadersInit {
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
}

export function buildAuthHeadersForBody(
  token: string | undefined,
  body: BodyInit | null | undefined,
  extra?: HeadersInit,
): HeadersInit {
  if (body instanceof FormData) {
    return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }
  return buildAuthHeaders(token, extra);
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = (await cookies()).get("access_token")?.value;
  return fetch(`${process.env.DJANGO_API_URL}${path}`, {
    ...init,
    headers: buildAuthHeadersForBody(token, init?.body, init?.headers),
    cache: "no-store",
  });
}
