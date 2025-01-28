import { PageTitleParagraph } from "@/components/atoms/PageTitleParagraph"
import { CoAuthorEditor } from "@/components/organisms/CoAuthorEditor"

type Props = {
  params: Promise<{ novel_id: string; order: number }>
}

export default async function Page({ params }: Props) {
  const awaitedParams = await params

  return (
    <div className='w-full px-2'>
      <PageTitleParagraph title='執筆中小説' />

      <div className='mx-16 my-4'>
        <CoAuthorEditor
          novelId={awaitedParams.novel_id}
          order={awaitedParams.order}
        />
      </div>
    </div>
  )
}
