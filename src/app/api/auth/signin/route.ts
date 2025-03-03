import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { serialize } from "cookie"; // Для роботи з cookies
import auth from "../../../lib/firebaseAuth"; // Імпорт Firebase Auth

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 🔥 Вхід через Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Отримуємо токен користувача

    // 📌 Зберігаємо токен у cookies
    const response = NextResponse.json({ message: "Signed in successfully", user }, { status: 200 });
    response.headers.set(
      "Set-Cookie",
      serialize("authToken", token, {
        httpOnly: true, // Захищаємо від доступу через JavaScript
        secure: process.env.NODE_ENV === "production", // В продакшені тільки HTTPS
        sameSite: "strict", // Захищає від CSRF-атак
        path: "/", // Доступно для всіх маршрутів
        maxAge: 60 * 60 * 24 * 7, // 7 днів
      })
    );

    return response;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json({ error: "Failed to sign in", details: error }, { status: 400 });
  }
}

