import type {
  EditNovelByNovelId,
  UpdateNovelInput,
  UpdateNovelMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import NovelForm from 'src/components/Novel/NovelForm'

export const QUERY: TypedDocumentNode<EditNovelByNovelId> = gql`
  query EditNovelByNovelId($novelId: String!) {
    novel: novel(novelId: $novelId) {
      novelId
      title
      createdAt
      updatedAt
    }
  }
`

const UPDATE_NOVEL_MUTATION: TypedDocumentNode<
  EditNovelById,
  UpdateNovelMutationVariables
> = gql`
  mutation UpdateNovelMutation($novelId: String!, $input: UpdateNovelInput!) {
    updateNovel(novelId: $novelId, input: $input) {
      novelId
      title
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ novel }: CellSuccessProps<EditNovelByNovelId>) => {
  const [updateNovel, { loading, error }] = useMutation(UPDATE_NOVEL_MUTATION, {
    onCompleted: () => {
      toast.success('Novel updated')
      navigate(routes.novels())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (
    input: UpdateNovelInput,
    id: EditNovelByNovelId['novel']['id']
  ) => {
    updateNovel({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Novel {novel?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <NovelForm
          novel={novel}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
