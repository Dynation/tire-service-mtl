import { NextApiRequest, NextApiResponse } from "next";
import { verifyIdToken } from "../../lib/firebaseAdmin"; // Функція перевірки токена

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const decodedToken = await verifyIdToken(token);
    res.status(200).json({ user: { displayName: decodedToken.name || "User" } });
  } catch (error) {
    res.status(401).json({ user: null });
  }
}
