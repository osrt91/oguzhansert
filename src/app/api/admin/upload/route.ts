import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];
const DOC_TYPES = ["application/pdf"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_BUCKETS = ["avatars", "logos", "projects", "blog", "gallery", "documents", "site", "uploads"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "svg", "pdf"];

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const notReady = requireSupabase();
  if (notReady) return notReady;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "uploads";

    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz depolama alanı." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Dosya gerekli." },
        { status: 400 }
      );
    }

    const isImage = IMAGE_TYPES.includes(file.type);
    const isDoc = DOC_TYPES.includes(file.type);

    if (!isImage && !isDoc) {
      return NextResponse.json(
        {
          success: false,
          error: `Desteklenmeyen dosya türü: ${file.type}. İzin verilen: JPG, PNG, WebP, AVIF, SVG, PDF`,
        },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Görsel boyutu en fazla 5MB olabilir." },
        { status: 400 }
      );
    }

    if (isDoc && file.size > MAX_DOC_SIZE) {
      return NextResponse.json(
        { success: false, error: "Doküman boyutu en fazla 10MB olabilir." },
        { status: 400 }
      );
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { success: false, error: `Desteklenmeyen dosya uzantısı: .${ext}` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `admin/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      data: { url: publicUrl, path: filePath },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
