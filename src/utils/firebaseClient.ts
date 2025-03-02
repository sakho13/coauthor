import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GithubAuthProvider } from "firebase/auth"

type FirebaseClientType = {
  auth: ReturnType<typeof getAuth>
  authCredentials: {
    github: typeof GithubAuthProvider.credentialFromResult
  }
}

let firebaseClient: FirebaseClientType

if (!getApps().length) {
  try {
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "") {
      initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      })

      const app = getApp()

      const auth = getAuth(app)

      firebaseClient = {
        auth,
        authCredentials: {
          github: GithubAuthProvider.credentialFromResult,
        },
      }
    } else {
      firebaseClient = {} as FirebaseClientType
    }
  } catch (error) {
    console.error("Firebase 初期化に失敗しました", error)
  }
}

export { firebaseClient }
