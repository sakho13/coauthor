"use client"
import { CoAuthorSignupForm } from "@/components/organisms/CoAuthorSignupForm"
import { joinClassName } from "@/utils/functions/joinClassName"
import { useAuthStore } from "@/utils/stores/useAuthStore"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) redirect("/home")
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
            <CoAuthorSignupForm />
          </div>
        </div>
      </div>

      <div className={joinClassName("hidden sm:block bg-muted")} />
    </div>
  )
}
