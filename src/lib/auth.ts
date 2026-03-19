import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Timing-safe string comparison to prevent timing attacks.
 * Both strings are converted to Buffers and compared using
 * Node.js crypto.timingSafeEqual which runs in constant time.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Hash a secret using SHA-256. Used to derive the expected
 * admin token value from the ADMIN_SECRET env var.
 */
export function hashSecret(secret: string): string {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

/**
 * Check admin authentication on an API route handler.
 * Returns null if auth passes, or a 401 NextResponse if it fails.
 *
 * Usage in API routes:
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const authError = checkAuth(request);
 *   if (authError) return authError;
 *   // ... handle authenticated request
 * }
 * ```
 */
export function checkAuth(request: NextRequest): NextResponse | null {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const expected = hashSecret(process.env.ADMIN_SECRET || "");

  if (!timingSafeCompare(token, expected)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null; // Auth passed
}

/**
 * Sanitize user-provided search input by stripping potentially
 * dangerous characters and capping length at 100 chars.
 * Allows alphanumeric, whitespace, common punctuation, and
 * Turkish-specific characters.
 */
export function sanitizeSearchInput(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9\s\-_.\/çÇğĞıİöÖşŞüÜ]/g, "")
    .slice(0, 100);
}
