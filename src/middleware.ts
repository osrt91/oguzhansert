import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const BOTS =
  /googlebot|bingbot|yandex|baidu|duckduckbot|slurp|msnbot|facebookexternalhit|twitterbot|linkedinbot/i;

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Skip admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Skip API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Don't redirect bots — let them access any locale directly
  const userAgent = request.headers.get("user-agent") || "";
  if (BOTS.test(userAgent)) {
    return intlMiddleware(request);
  }

  // Check for saved locale preference cookie
  const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (
    savedLocale &&
    routing.locales.includes(savedLocale as (typeof routing.locales)[number])
  ) {
    // Cookie exists, let next-intl handle with this preference
    return intlMiddleware(request);
  }

  // Geo-based detection: Cloudflare CF-IPCountry header
  const country = request.headers.get("cf-ipcountry") || "";
  if (country === "TR" && !pathname.startsWith("/tr")) {
    // Turkish user, prefer TR
    const response = intlMiddleware(request);
    response?.cookies.set("NEXT_LOCALE", "tr", {
      maxAge: 365 * 24 * 60 * 60,
    });
    return response;
  }

  // Default: let next-intl handle based on Accept-Language
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)"],
};
