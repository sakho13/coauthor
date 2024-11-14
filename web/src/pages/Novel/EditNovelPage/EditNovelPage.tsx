import EditNovelCell from 'src/components/Novel/EditNovelCell'

type NovelPageProps = {
  novelId: string
}

const EditNovelPage = ({ novelId }: NovelPageProps) => {
  return <EditNovelCell novelId={novelId} />
}

export default EditNovelPage
