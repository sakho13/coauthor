import { CoAuthorError } from "../CoAuthorError"
import { CoAuthorNovelChapterRepository } from "../repositories/CoAuthorNovelChapterRepository"
import { CoAuthorNovelRepository } from "../repositories/CoAuthorNovelRepository"

export class CoAuthorNovelChapterService {
  constructor(
    private novelRepository: CoAuthorNovelRepository,
    private novelChapterRepository: CoAuthorNovelChapterRepository,
  ) {}

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
}
