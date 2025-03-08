import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyServerToken } from "../../../lib/firebaseAdmin";

export async function GET() {
  try {
    // 🔹 Отримуємо токен з cookies
    const token = (await cookies()).get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = await verifyServerToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      uid: decoded.uid,
      email: decoded.email,
      displayName: decoded.name || null, // ✅ Додаємо displayName
      picture: decoded.picture || null,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
