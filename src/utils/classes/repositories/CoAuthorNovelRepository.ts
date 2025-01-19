import { prisma } from "@/utils/prisma"
import { Novel_Type } from "@/utils/types/CABaseTypes"

export class CoAuthorNovelRepository {
  public async fetchNovels(userId: string) {
    return await prisma.novel.findMany({
      where: {
        authorId: userId,
      },
    })
  }

  public async fetchNovel(userId: string, novelId: string) {
    return await prisma.novel.findUnique({
      where: {
        authorId: userId,
        id: novelId,
      },
    })
  }

  public async countOwnNovels(userId: string, novelId?: string) {
    return await prisma.novel.count({
      where: { authorId: userId, id: novelId },
    })
  }

  public async createNovel(
    userId: string,
    title: string,
    summary: string,
    novelType: keyof typeof Novel_Type,
  ) {
    return await prisma.novel.create({
      data: {
        title,
        summary,
        type: Number(novelType),
        status: 0,
        authorId: userId,
      },
    })
  }

  public async deleteCompletely(userId: string, novelId: string) {
    return await prisma.novel.delete({
      where: {
        authorId: userId,
        id: novelId,
      },
    })
  }
}
