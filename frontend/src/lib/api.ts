export const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");
export const API_URL = `${API_ORIGIN}/api`;

export function resolveImageUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}
