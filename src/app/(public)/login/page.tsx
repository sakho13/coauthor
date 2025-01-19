"use client"
import { CoAuthorLoginForm } from "@/components/organisms/CoAuthorLoginForm"
import { firebaseClient } from "@/utils/firebaseClient"
import { joinClassName } from "@/utils/functions/joinClassName"
import { useAuthStore } from "@/utils/stores/useAuthStore"
import { ApiV1Utility } from "@/utils/utilities/ApiV1Utility"
import { signOut } from "firebase/auth"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function Page() {
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) {
      ApiV1Utility.postUser(accessToken).then((res) => {
        if (res.success) {
          toast.success("認証完了")
          redirect("/home")
        } else {
          signOut(firebaseClient.auth)
          toast.error(`認証失敗（CODE: ${res.error.code}）`, {
            description: res.error.message,
          })
        }
      })
    }
  }, [accessToken])

  return (
    <div
      className={joinClassName(
        "h-full",
        "grid grid-cols-1 sm:grid-cols-2 grid-rows-1",
      )}
    >
      <div
        className={joinClassName(
          "col-start-1",
          "flex flex-col gap-4 p-6 sm:p-10",
        )}
      >
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <CoAuthorLoginForm />
          </div>
        </div>
      </div>

      <div className={joinClassName("hidden sm:block bg-muted")} />
    </div>
  )
}
