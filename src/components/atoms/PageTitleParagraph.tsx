import { joinClassName } from "@/utils/functions/joinClassName"
import { ReactNode } from "react"

type Props = {
  title: string
  children?: ReactNode[] | ReactNode
}

export function PageTitleParagraph({ title, children }: Props) {
  return (
    <div
      className={joinClassName(
        "w-full",
        "flex justify-between items-center",
        "border-b",
        "px-16 py-4",
      )}
    >
      <h1 className='font-bold text-xl select-none'>{title}</h1>

      {children}
    </div>
  )
}
