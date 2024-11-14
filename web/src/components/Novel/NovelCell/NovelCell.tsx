import type {
  FindNovelByNovelId,
  FindNovelByNovelIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Novel from 'src/components/Novel/Novel'

export const QUERY: TypedDocumentNode<
  FindNovelByNovelId,
  FindNovelByNovelIdVariables
> = gql`
  query FindNovelByNovelId($novelId: String!) {
    novel: novel(novelId: $novelId) {
      novelId
      title
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Novel not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindNovelByNovelIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  novel,
}: CellSuccessProps<FindNovelByNovelId, FindNovelByNovelIdVariables>) => {
  return <Novel novel={novel} />
}
