import type { FindNovels, FindNovelsVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Novels from 'src/components/Novel/Novels'

export const QUERY: TypedDocumentNode<FindNovels, FindNovelsVariables> = gql`
  query FindNovels {
    novels {
      novelId
      authorId
      title
      description
      share
      type
      status
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <div className="rw-text-center">執筆中の小説はありません。</div>
}

export const Failure = ({ error }: CellFailureProps<FindNovels>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  novels,
}: CellSuccessProps<FindNovels, FindNovelsVariables>) => {
  return <Novels novels={novels} />
}
