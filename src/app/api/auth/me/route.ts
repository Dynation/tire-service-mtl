import { NextRequest, NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split("Bearer ")[1];
  console.log("Заголовок Authorization:", req.headers.get("authorization"));

  if (!token) {
    console.error("Токен відсутній у заголовку");
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Розшифрований токен:", decodedToken);

    return NextResponse.json({
      user: {
        displayName: decodedToken.name || "User",
        email: decodedToken.email,
        uid: decodedToken.uid,
      },
    });
  } catch (error) {
    console.error("Помилка перевірки токена:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

//export const runtime = "edge"; // Опціонально, для покращення продуктивності