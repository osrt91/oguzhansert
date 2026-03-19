import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Returns a Supabase client for Server Components and Server Actions.
 * Reads/writes auth cookies via next/headers for SSR session handling.
 *
 * Usage:
 *   const supabase = await supabaseServer();
 *   const { data } = await supabase.from("profile").select("*");
 */
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Cannot set cookies in Server Components — safe to ignore.
            // This only fires in Server Actions or Route Handlers.
          }
        },
      },
    }
  );
}
