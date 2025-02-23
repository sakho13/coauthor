// firebaseAdmin.ts
import * as admin from "firebase-admin"
import { GlobalStatics } from "./GlobalStatics"

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: GlobalStatics.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: GlobalStatics.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: GlobalStatics.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
    }),
    databaseURL: GlobalStatics.DATABASE_URL,
  })
}

export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    return decodedToken
  } catch {
    throw new Error("Unauthorized")
  }
}
