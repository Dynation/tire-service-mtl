import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../../lib/firebaseAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Вхід через Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return NextResponse.json({ message: "Signed in successfully", user }, { status: 200 });
  } catch (error) {
    console.error("Error during signin:", error);
    return NextResponse.json({ error: "Failed to sign in", details: error }, { status: 400 });
  }
}
