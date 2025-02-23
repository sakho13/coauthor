import { initializeApp } from "firebase/app"
import { getAuth, GithubAuthProvider } from "firebase/auth"
import { GlobalStatics } from "./GlobalStatics"

const app = initializeApp({
  apiKey: GlobalStatics.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: GlobalStatics.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: GlobalStatics.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: GlobalStatics.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: GlobalStatics.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: GlobalStatics.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: GlobalStatics.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
})
const auth = getAuth(app)

// export const analytics = getAnalytics(app)

export const firebaseClient = {
  auth,
  authCredentials: {
    github: GithubAuthProvider.credentialFromResult,
  },
}
