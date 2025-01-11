import { NextResponse } from "next/server";

import { authMiddleware } from "./src/midlleware/auth";
import { loggerMiddleware } from "./src/midlleware/logger";
import { rateLimitMiddleware } from "./src/midlleware/retaLimit";

export async function middleware(req: Request) {
  const response = NextResponse.next();
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  // Логування
  const loggerResponse = loggerMiddleware(req);
  if (loggerResponse instanceof Response) return loggerResponse;

  // Перевірка ліміту запитів
  const rateLimitResponse = rateLimitMiddleware(req);
  if (rateLimitResponse instanceof Response) return rateLimitResponse;

  // Автентифікація
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof Response) return authResponse;

  // Пропустити запит
  return NextResponse.next();
}
