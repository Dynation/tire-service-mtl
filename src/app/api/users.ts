// 1. API для створення користувача
// Файл: pages/api/users.ts
import { NextApiRequest, NextApiResponse } from "next";
import admin from "../../app/lib/firebaseAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).end("Метод не підтримується");
  }

  const { uid, name, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: "UID і email є обов'язковими" });
  }

  try {
    const db = admin.firestore();
    await db.collection("users").doc(uid).set({ name, email, createdAt: new Date() });

    return res.status(200).json({ message: "Користувач створений успішно" });
  } catch (error) {
    console.error("Помилка створення користувача:", error);
    return res.status(500).json({ error: "Помилка сервера" });
  }
}