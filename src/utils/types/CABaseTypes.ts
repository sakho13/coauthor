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

export const Novel_Type = {
  0: "SERIAL",
  1: "SINGLE",
} as const

export type CoAuthor_NovelChapter = {
  id: number
  order: number
  title: string
  content: string
}
