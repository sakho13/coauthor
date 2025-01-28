import { PageTitleParagraph } from "@/components/atoms/PageTitleParagraph"

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className='w-full px-2'>
      <PageTitleParagraph title='執筆中小説' />

      <div className='mx-16 my-4'>{children}</div>
    </div>
  )
}
