import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyServerToken } from "../../../lib/firebaseAdmin"; 

export async function GET(req: NextRequest) {
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

    return NextResponse.json({ user: decoded });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
