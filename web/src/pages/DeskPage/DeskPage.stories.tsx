import type { Meta, StoryObj } from '@storybook/react'

import DeskPage from './DeskPage'

const meta: Meta<typeof DeskPage> = {
  component: DeskPage,
}

export default meta

type Story = StoryObj<typeof DeskPage>

export const Primary: Story = {}
