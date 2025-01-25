import { CoAuthorError } from "../CoAuthorError"
import { CoAuthorNovelChapterRepository } from "../repositories/CoAuthorNovelChapterRepository"
import { CoAuthorNovelRepository } from "../repositories/CoAuthorNovelRepository"
import { CoAuthorNovelChapterService } from "./CoAuthorNovelChapterService"

jest.mock("../repositories/CoAuthorNovelRepository")
jest.mock("../repositories/CoAuthorNovelChapterRepository")

describe("CoAuthorNovelChapterService", () => {
  describe("fetchChapterContent", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.resetAllMocks()
    })

    test("正常", async () => {
      const novelId = "sabc7o54dpqauf573ug3gotj"
      const chapterId = 1

      const spyNovelRepository = jest
        .spyOn(CoAuthorNovelRepository.prototype, "countOwnNovels")
        .mockResolvedValueOnce(1)
      const spyNovelChapterRepository = jest
        .spyOn(CoAuthorNovelChapterRepository.prototype, "fetchChapterContent")
        .mockResolvedValueOnce({
          content: "content",
        })

      const novelChapterService = CoAuthorNovelChapterService.create()
      await expect(
        novelChapterService.fetchChapterContent(
          "9c71bbab-917b-4114-bb39-4fb2ce08d515",
          novelId,
          chapterId,
        ),
      ).resolves.toEqual({
        content: "content",
      })
      expect(spyNovelRepository).toHaveBeenCalled()
      expect(spyNovelChapterRepository).toHaveBeenCalled()
    })

    test("小説が見つからない", async () => {
      const novelId = "sabc7o54dpqauf573ug3gotj"
      const chapterId = 1

      const spyCountOwnNovels = jest
        .spyOn(CoAuthorNovelRepository.prototype, "countOwnNovels")
        .mockResolvedValueOnce(0)

      const spyFetchChapterContent = jest
        .spyOn(CoAuthorNovelChapterRepository.prototype, "fetchChapterContent")
        .mockResolvedValueOnce({
          content: "content",
        })

      const novelChapterService = CoAuthorNovelChapterService.create()
      await expect(
        novelChapterService.fetchChapterContent(
          "9c71bbab-917b-4114-bb39-4fb2ce08d515",
          novelId,
          chapterId,
        ),
      ).rejects.toThrow(CoAuthorError)
      expect(spyCountOwnNovels).toHaveBeenCalled()
      expect(spyFetchChapterContent).not.toHaveBeenCalled()
    })
  })

  describe("updateChapterContent", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.resetAllMocks()
    })

    test("正常", async () => {
      const novelId = "sabc7o54dpqauf573ug3gotj"
      const chapterId = 1

      const spyNovelRepository = jest
        .spyOn(CoAuthorNovelRepository.prototype, "countOwnNovels")
        .mockResolvedValueOnce(1)
      const spyNovelChapterRepository = jest
        .spyOn(CoAuthorNovelChapterRepository.prototype, "updateChapterContent")
        .mockResolvedValueOnce({
          id: chapterId,
          novelId,
        })

      const novelChapterService = CoAuthorNovelChapterService.create()
      await expect(
        novelChapterService.updateChapterContent(
          "9c71bbab-917b-4114-bb39-4fb2ce08d515",
          novelId,
          chapterId,
          "content",
        ),
      ).resolves.toEqual({
        id: chapterId,
        novelId,
      })
      expect(spyNovelRepository).toHaveBeenCalled()
      expect(spyNovelChapterRepository).toHaveBeenCalled()
    })

    test("小説が見つからない", async () => {
      const novelId = "sabc7o54dpqauf573ug3gotj"
      const chapterId = 1

      const spyCountOwnNovels = jest
        .spyOn(CoAuthorNovelRepository.prototype, "countOwnNovels")
        .mockResolvedValueOnce(0)

      const spyUpdateChapterContent = jest
        .spyOn(CoAuthorNovelChapterRepository.prototype, "updateChapterContent")
        .mockResolvedValueOnce({
          id: chapterId,
          novelId,
        })

      const novelChapterService = CoAuthorNovelChapterService.create()
      await expect(
        novelChapterService.updateChapterContent(
          "9c71bbab-917b-4114-bb39-4fb2ce08d515",
          novelId,
          chapterId,
          "content",
        ),
      ).rejects.toThrow(CoAuthorError)
      expect(spyCountOwnNovels).toHaveBeenCalled()
      expect(spyUpdateChapterContent).not.toHaveBeenCalled()
    })

    test("小説本文が70000文字以上", async () => {
      const novelId = "sabc7o54dpqauf573ug3gotj"
      const chapterId = 1

      const spyNovelRepository = jest
        .spyOn(CoAuthorNovelRepository.prototype, "countOwnNovels")
        .mockResolvedValue(1)
      const spyNovelChapterRepository = jest.spyOn(
        CoAuthorNovelChapterRepository.prototype,
        "updateChapterContent",
      )

      const novelChapterService = CoAuthorNovelChapterService.create()
      await expect(
        novelChapterService.updateChapterContent(
          "9c71bbab-917b-4114-bb39-4fb2ce08d515",
          novelId,
          chapterId,
          "a".repeat(70001),
        ),
      ).rejects.toThrow(CoAuthorError)
      expect(spyNovelRepository).toHaveBeenCalled()
      expect(spyNovelChapterRepository).not.toHaveBeenCalled()
    })
  })
})
