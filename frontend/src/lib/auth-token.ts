/** Shared token helpers (no axios import — safe for interceptors). */

const TOKEN_KEY = "man2_admin_token";
const PERSIST_KEY = "man2-admin-auth";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const direct = localStorage.getItem(TOKEN_KEY);
  if (direct) return direct;

  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { token?: string } };
      return parsed?.state?.token ?? null;
    }
  } catch {
    // ignore
  }

  return null;
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("man2_admin_user");
  localStorage.removeItem(PERSIST_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
