import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String42108',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2024-11-16T07:03:10.616Z',
      },
    },
    two: {
      data: {
        email: 'String8369401',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2024-11-16T07:03:10.616Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
