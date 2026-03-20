import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { paths } = await request.json();

    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { success: false, error: "paths dizisi gerekli." },
        { status: 400 }
      );
    }

    for (const path of paths) {
      if (typeof path === "string" && /^\/[\w\/-]*$/.test(path)) {
        revalidatePath(path);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${paths.length} yol yeniden doğrulandı.`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
