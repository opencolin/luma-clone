import "server-only";

const BASE = "https://api.lu.ma/public/v1";

export class LumaApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`Luma API ${status}: ${body.slice(0, 200)}`);
    this.name = "LumaApiError";
  }
}

/** Whether a Luma API key is configured. When false, the app uses local data. */
export function isLumaConnected() {
  return !!process.env.LUMA_API_KEY;
}

type GetOpts = {
  params?: Record<string, string | number | undefined>;
  /** ISR revalidate window in seconds (default 5 min). */
  revalidate?: number;
};

export async function lumaGet<T>(path: string, opts: GetOpts = {}): Promise<T> {
  const key = process.env.LUMA_API_KEY;
  if (!key) throw new LumaApiError(0, "LUMA_API_KEY is not set");

  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(opts.params ?? {})) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, {
    headers: { "x-luma-api-key": key, accept: "application/json" },
    next: { revalidate: opts.revalidate ?? 300 },
  });

  if (!res.ok) {
    throw new LumaApiError(res.status, await res.text().catch(() => ""));
  }
  return (await res.json()) as T;
}

/** POST helper for write endpoints (e.g. add-guests). */
export async function lumaPost<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const key = process.env.LUMA_API_KEY;
  if (!key) throw new LumaApiError(0, "LUMA_API_KEY is not set");

  const res = await fetch(BASE + path, {
    method: "POST",
    headers: {
      "x-luma-api-key": key,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new LumaApiError(res.status, await res.text().catch(() => ""));
  }
  return (await res.json()) as T;
}
