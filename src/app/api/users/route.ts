import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { uid, name, email } = await request.json();

    console.log("Отримано дані:", { uid, name, email });

    // Перевірка, чи існує вже користувач у базі даних
    const existingUser = await prisma.user.findUnique({
      where: { uid },
    });

    if (!existingUser) {
      console.log("Користувач не знайдений, створюємо...");
      await prisma.user.create({
        data: {
          uid,
          name,
          email,
        },
      });
      console.log("Користувача створено");
    } else {
      console.log("Користувач вже існує:", existingUser);
    }

    return NextResponse.json({ message: "User created or already exists" });
  } catch (error) {
    const err = error as Error;
    console.error("Error creating user:", err.message, err.stack);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

