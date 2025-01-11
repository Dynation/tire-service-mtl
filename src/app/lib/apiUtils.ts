import { NextRequest } from "next/server";
import { verifyServerToken } from "./firebaseAuth";

// Функція для логування запитів
export function logRequest(req: NextRequest) {
  console.log("Request received:", {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers),
  });
}
// Функція для отримання сесії та перевірки автентифікації
export async function getAuthenticatedSession(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authenticated");
  }

  const token = authHeader.split("Bearer ")[1];
  const session = await verifyServerToken(token);

  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}

export { verifyServerToken };