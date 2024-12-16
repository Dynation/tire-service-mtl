import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { uid, name, email } = await request.json();

    // Перевірка, чи існує вже користувач у базі даних
    const existingUser = await prisma.user.findUnique({
      where: { uid },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          uid,
          name,
          email,
        },
      });
    }

    return NextResponse.json({ message: "User created or already exists" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
