import { ReactNode } from "react"

type Props = {
  children: ReactNode[] | ReactNode
}

export function HeaderParagraph({ children }: Props) {
  return (
    <div className='border-b px-2 pb-1 mb-4 flex justify-between items-center'>
      {children}
    </div>
  )
}
