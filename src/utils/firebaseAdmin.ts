// firebaseAdmin.ts
import * as admin from "firebase-admin"
import { GLOBAL_STATICS_PRIVATE } from "./GlobalStaticsPrivate"

if (!admin.apps.length) {
  let credential: admin.credential.Credential

  console.log("FirebaseAdmin 初期化中")

  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "") {
    credential = admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: GLOBAL_STATICS_PRIVATE.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY,
    })

    admin.initializeApp({
      credential,
      databaseURL: GLOBAL_STATICS_PRIVATE.DATABASE_URL,
    })

    console.log("FirebaseAdmin 初期化完了")
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
