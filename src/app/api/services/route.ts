import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Обробник для GET запитів
export async function GET() {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Помилка завантаження даних:", error);
    return NextResponse.json({ error: "Не вдалося завантажити дані" }, { status: 500 });
  }
}

// Обробник для інших методів
export async function POST(req: NextRequest) {
  console.log(req);
  
  return NextResponse.json({ error: "Метод не підтримується" }, { status: 405 });
}
