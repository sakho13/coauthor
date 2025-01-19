type Props = {
  params: Promise<{ novel_id: string; chapter_id: string }>
}

export default async function Page({ params }: Props) {
  const awaitedParams = await params

  console.log(awaitedParams)

  return (
    <div className=''>
      <h1 className='text-xl font-bold select-none'>執筆中小説</h1>
    </div>
  )
}
