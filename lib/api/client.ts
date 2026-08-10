import { cookies } from "next/headers";

export function buildAuthHeaders(token: string | undefined, extra?: HeadersInit): HeadersInit {
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = (await cookies()).get("access_token")?.value;
  return fetch(`${process.env.DJANGO_API_URL}${path}`, {
    ...init,
    headers: buildAuthHeaders(token, init?.headers),
    cache: "no-store",
  });
}
