import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyServerToken } from "../../../lib/firebaseAdmin"; 

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const decoded = await verifyServerToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 🔹 Встановлюємо cookies
    (await cookies()).set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ success: true, user: decoded });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
