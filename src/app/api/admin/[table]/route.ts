import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";

const ALLOWED_TABLES = [
  "profile",
  "skills",
  "work_experience",
  "education",
  "projects",
  "blog_posts",
  "gallery_images",
  "hackathons",
  "seo_metadata",
  "redirects",
  "site_settings",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

function isAllowedTable(table: string): table is AllowedTable {
  return ALLOWED_TABLES.includes(table as AllowedTable);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const notReady = requireSupabase();
  if (notReady) return notReady;

  const { table } = await params;

  if (!isAllowedTable(table)) {
    return NextResponse.json(
      { success: false, error: `Geçersiz tablo: ${table}` },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const locale = request.nextUrl.searchParams.get("locale");

    let query = supabase.from(table).select("*");

    if (locale) {
      query = query.eq("locale", locale);
    }

    // Apply default ordering
    if (table === "blog_posts") {
      query = query.order("created_at", { ascending: false });
    } else if (
      ["skills", "work_experience", "education", "projects", "hackathons", "gallery_images"].includes(table)
    ) {
      query = query.order("sort_order", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const notReady = requireSupabase();
  if (notReady) return notReady;

  const { table } = await params;

  if (!isAllowedTable(table)) {
    return NextResponse.json(
      { success: false, error: `Geçersiz tablo: ${table}` },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from(table)
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
