import { prisma } from "@/utils/prisma"
import { Novel_Type } from "@/utils/types/CABaseTypes"

export class CoAuthorNovelRepository {
  /**
   * 小説一覧を取得します。
   */
  public async fetchNovels(userId: string) {
    return await prisma.novel.findMany({
      where: {
        authorId: userId,
      },
    })
  }

  /**
   * 小説を取得します。
   */
  public async fetchNovel(userId: string, novelId: string) {
    return await prisma.novel.findUnique({
      where: {
        authorId: userId,
        id: novelId,
      },
    })
  }

  /**
   * 小説が存在するかどうかを確認します。
   */
  public async existsNovel(userId: string, novelId: string) {
    return !!(await prisma.novel.findFirst({
      where: {
        authorId: userId,
        id: novelId,
      },
    }))
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

  /**
   * 小説データを更新します。
   */
  public async updateNovelData(
    userId: string,
    novelId: string,
    updates: Partial<{
      title: string
      summary: string
      type: keyof typeof Novel_Type
    }>,
  ) {
    return await prisma.novel.update({
      data: {
        title: updates.title,
        summary: updates.summary,
        type: updates.type,
      },
      where: {
        id: novelId,
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
