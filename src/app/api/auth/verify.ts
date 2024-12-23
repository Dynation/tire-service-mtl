// 2. API для перевірки токена
// Файл: pages/api/auth/verify.ts
import { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../app/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).end("Метод не підтримується");
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Токен є обов'язковим" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return res.status(200).json({ user: decodedToken });
  } catch (error) {
    console.error("Помилка перевірки токена:", error);
    return res.status(401).json({ error: "Недійсний токен" });
  }
}