import type { Meta, StoryObj } from '@storybook/react'

import MyBookshelfPage from './MyBookshelfPage'

const meta: Meta<typeof MyBookshelfPage> = {
  component: MyBookshelfPage,
}

export default meta

type Story = StoryObj<typeof MyBookshelfPage>

export const Primary: Story = {}
