import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { CoAuthorError } from "@/utils/classes/CoAuthorError"
import { CoAuthorNovelChapterService } from "@/utils/classes/services/CoAuthorNovelChapterService"
import { CoAuthorUserService } from "@/utils/classes/services/CoAuthorUserService"
import {
  ApiV1,
  ApiV1ErrorOut,
  ApiV1ErrorOutColumn,
} from "@/utils/types/CAApiIO"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["NovelChapterContent"]["Get"]["Out"]>()

  return await api.executeV2(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const novelId = req.nextUrl.searchParams.get("novel_id")
    const chapterId = req.nextUrl.searchParams.get("chapter_id")

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
    if (chapterId === null) {
      throw new CoAuthorError({
        code: "INVALID_PARAMS",
        message: "リクエスト内容に不整合があります。",
        columns: [
          {
            name: "chapter_id",
            message: "必須パラメータです。",
          },
        ],
      })
    }

    const userService = CoAuthorUserService.create()
    const novelChapterService = CoAuthorNovelChapterService.create()

    const user = await userService.fetchUserByFirebaseUid(token.uid)

    return {
      success: true,
      data: {
        novelId: novelId,
        chapterId,
        content:
          (
            await novelChapterService.fetchChapterContent(
              user.id,
              novelId,
              chapterId,
            )
          )?.content ?? "",
      },
    }
  })
}

export async function POST(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["NovelChapterContent"]["Post"]["Out"]>()

  const { data, status } = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const data = await req.json()
    if (
      !api.parseValidateResult<ApiV1["NovelChapterContent"]["Post"]["In"]>(
        data,
        _validatePost,
      )
    )
      throw new Error("Invalid data")

    const userService = CoAuthorUserService.create()
    const novelChapterService = CoAuthorNovelChapterService.create()

    const user = await userService.fetchUserByFirebaseUid(token.uid)

    const created = await novelChapterService.updateChapterContent(
      user.id,
      data.novelId,
      data.chapterId,
      data.content,
    )

    return {
      success: true,
      data: {
        novelId: created.novelId,
        chapterId: created.id,
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

  if (!("novelId" in data) || typeof data.novelId !== "string")
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "novelId", message: "小説IDは必須です" }],
    }

  if (!("chapterId" in data) || typeof data.chapterId !== "string")
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "chapterId", message: "章IDは必須です" }],
    }

  if (!("content" in data) || typeof data.content !== "string")
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "novelType", message: "小説種類は必須です" }],
    }

  if (data.novelId.length > 0)
    columns.push({
      name: "novelId",
      message: "小説IDは必須です",
    })
  if (data.chapterId.length > 0)
    columns.push({
      name: "chapterId",
      message: "章IDは必須です",
    })
  if (data.content.length > 70000)
    columns.push({
      name: "content",
      message: "小説テキストは70000文字以内です",
    })

  if (columns.length > 0)
    return {
      code: "INVALID_DATA",
      message: "入力値が不適切です。",
      columns,
    }

  return null
}
