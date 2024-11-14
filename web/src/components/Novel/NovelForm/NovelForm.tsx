import type { EditNovelByNovelId, UpdateNovelInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormNovel = NonNullable<EditNovelByNovelId['novel']>

interface NovelFormProps {
  novel?: EditNovelByNovelId['novel']
  onSave: (data: UpdateNovelInput, novelId?: FormNovel['novelId']) => void
  error: RWGqlError
  loading: boolean
}

const NovelForm = (props: NovelFormProps) => {
  const onSubmit = (data: FormNovel) => {
    props.onSave(data, props?.novel?.novelId)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormNovel> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>

        <TextField
          name="title"
          defaultValue={props.novel?.title}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="title" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default NovelForm
