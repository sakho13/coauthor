"use client"

import { useEffect } from "react"
import { firebaseClient } from "@/utils/firebaseClient"
import { useAuthStore } from "@/utils/stores/useAuthStore"

type Props = {
  children: React.ReactNode
}

export function CoAuthorAuthProvider({ children }: Props) {
  const { setAccessToken } = useAuthStore()

  useEffect(() => {
    setAccessToken(null)

    const idTokenSubscriber = firebaseClient.auth.onIdTokenChanged(
      async (user) => {
        if (user) setAccessToken(await user.getIdToken())
        else setAccessToken(null)
      },
    )

    return () => idTokenSubscriber()
  }, [setAccessToken])

  return children
}
