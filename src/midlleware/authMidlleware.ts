import { NextRequest, NextResponse } from "next/server";
import admin from "../app/lib/firebaseAdmin";

export async function authMiddleware(req: NextRequest) {
  console.log("🔹 Middleware triggered for:", req.nextUrl.pathname);

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;

  if (!token) {
    console.error("❌ Токен відсутній в заголовках");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Токен успішно верифіковано:", decodedToken.uid);
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Недійсний токен:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
