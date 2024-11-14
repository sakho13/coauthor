import type {
  DeleteNovelMutation,
  DeleteNovelMutationVariables,
  FindNovels,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Novel/NovelsCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const NovelsList = ({ novels }: FindNovels) => {
  const [deleteNovel] = useMutation(DELETE_NOVEL_MUTATION, {
    onCompleted: () => {
      toast.success('Novel deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (novelId: DeleteNovelMutationVariables['novelId']) => {
    if (confirm('Are you sure you want to delete novel ' + novelId + '?')) {
      deleteNovel({ variables: { novelId } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Novel id</th>
            <th>Title</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {novels.map((novel) => (
            <tr key={novel.novelId}>
              <td>{truncate(novel.novelId)}</td>
              <td>{truncate(novel.title)}</td>
              <td>{timeTag(novel.createdAt)}</td>
              <td>{timeTag(novel.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.novel({ novelId: novel.novelId })}
                    title={'Show novel ' + novel.novelId + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editNovel({ novelId: novel.novelId })}
                    title={'Edit novel ' + novel.novelId}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete novel ' + novel.novelId}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(novel.novelId)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default NovelsList
