// firebaseAdmin.ts
import * as admin from "firebase-admin"
import { GLOBAL_STATICS } from "./GlobalStatics"

if (!admin.apps.length) {
  let credential: admin.credential.Credential

  if (GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "") {
    credential = admin.credential.cert({
      projectId: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
    })

    admin.initializeApp({
      credential,
      databaseURL: GLOBAL_STATICS.DATABASE_URL,
    })
  } else {
    console.warn("FirebaseAdmin 初期化に失敗しました")
    credential = {} as admin.credential.Credential
  }
}

export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    return decodedToken
  } catch {
    throw new Error("Unauthorized")
  }
}
