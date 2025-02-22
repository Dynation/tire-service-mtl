// firebaseAdmin.ts
import * as admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

// Ініціалізація Firebase Admin SDK
if (!getApps().length) {
  if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf-8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }
}

// Функція для перевірки токена (серверна сторона)
export const verifyServerToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Помилка перевірки токена:", error);
    throw new Error("Недійсний токен");
  }
};

export default admin;
