import { CoAuthorEditor } from "@/components/organisms/CoAuthorEditor"

type Props = {
  params: Promise<{ novel_id: string; order: number }>
}

export default async function Page({ params }: Props) {
  const awaitedParams = await params

  return (
    <CoAuthorEditor
      novelId={awaitedParams.novel_id}
      order={awaitedParams.order}
    />
  )
}
