import { NextResponse } from "next/server";

const rateLimitStore = new Map<string, number>();

export function rateLimitMiddleware(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("host");

  if (ip) {
    const currentCount = rateLimitStore.get(ip) || 0;

    if (currentCount > 100) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    rateLimitStore.set(ip, currentCount + 1);
  }

  return NextResponse.next();
}
