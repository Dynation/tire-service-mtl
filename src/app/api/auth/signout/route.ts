import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Просто логуємо запит для використання
    console.log("Request received:", req);

    // Динамічний імпорт firebase/auth
    const { signOut } = await import("firebase/auth");
    const auth = (await import("../../../lib/firebaseAuth")).default;

    // Виконуємо вихід
    await signOut(auth);

    return NextResponse.json({ message: "Signed out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during signout:", error);
    return NextResponse.json({ error: "Failed to sign out", details: error }, { status: 400 });
  }
}


//export const runtime = "edge"; // Опціонально, для покращення продуктивності