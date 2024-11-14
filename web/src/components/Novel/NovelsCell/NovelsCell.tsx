import type { FindNovels, FindNovelsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
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
      title
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No novels yet.{' '}
      <Link to={routes.newNovel()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindNovels>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  novels,
}: CellSuccessProps<FindNovels, FindNovelsVariables>) => {
  return <Novels novels={novels} />
}
