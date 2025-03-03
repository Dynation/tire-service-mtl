import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie"; // Для видалення cookies

export async function POST(req: NextRequest) {
  try {
    // 📌 Очищуємо токен в cookies
    const response = NextResponse.json({ message: "Signed out successfully" }, { status: 200 });
    response.headers.set(
      "Set-Cookie",
      serialize("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // ❌ Видаляємо токен
      })
    );

    return response;
  } catch (error) {
    console.error("Error during sign-out:", error);
    return NextResponse.json({ error: "Failed to sign out", details: error }, { status: 400 });
  }
}



//export const runtime = "edge"; // Опціонально, для покращення продуктивності