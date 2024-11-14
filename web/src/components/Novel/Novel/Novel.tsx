import type {
  DeleteNovelMutation,
  DeleteNovelMutationVariables,
  FindNovelByNovelId,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_NOVEL_MUTATION: TypedDocumentNode<
  DeleteNovelMutation,
  DeleteNovelMutationVariables
> = gql`
  mutation DeleteNovelMutation($novelId: String!) {
    deleteNovel(novelId: $novelId) {
      novelId
    }
  }
`

interface Props {
  novel: NonNullable<FindNovelByNovelId['novel']>
}

const Novel = ({ novel }: Props) => {
  const [deleteNovel] = useMutation(DELETE_NOVEL_MUTATION, {
    onCompleted: () => {
      toast.success('Novel deleted')
      navigate(routes.novels())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (novelId: DeleteNovelMutationVariables['novelId']) => {
    if (confirm('Are you sure you want to delete novel ' + novelId + '?')) {
      deleteNovel({ variables: { novelId } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Novel {novel.novelId} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Novel id</th>
              <td>{novel.novelId}</td>
            </tr>
            <tr>
              <th>Title</th>
              <td>{novel.title}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(novel.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(novel.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editNovel({ novelId: novel.novelId })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(novel.novelId)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Novel
