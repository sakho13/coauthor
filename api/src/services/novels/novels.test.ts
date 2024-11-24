import type { Novel } from '@prisma/client'

import { novels, novel, createNovel, updateNovel, deleteNovel } from './novels'
import type { StandardScenario } from './novels.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('novels', () => {
  scenario('returns all novels', async (scenario: StandardScenario) => {
    const result = await novels()

    expect(result.length).toEqual(Object.keys(scenario.novel).length)
  })

  scenario('returns a single novel', async (scenario: StandardScenario) => {
    const result = await novel({ novelId: scenario.novel.one.novelId })

    expect(result).toEqual(scenario.novel.one)
  })

  scenario('creates a novel', async (scenario: StandardScenario) => {
    const result = await createNovel({
      input: {
        authorId: scenario.novel.two.authorId,
        title: 'String',
        description: 'String',
        updatedAt: '2024-11-22T00:15:59.822Z',
      },
    })

    expect(result.authorId).toEqual(scenario.novel.two.authorId)
    expect(result.title).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2024-11-22T00:15:59.822Z'))
  })

  scenario('updates a novel', async (scenario: StandardScenario) => {
    const original = (await novel({
      novelId: scenario.novel.one.novelId,
    })) as Novel
    const result = await updateNovel({
      novelId: original.novelId,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a novel', async (scenario: StandardScenario) => {
    const original = (await deleteNovel({
      novelId: scenario.novel.one.novelId,
    })) as Novel
    const result = await novel({ novelId: original.novelId })

    expect(result).toEqual(null)
  })
})
