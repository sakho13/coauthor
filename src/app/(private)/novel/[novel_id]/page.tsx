import { CoAuthorNovelChapterList } from "@/components/organisms/CoAuthorNovelChapterList"
import { joinClassName } from "@/utils/functions/joinClassName"
import { Suspense } from "react"

type Props = {
  params: Promise<{ novel_id: string }>
}

export default async function Page({ params }: Props) {
  const { novel_id } = await params

  return (
    <div className='w-full px-2'>
      <div
        className={joinClassName(
          "w-full",
          "flex justify-between items-center",
          "border-b",
          "px-16 py-4",
        )}
      >
        <h1 className='font-bold text-xl select-none'>執筆中小説</h1>
      </div>

      <div className='mx-16 my-4'>
        <Suspense>
          <CoAuthorNovelChapterList novelId={novel_id} />
        </Suspense>
      </div>
    </div>
  )
}
