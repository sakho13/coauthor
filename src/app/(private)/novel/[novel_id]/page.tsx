import { PageTitleParagraph } from "@/components/atoms/PageTitleParagraph"
import { CoAuthorNovelChapterList } from "@/components/organisms/CoAuthorNovelChapterList"
import { Suspense } from "react"

type Props = {
  params: Promise<{ novel_id: string }>
}

export default async function Page({ params }: Props) {
  const { novel_id } = await params

  return (
    <div className='w-full h-full px-2'>
      <PageTitleParagraph title='執筆中小説' />

      <div className='mx-16 my-4 h-full'>
        <Suspense>
          <CoAuthorNovelChapterList novelId={novel_id} />
        </Suspense>
      </div>
    </div>
  )
}
