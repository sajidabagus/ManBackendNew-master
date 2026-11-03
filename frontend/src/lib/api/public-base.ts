function stripApiBase(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export function getBrowserApiBaseUrl(): string {
  return stripApiBase(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api");
}

/** URL API untuk SSR. Coba beberapa kandidat karena VPS sering gagal "hairpin" ke domain sendiri. */
export function getServerApiBaseCandidates(): string[] {
  const publicUrl = getBrowserApiBaseUrl().replace("://localhost", "://127.0.0.1");
  const raw = [
    process.env.API_INTERNAL_URL,
    process.env.API_URL,
    publicUrl,
    "http://127.0.0.1/api",
    "http://127.0.0.1:8000/api",
  ];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (!item) continue;
    const url = stripApiBase(item).replace("://localhost", "://127.0.0.1");
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

export function headersForApiBase(base: string): HeadersInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  try {
    const target = new URL(base);
    if (target.hostname === "127.0.0.1" || target.hostname === "localhost") {
      const publicApi = process.env.NEXT_PUBLIC_API_URL;
      if (publicApi) {
        headers.Host = new URL(publicApi).hostname;
      }
    }
  } catch {
    /* ignore */
  }
  return headers;
}

export async function fetchPublicJson(path: string, timeoutMs = 12000): Promise<unknown | null> {
  const pathWithSlash = path.startsWith("/") ? path : `/${path}`;
  const errors: string[] = [];

  for (const base of getServerApiBaseCandidates()) {
    try {
      const res = await fetch(`${base}${pathWithSlash}`, {
        cache: "no-store",
        headers: headersForApiBase(base),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) {
        errors.push(`${base} HTTP ${res.status}`);
        continue;
      }
      return await res.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${base} ${message}`);
    }
  }

  console.error(`[public-api] gagal fetch ${pathWithSlash}:`, errors.join(" | "));
  return null;
}
