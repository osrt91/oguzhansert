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

// Tables that use "key" as primary identifier instead of "id"
const KEY_BASED_TABLES: string[] = ["site_settings"];

function getPrimaryKeyColumn(table: string): string {
  return KEY_BASED_TABLES.includes(table) ? "key" : "id";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const notReady = requireSupabase();
  if (notReady) return notReady;

  const { table, id } = await params;

  if (!isAllowedTable(table)) {
    return NextResponse.json(
      { success: false, error: `Geçersiz tablo: ${table}` },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const pkColumn = getPrimaryKeyColumn(table);

    const { data, error } = await supabase
      .from(table)
      .update(body)
      .eq(pkColumn, id)
      .select()
      .single();

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const notReady = requireSupabase();
  if (notReady) return notReady;

  const { table, id } = await params;

  if (!isAllowedTable(table)) {
    return NextResponse.json(
      { success: false, error: `Geçersiz tablo: ${table}` },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const pkColumn = getPrimaryKeyColumn(table);

    const { error } = await supabase.from(table).delete().eq(pkColumn, id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Silindi." });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
