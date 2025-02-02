export type CoAuthor_User = {
  id: string
  name: string
}

export type CoAuthor_Novel = {
  id: string
  title: string
  summary: string
  type: (typeof Novel_Type)[keyof typeof Novel_Type]
}

export type CoAuthor_Novel_AppendedDate = CoAuthor_Novel & {
  updatedAt: string
  createdAt: string
}

export const Novel_Type = {
  0: "SERIAL",
  1: "SINGLE",
} as const

export type CoAuthor_NovelChapter = {
  id: string
  order: number
  title: string
  content: string
}

export type CoAuthor_NovelChapter_AppendedDate = CoAuthor_NovelChapter & {
  updatedAt: string
  createdAt: string
}
