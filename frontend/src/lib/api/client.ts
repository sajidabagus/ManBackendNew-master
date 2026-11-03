import axios from "axios";
import { clearAuthToken, getAuthToken } from "@/lib/auth-token";
import { normalizeMediaUrl } from "@/lib/media-url";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === "object") {
      res.data = fixMediaUrls(res.data);
    }
    return res;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearAuthToken();
      const path = window.location.pathname;
      if (!path.startsWith("/admin/login")) {
        window.location.href = "/admin/login?session=expired";
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      return "Tidak dapat terhubung ke API. Pastikan backend berjalan (php artisan serve) di port 8000.";
    }
    if (error.response?.status === 401) {
      return "Sesi login habis. Silakan login ulang.";
    }
    if (error.response?.status === 403) {
      return (
        error.response?.data?.message ??
        "Akses ditolak. Role akun ini belum punya izin pengaduan. Di server jalankan: php artisan migrate (atau db:seed --class=RolePermissionSeeder), lalu login ulang."
      );
    }
    const errors = error.response?.data?.errors;
    return (
      error.response?.data?.message ??
      errors?.captcha_answer?.[0] ??
      errors?.email?.[0] ??
      error.message ??
      "Terjadi kesalahan."
    );
  }
  return "Terjadi kesalahan.";
}

const MEDIA_URL_KEYS = new Set([
  "thumbnail_url",
  "image_url",
  "url",
]);

function fixMediaUrls<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => fixMediaUrls(item)) as T;
  }

  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (MEDIA_URL_KEYS.has(key) && typeof val === "string") {
        out[key] = normalizeMediaUrl(val) ?? val;
      } else {
        out[key] = fixMediaUrls(val);
      }
    }
    return out as T;
  }

  return value;
}
