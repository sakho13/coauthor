import { Meta, StoryObj } from "@storybook/react"
import { SubParagraph } from "./SubParagraph"

const meta = {
  title: "atoms/SubParagraph",
  component: SubParagraph,
  parameters: {
    layout: "centered",
  },
  args: {
    id: "sub-paragraph",
  },
} satisfies Meta<typeof SubParagraph>

export default meta

type Story = StoryObj<typeof SubParagraph>

export const Default: Story = {
  args: {
    children: "This is a sub paragraph.",
  },
}

export const InParagraph: Story = {
  args: {
    children: <p>This is a sub paragraph.</p>,
  },
}
