import type { Prisma, Novel } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NovelCreateArgs>({
  novel: {
    one: { data: { title: 'String', updatedAt: '2024-11-14T11:28:50.427Z' } },
    two: { data: { title: 'String', updatedAt: '2024-11-14T11:28:50.427Z' } },
  },
})

export type StandardScenario = ScenarioData<Novel, 'novel'>
