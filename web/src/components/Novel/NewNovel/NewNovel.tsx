import type {
  CreateNovelMutation,
  CreateNovelInput,
  CreateNovelMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import NovelForm from 'src/components/Novel/NovelForm'

const CREATE_NOVEL_MUTATION: TypedDocumentNode<
  CreateNovelMutation,
  CreateNovelMutationVariables
> = gql`
  mutation CreateNovelMutation($input: CreateNovelInput!) {
    createNovel(input: $input) {
      novelId
    }
  }
`

const NewNovel = () => {
  const [createNovel, { loading, error }] = useMutation(CREATE_NOVEL_MUTATION, {
    onCompleted: () => {
      toast.success('Novel created')
      navigate(routes.novels())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: CreateNovelInput) => {
    createNovel({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Novel</h2>
      </header>
      <div className="rw-segment-main">
        <NovelForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewNovel
