import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { CoAuthorError } from "@/utils/classes/CoAuthorError"
import { CoAuthorNovelChapterRepository } from "@/utils/classes/repositories/CoAuthorNovelChapterRepository"
import { CoAuthorNovelRepository } from "@/utils/classes/repositories/CoAuthorNovelRepository"
import { CoAuthorUserRepository } from "@/utils/classes/repositories/CoAuthorUserRepository"
import { CoAuthorNovelChapterService } from "@/utils/classes/services/CoAuthorNovelChapterService"
import { CoAuthorNovelService } from "@/utils/classes/services/CoAuthorNovelService"
import { CoAuthorUserService } from "@/utils/classes/services/CoAuthorUserService"
import { prisma } from "@/utils/prisma"
import { ApiV1ErrorOut, ApiV1 } from "@/utils/types/CAApiIO"
import { Novel_Type } from "@/utils/types/CABaseTypes"
import { ValidateUtility } from "@/utils/utilities/ValidateUtility"
import { NextRequest, NextResponse } from "next/server"

/**
 * 小説の章一覧を取得します。
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["NovelChapters"]["Get"]["Out"]>()

  const { data, status } = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const novelId = req.nextUrl.searchParams.get("novel_id")

    if (novelId === null) {
      throw new CoAuthorError({
        code: "INVALID_PARAMS",
        message: "リクエスト内容に不整合があります。",
        columns: [
          {
            name: "novel_id",
            message: "必須パラメータです。",
          },
        ],
      })
    }

    const userRepo = new CoAuthorUserRepository(prisma)
    const novelRepo = new CoAuthorNovelRepository()

    const userService = new CoAuthorUserService(userRepo)
    const user = await userService.fetchUserByFirebaseUid(token.uid)

    const novelService = new CoAuthorNovelService(novelRepo)

    const novel = await novelService.fetchNovel(user.id, novelId)

    const novelChapterService = new CoAuthorNovelChapterService(
      novelRepo,
      new CoAuthorNovelChapterRepository(),
    )

    const chapters = await novelChapterService.fetchNovelChapters(
      user.id,
      novelId,
    )

    return {
      success: true,
      data: {
        novel: {
          id: novel.id,
          title: novel.title,
          summary: novel.summary,
          type: novel.type === 0 ? Novel_Type[0] : Novel_Type[1],
          createdAt: novel.createdAt.toISOString(),
          updatedAt: novel.updatedAt.toISOString(),
        },
        chapters: chapters.map((chapter) => ({
          id: chapter.id,
          order: chapter.order,
          title: chapter.title,
          createdAt: chapter.createdAt.toISOString(),
          updatedAt: chapter.updatedAt.toISOString(),
        })),
      },
    }
  })

  return NextResponse.json(data, { status })
}

/**
 * 小説の章の順序を更新します。
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["NovelChapters"]["Post"]["Out"]>()

  const { data, status } = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const data = await req.json()

    if (
      !api.parseValidateResult<ApiV1["NovelChapters"]["Post"]["In"]>(
        data,
        _validatePost,
      )
    )
      throw new Error("Invalid data")

    const novel = await prisma.novel.findFirst({
      where: {
        author: { firebaseUid: token.uid },
        id: data.novelId,
      },
      select: {
        id: true,
      },
    })

    if (!novel) {
      throw new CoAuthorError({
        code: "NOVEL_NOT_FOUND",
        message: "この小説へのアクセス権限がありません。",
        columns: [],
      })
    }

    const chapterNum = await prisma.chapter.count({
      where: {
        novelId: data.novelId,
        novel: {
          author: { firebaseUid: token.uid },
        },
      },
    })

    if (chapterNum !== data.orders.length) {
      throw new CoAuthorError({
        code: "INVALID_DATA",
        message: "更新データが不十分です。",
        columns: [],
      })
    }

    // prisma.cA_Chapter.updateMany()

    return {
      success: true,
      data: {
        chapters: [],
      },
    }
  })

  return NextResponse.json(data, { status })
}

function _validatePost(data: unknown): ApiV1ErrorOut | null {
  if (typeof data !== "object" || data === null)
    return {
      code: "INVALID_DATA",
      message: "入力値が不適切です。",
      columns: [],
    }

  if (
    !("novelId" in data) ||
    typeof data.novelId !== "string" ||
    data.novelId.length < 1
  ) {
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "novelId", message: "小説IDは必須です" }],
    }
  }

  if (!("orders" in data) || !Array.isArray(data.orders)) {
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "orders", message: "更新データは必須です" }],
    }
  }

  if (
    data.orders.some(
      (o) =>
        !("chapterId" in o) ||
        !ValidateUtility.isInt(o.chapterId) ||
        !("order" in o) ||
        !ValidateUtility.isInt(o.order),
    )
  ) {
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "orders", message: "更新データが不正です" }],
    }
  }

  if (
    data.orders.length !==
    Array.from(new Set(data.orders.map((o) => o.chapterId))).length
  ) {
    throw new CoAuthorError({
      code: "INVALID_DATA",
      message: "入力値が不適切です。",
      columns: [{ name: "chapterId", message: "章IDが重複しています" }],
    })
  }

  if (
    data.orders.length !==
    Array.from(new Set(data.orders.map((o) => o.order))).length
  ) {
    throw new CoAuthorError({
      code: "INVALID_DATA",
      message: "入力値が不適切です。",
      columns: [{ name: "orders", message: "章順序が重複しています" }],
    })
  }

  return null
}
