const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const STORAGE_ORIGIN = (
  process.env.NEXT_PUBLIC_STORAGE_URL ?? `${API_ORIGIN}/storage`
).replace(/\/$/, "");

/** Next/Image hanya whitelist unsplash + localhost; file storage Laravel harus unoptimized. */
export function shouldUnoptimizeMedia(src?: string | null): boolean {
  if (!src) return false;
  return /\/storage\/|localhost|127\.0\.0\.1/.test(src);
}

/** Ubah path/URL storage Laravel menjadi URL absolut yang bisa di-load browser. */
export function normalizeMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // Path relatif dari DB, mis. "settings/abc.jpg"
  if (!trimmed.startsWith("http") && !trimmed.startsWith("/")) {
    return `${STORAGE_ORIGIN}/${trimmed.replace(/^\/+/, "")}`;
  }

  // Path absolut tanpa host, mis. "/storage/settings/abc.jpg"
  if (trimmed.startsWith("/storage/")) {
    return `${STORAGE_ORIGIN}${trimmed.replace(/^\/storage/, "")}`;
  }

  // URL penuh — pakai origin dari env supaya port/host konsisten
  if (trimmed.includes("/storage/")) {
    const path = trimmed.split("/storage/")[1];
    if (path) {
      return `${STORAGE_ORIGIN}/${path.replace(/^\/+/, "")}`;
    }
  }

  // Perbaiki localhost tanpa port (APP_URL salah)
  if (trimmed.startsWith("http://localhost/storage")) {
    return trimmed.replace("http://localhost", API_ORIGIN);
  }

  if (trimmed.startsWith("http://127.0.0.1/storage")) {
    return trimmed.replace("http://127.0.0.1", API_ORIGIN.replace("localhost", "127.0.0.1"));
  }

  return trimmed;
}

const SETTING_IMAGE_KEYS = new Set([
  "school_logo",
  "hero_image",
  "org_chart_image",
  "principal_photo",
  "integrity_image",
]);

/** Normalisasi URL gambar di grouped settings dari API publik. */
export function normalizeSettingsMedia(
  settings: Record<string, Record<string, string>>,
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};

  for (const [group, items] of Object.entries(settings)) {
    out[group] = { ...items };
    for (const [key, value] of Object.entries(items)) {
      if (SETTING_IMAGE_KEYS.has(key) || value?.includes("storage/")) {
        out[group][key] = normalizeMediaUrl(value) ?? value;
      }
    }
  }

  return out;
}
