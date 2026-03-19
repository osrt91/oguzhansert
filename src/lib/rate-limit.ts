/**
 * In-memory sliding window rate limiter.
 *
 * Tracks request counts per key (typically IP address) within a
 * configurable time window. Expired entries are garbage-collected
 * every 60 seconds to prevent memory leaks.
 *
 * Note: This is per-process — it resets on server restart and does
 * not share state across multiple instances. For distributed rate
 * limiting, use Redis or a similar external store.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 60 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of store) {
      if (val.resetAt < now) store.delete(key);
    }
  }, 60_000);
}

interface RateLimitOptions {
  /** Maximum number of requests per window (default: 5) */
  limit?: number;
  /** Window duration in milliseconds (default: 60000 = 1 minute) */
  windowMs?: number;
}

interface RateLimitResult {
  /** Whether the request is allowed */
  ok: boolean;
  /** Number of remaining requests in the current window */
  remaining: number;
}

/**
 * Check rate limit for a given key.
 *
 * Usage in API routes:
 * ```ts
 * const ip = request.headers.get("x-forwarded-for") || "unknown";
 * const { ok, remaining } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
 * if (!ok) {
 *   return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
 * }
 * ```
 */
export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: RateLimitOptions = {}
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // New key or expired window — start fresh
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  // Increment counter
  entry.count++;

  // Over limit
  if (entry.count > limit) {
    return { ok: false, remaining: 0 };
  }

  return { ok: true, remaining: limit - entry.count };
}
