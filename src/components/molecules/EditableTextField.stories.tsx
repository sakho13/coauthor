import { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { EditableTextField } from "./EditableTextField"
import { useState } from "react"

const meta = {
  title: "molecules/EditableTextField",
  component: EditableTextField,
  parameters: {
    layout: "centered",
  },
  args: {
    value: "This is a text.",
    onChange: fn(),
    onEditSubmit: fn(),
  },
} satisfies Meta<typeof EditableTextField>

export default meta

type Story = StoryObj<typeof EditableTextField>

export const Default: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [text, setText] = useState(args.value)

    return (
      <EditableTextField
        {...args}
        value={text}
        onChange={setText}
        onEditSubmit={async () => {
          alert(`onEditSubmit: ${text}`)
        }}
      />
    )
  },
  args: {
    value: "初期テキスト",
  },
}
