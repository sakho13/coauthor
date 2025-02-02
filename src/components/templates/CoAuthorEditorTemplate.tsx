"use client"

import { useSidebar } from "../ui/sidebar"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CoAuthorEditor } from "../organisms/CoAuthorEditor"

type Props = { novelId: string; order: number }

export function CoAuthorEditorTemplate({ novelId, order }: Props) {
  const router = useRouter()
  const { open, toggleSidebar } = useSidebar()

  useEffect(() => {
    if (open) {
      toggleSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='absolute w-full h-full left-0 top-0 bg-white'>
      <CoAuthorEditor
        novelId={novelId}
        order={order}
        backRoute={() => {
          router.back()
          if (!open) {
            toggleSidebar()
          }
        }}
      />
    </div>
  )
}
