import { NextResponse } from "next/server";

export function loggerMiddleware(req: Request) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    return NextResponse.next();
  }
  