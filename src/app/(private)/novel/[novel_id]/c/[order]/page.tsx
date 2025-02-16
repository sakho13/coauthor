import { CoAuthorEditorTemplate } from "@/components/templates/CoAuthorEditorTemplate"
import { Suspense } from "react"

type Props = {
  params: Promise<{ novel_id: string; order: number }>
}

export default async function Page({ params }: Props) {
  const awaitedParams = await params

  return (
    <Suspense>
      <CoAuthorEditorTemplate
        novelId={awaitedParams.novel_id}
        order={awaitedParams.order}
      />
    </Suspense>
  )
}
