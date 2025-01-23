import { CoAuthorError } from "../CoAuthorError"
import { CoAuthorNovelRepository } from "../repositories/CoAuthorNovelRepository"

export class CoAuthorNovelService {
  constructor(private novelRepository: CoAuthorNovelRepository) {}

  public static create() {
    const novelRepository = new CoAuthorNovelRepository()
    return new CoAuthorNovelService(novelRepository)
  }

  public async fetchNovel(userId: string, novelId: string) {
    const novel = await this.novelRepository.fetchNovel(userId, novelId)
    if (!novel) {
      throw new CoAuthorError({
        code: "NOVEL_NOT_FOUND",
        message: "小説が見つかりませんでした。",
      })
    }
    return novel
  }

  public async deleteNovel(userId: string, novelId: string, code: string) {
    if (!this._passDeleteCheck(novelId, code)) {
      throw new CoAuthorError({
        code: "CANT_DELETE_NOVEL",
        message: "削除コードが正しくありません。",
      })
    }
    const novel = await this.novelRepository.fetchNovel(userId, novelId)
    if (!novel) {
      throw new CoAuthorError({
        code: "NOVEL_NOT_FOUND",
        message: "小説が見つかりませんでした。",
      })
    }
    await this.novelRepository.deleteCompletely(userId, novelId)
    return novel.id
  }

  private _passDeleteCheck(novelId: string, code: string) {
    return novelId.length >= 4 && novelId.startsWith(code) && code.length == 4
  }
}
