import { prisma } from "@/utils/prisma"

export class CoAuthorNovelChapterRepository {
  public async fetchNovelChapters(userId: string, novelId: string) {
    return await prisma.chapter.findMany({
      select: {
        id: true,
        order: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        novel: {
          authorId: userId,
        },
        novelId,
      },
      orderBy: {
        order: "asc",
      },
    })
  }

  public async addNewChapter(userId: string, novelId: string, title: string) {
    return await prisma.chapter.create({
      data: {
        title,
        content: "",
        novel: {
          connect: {
            id: novelId,
            authorId: userId,
          },
        },
      },
    })
  }
}
