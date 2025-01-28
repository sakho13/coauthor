import { CoAuthorNovelChapterList } from "@/components/organisms/CoAuthorNovelChapterList"
import { Suspense } from "react"

type Props = {
  params: Promise<{ novel_id: string }>
}

export default async function Page({ params }: Props) {
  const { novel_id } = await params

  return (
    <Suspense>
      <CoAuthorNovelChapterList novelId={novel_id} />
    </Suspense>
  )
}
