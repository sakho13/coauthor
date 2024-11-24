import type { Prisma, Novel } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NovelCreateArgs>({
  novel: {
    one: {
      data: {
        title: 'String',
        description: 'String',
        updatedAt: '2024-11-22T00:15:59.828Z',
        author: {
          create: {
            email: 'String3432649',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2024-11-22T00:15:59.828Z',
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        description: 'String',
        updatedAt: '2024-11-22T00:15:59.828Z',
        author: {
          create: {
            email: 'String7149177',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2024-11-22T00:15:59.828Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Novel, 'novel'>
