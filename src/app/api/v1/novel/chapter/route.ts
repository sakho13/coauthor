import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { CoAuthorError } from "@/utils/classes/CoAuthorError"
import { CoAuthorNovelChapterRepository } from "@/utils/classes/repositories/CoAuthorNovelChapterRepository"
import { CoAuthorNovelRepository } from "@/utils/classes/repositories/CoAuthorNovelRepository"
import { CoAuthorUserRepository } from "@/utils/classes/repositories/CoAuthorUserRepository"
import { CoAuthorNovelChapterService } from "@/utils/classes/services/CoAuthorNovelChapterService"
import { CoAuthorUserService } from "@/utils/classes/services/CoAuthorUserService"
import { prisma } from "@/utils/prisma"
import {
  ApiV1,
  ApiV1ErrorOut,
  ApiV1ErrorOutColumn,
} from "@/utils/types/CAApiIO"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["NovelChapter"]["Post"]["Out"]>()

  const { data, status } = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const data = await req.json()

    if (
      !api.parseValidateResult<ApiV1["NovelChapter"]["Post"]["In"]>(
        data,
        _validatePost,
      )
    )
      throw new Error("Invalid data")

    const userRepo = new CoAuthorUserRepository(prisma)
    const userService = new CoAuthorUserService(userRepo)

    const user = await userService.fetchUserByFirebaseUid(token.uid)
    if (!user)
      throw new CoAuthorError({
        code: "USER_NOT_FOUND",
        message: "ユーザーが見つかりませんでした。",
      })

    const novelRepo = new CoAuthorNovelRepository()
    const novelChapterRepo = new CoAuthorNovelChapterRepository()
    const novelChapterService = new CoAuthorNovelChapterService(
      novelRepo,
      novelChapterRepo,
    )

    const created = await novelChapterService.appendChapterAtEnd(
      user.id,
      data.novelId,
      data.title,
    )

    return {
      success: true,
      data: {
        novelId: created.novelId,
        chapterId: created.id,
        title: created.title,
      },
    }
  })

  return NextResponse.json(data, { status })
}

function _validatePost(data: unknown): ApiV1ErrorOut | null {
  const columns: ApiV1ErrorOutColumn[] = []

  if (typeof data !== "object" || data === null)
    return {
      code: "INVALID_DATA",
      message: "入力値が不適切です。",
      columns: [],
    }

  if (
    !("title" in data) ||
    typeof data.title !== "string" ||
    data.title.length < 1
  ) {
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "title", message: "タイトルは必須です" }],
    }
  }

  if (!("novelId" in data) || typeof data.novelId !== "string") {
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "novelId", message: "小説IDは必須です" }],
    }
  }

  if (data.title.length > 100) {
    columns.push({
      name: "title",
      message: "タイトルは100文字以内で入力してください",
    })
  }

  if (columns.length > 0)
    return {
      code: "INVALID_DATA",
      message: "入力値が指定範囲外です。",
      columns,
    }

  return null
}
