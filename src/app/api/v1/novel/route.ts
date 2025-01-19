import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { CoAuthorError } from "@/utils/classes/CoAuthorError"
import { CoAuthorNovelRepository } from "@/utils/classes/repositories/CoAuthorNovelRepository"
import { CoAuthorUserRepository } from "@/utils/classes/repositories/CoAuthorUserRepository"
import { CoAuthorNovelService } from "@/utils/classes/services/CoAuthorNovelService"
import { CoAuthorUserService } from "@/utils/classes/services/CoAuthorUserService"
import { prisma } from "@/utils/prisma"
import {
  ApiV1,
  ApiV1ErrorOut,
  ApiV1ErrorOutColumn,
} from "@/utils/types/CAApiIO"
import { Novel_Type } from "@/utils/types/CABaseTypes"
import { NextRequest, NextResponse } from "next/server"

/**
 * 小説を新規作成する
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["Novel"]["Post"]["Out"]>()

  const result = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const data = await req.json()

    if (
      !api.parseValidateResult<ApiV1["Novel"]["Post"]["In"]>(
        data,
        _validatePost,
      )
    )
      throw new Error("Invalid data")

    const registeredNum = await prisma.novel.count({
      where: { author: { firebaseUid: token.uid } },
    })
    if (registeredNum >= 10) {
      throw new CoAuthorError({
        code: "NOVEL_LIMIT",
        message: "小説登録の上限に達しています。（最大10件）",
      })
    }

    const result = await prisma.novel.create({
      data: {
        title: data.title,
        summary: data.summary,
        type: Number(data.novelType),
        status: 0,
        author: { connect: { firebaseUid: token.uid } },
      },
    })

    return {
      success: true,
      data: {
        novel: {
          id: result.id,
          title: result.title,
          summary: result.summary,
          type: result.type === 0 ? Novel_Type[0] : Novel_Type[1],
        },
      },
    }
  })

  return NextResponse.json(result.data, { status: result.status })
}

export async function DELETE(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["Novel"]["Delete"]["Out"]>()

  const result = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const data = await req.json()

    if (
      !api.parseValidateResult<ApiV1["Novel"]["Delete"]["In"]>(
        data,
        _validateDelete,
      )
    )
      throw new Error("Invalid data")

    const userRepo = new CoAuthorUserRepository()
    const novelRepo = new CoAuthorNovelRepository()

    const userService = new CoAuthorUserService(userRepo)
    const user = await userService.fetchUserByFirebaseUid(token.uid)

    const novelService = new CoAuthorNovelService(novelRepo)

    await novelService.deleteNovel(user.id, data.novelId, data.code)

    return {
      success: true,
      data: {
        novelId: "novelId",
      },
    }
  })

  return NextResponse.json(result.data, { status: result.status })
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
  )
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "title", message: "タイトルは必須です" }],
    }

  if (!("summary" in data) || typeof data.summary !== "string")
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "summary", message: "内容は必須です" }],
    }

  if (!("novelType" in data) || typeof data.novelType !== "string")
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "novelType", message: "小説種類は必須です" }],
    }

  if (data.title.length > 100)
    columns.push({
      name: "title",
      message: "タイトルは100文字以内で入力してください",
    })
  if (data.summary.length > 500)
    columns.push({
      name: "summary",
      message: "内容は500文字以内で入力してください",
    })
  if (data.novelType !== "0" && data.novelType !== "1")
    columns.push({
      name: "novelType",
      message: "小説種類が不正です",
    })

  if (columns.length > 0)
    return {
      code: "INVALID_DATA",
      message: "入力値が指定範囲外です。",
      columns,
    }

  return null
}

function _validateDelete(data: unknown): ApiV1ErrorOut | null {
  const columns: ApiV1ErrorOutColumn[] = []

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
  )
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "novelId", message: "小説IDは必須です" }],
    }

  if (
    !("code" in data) ||
    typeof data.code !== "string" ||
    data.code.length < 1
  ) {
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "code", message: "削除コードは必須です" }],
    }
  }

  if (data.novelId.length > 50)
    columns.push({
      name: "novelId",
      message: "小説IDは50文字以内で入力してください",
    })
  if (data.code.length !== 4) {
    columns.push({
      name: "code",
      message: "削除コードは4文字で入力してください",
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
