import NovelCell from 'src/components/Novel/NovelCell'

type NovelPageProps = {
  novelId: string
}

const NovelPage = ({ novelId }: NovelPageProps) => {
  return <NovelCell novelId={novelId} />
}

export default NovelPage
