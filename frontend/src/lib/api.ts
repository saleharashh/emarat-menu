export const API_ORIGIN = (
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_API_URL as string | undefined) ||
  (typeof window !== "undefined" && window.location.hostname.includes("railway.app")
    ? "https://emarat-backend-production.up.railway.app"
    : "")
).replace(/\/+$/, "");

export const API_URL = API_ORIGIN ? `${API_ORIGIN}/api` : "/api";

export function resolveImageUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}
