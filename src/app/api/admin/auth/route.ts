import { NextRequest, NextResponse } from "next/server";
import { hashSecret, timingSafeCompare } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { ok } = rateLimit(`admin-auth:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!ok) {
    return NextResponse.json(
      { success: false, error: "Çok fazla deneme. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Şifre gerekli." },
        { status: 400 }
      );
    }

    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Sunucu yapılandırma hatası." },
        { status: 500 }
      );
    }

    if (!timingSafeCompare(password, secret)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz şifre." },
        { status: 401 }
      );
    }

    const token = hashSecret(secret);
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      success: true,
      message: "Giriş başarılı.",
    });

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Çıkış yapıldı.",
  });

  response.cookies.set("admin-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
