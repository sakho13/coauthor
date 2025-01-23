import { CoAuthorError } from "../CoAuthorError"
import { CoAuthorNovelChapterRepository } from "../repositories/CoAuthorNovelChapterRepository"
import { CoAuthorNovelRepository } from "../repositories/CoAuthorNovelRepository"

export class CoAuthorNovelChapterService {
  constructor(
    private novelRepository: CoAuthorNovelRepository,
    private novelChapterRepository: CoAuthorNovelChapterRepository,
  ) {}

  public static create() {
    const novelRepository = new CoAuthorNovelRepository()
    const novelChapterRepository = new CoAuthorNovelChapterRepository()
    return new CoAuthorNovelChapterService(
      novelRepository,
      novelChapterRepository,
    )
  }

  public async fetchNovelChapters(userId: string, novelId: string) {
    const novelNum = await this.novelRepository.countOwnNovels(userId, novelId)
    if (novelNum === 0) {
      throw new CoAuthorError({
        code: "NOVEL_NOT_FOUND",
        message: "小説が見つかりません。",
        columns: [],
      })
    }

    return await this.novelChapterRepository.fetchNovelChapters(userId, novelId)
  }

  public async appendChapterAtEnd(
    userId: string,
    novelId: string,
    title: string,
  ) {
    const novelNum = await this.novelRepository.countOwnNovels(userId, novelId)
    if (novelNum === 0) {
      throw new CoAuthorError({
        code: "NOVEL_NOT_FOUND",
        message: "小説が見つかりません。",
        columns: [],
      })
    }

    return await this.novelChapterRepository.addNewChapter(
      userId,
      novelId,
      title,
    )
  }

  /**
   * 小説本文を取得する
   * @param userId
   * @param novelId
   * @param chapterId
   * @returns
   */
  public async fetchChapterContent(
    userId: string,
    novelId: string,
    chapterId: number,
  ) {
    const novelNum = await this.novelRepository.countOwnNovels(userId, novelId)
    if (novelNum === 0) {
      throw new CoAuthorError({
        code: "NOVEL_NOT_FOUND",
        message: "小説が見つかりません。",
        columns: [],
      })
    }

    return await this.novelChapterRepository.fetchChapterContent(
      userId,
      novelId,
      chapterId,
    )
  }

  /**
   * 小説本文を更新する
   * @param userId
   * @param novelId
   * @param chapterId
   * @param content 本文 (70,000文字以内)
   * @returns
   */
  public async updateChapterContent(
    userId: string,
    novelId: string,
    chapterId: number,
    content: string,
  ) {
    const novelNum = await this.novelRepository.countOwnNovels(userId, novelId)
    if (novelNum === 0) {
      throw new CoAuthorError({
        code: "NOVEL_NOT_FOUND",
        message: "小説が見つかりません。",
      })
    }

    if (content.length > 70000)
      throw new CoAuthorError({
        code: "CONTENT_TOO_LONG",
        message: "本文は70,000文字以内です。",
      })

    return await this.novelChapterRepository.updateChapterContent(
      userId,
      novelId,
      chapterId,
      content,
    )
  }
}
