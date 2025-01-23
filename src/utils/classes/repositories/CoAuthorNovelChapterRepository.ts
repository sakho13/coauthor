import { prisma } from "@/utils/prisma"

export class CoAuthorNovelChapterRepository {
  /**
   * 小説本文を除いた情報を取得する
   * @param userId
   * @param novelId
   * @returns
   */
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

  public async fetchChapterContent(
    userId: string,
    novelId: string,
    chapterId: number,
  ) {
    return await prisma.chapter.findFirst({
      select: {
        content: true,
      },
      where: {
        novel: {
          authorId: userId,
        },
        novelId,
        id: Number(chapterId),
      },
    })
  }

  public async updateChapterContent(
    userId: string,
    novelId: string,
    chapterId: number,
    content: string,
  ) {
    return await prisma.chapter.update({
      select: {
        id: true,
        novelId: true,
      },
      where: {
        novel: {
          authorId: userId,
        },
        novelId_id: {
          novelId,
          id: chapterId,
        },
      },
      data: {
        content,
      },
    })
  }
}
