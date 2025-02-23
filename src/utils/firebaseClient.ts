import { initializeApp } from "firebase/app"
import { getAuth, GithubAuthProvider } from "firebase/auth"
import { GLOBAL_STATICS } from "./GlobalStatics"

type FirebaseClientType = {
  auth: ReturnType<typeof getAuth>
  authCredentials: {
    github: typeof GithubAuthProvider.credentialFromResult
  }
}

let firebaseClient: FirebaseClientType

if (GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "") {
  const app = initializeApp({
    apiKey: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: GLOBAL_STATICS.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  })
  const auth = getAuth(app)

  firebaseClient = {
    auth,
    authCredentials: {
      github: GithubAuthProvider.credentialFromResult,
    },
  }
} else {
  console.warn("Firebase 初期化に失敗しました")
  firebaseClient = {} as FirebaseClientType
}

export { firebaseClient }
