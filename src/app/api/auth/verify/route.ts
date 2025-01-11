import { NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    // Отримуємо дані з тіла запиту
    const { token } = await req.json();

    if (!token) {
      console.error("Токен відсутній у тілі запиту");
      return NextResponse.json(
        { error: "Токен є обов'язковим" },
        { status: 400 }
      );
    }

    // Перевірка токена через Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Токен успішно перевірено:", decodedToken);

    return NextResponse.json({ user: decodedToken }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const err = error as unknown as { code: string; message: string };
      console.error("Помилка перевірки токена:", err.code, err.message);
    } else {
      console.error("Помилка перевірки токена:", error);
    }

    // Розширена обробка помилок
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "auth/argument-error") {
      return NextResponse.json(
        { error: "Невірний формат токена" },
        { status: 400 }
      );
    }

    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "auth/id-token-expired") {
      return NextResponse.json(
        { error: "Токен прострочений" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Недійсний токен" },
      { status: 401 }
    );
  }
}


//export const runtime = "edge"; // Опціонально, для покращення продуктивності
