// 4. API для отримання транспортних засобів
// Файл: pages/api/vehicles.ts
import { NextApiRequest, NextApiResponse } from "next";
import admin from "../lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const db = admin.firestore();
      const snapshot = await db.collection("vehicles").get();
      const vehicles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ vehicles });
    } catch (error) {
      console.error("Помилка отримання транспортних засобів:", error);
      return res.status(500).json({ error: "Помилка сервера" });
    }
  }

  if (req.method === "POST") {
    const { licensePlate, model, vehicleType } = req.body;

    if (!licensePlate || !model || !vehicleType) {
      return res.status(400).json({ error: "Всі поля є обов'язковими" });
    }

    try {
      const db = admin.firestore();
      const newVehicle = { licensePlate, model, vehicleType, createdAt: new Date() };
      const docRef = await db.collection("vehicles").add(newVehicle);
      return res.status(201).json({ id: docRef.id, ...newVehicle });
    } catch (error) {
      console.error("Помилка додавання транспортного засобу:", error);
      return res.status(500).json({ error: "Помилка сервера" });
    }
  }

  return res.setHeader("Allow", ["GET", "POST"]).status(405).end("Метод не підтримується");
}
