import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { CoAuthorNovelRepository } from "@/utils/classes/repositories/CoAuthorNovelRepository"
import { CoAuthorUserRepository } from "@/utils/classes/repositories/CoAuthorUserRepository"
import { CoAuthorNovelService } from "@/utils/classes/services/CoAuthorNovelService"
import { CoAuthorUserService } from "@/utils/classes/services/CoAuthorUserService"
import { notExistAllItems } from "@/utils/functions/notExistAllItems"
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

    const userRepo = new CoAuthorUserRepository(prisma)
    const userService = new CoAuthorUserService(userRepo)
    const user = await userService.fetchUserByFirebaseUid(token.uid)

    const novelRepo = new CoAuthorNovelRepository()
    const novelService = new CoAuthorNovelService(novelRepo)

    const result = await novelService.createNovelByDefault(user.id)

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

export async function PATCH(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["Novel"]["PATCH"]["Out"]>()

  return await api.executeV2(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const data = await req.json()

    if (
      !api.parseValidateResult<ApiV1["Novel"]["PATCH"]["In"]>(
        data,
        _validatePatch,
      )
    )
      throw new Error("Invalid data")

    const userRepo = new CoAuthorUserRepository(prisma)
    const userService = new CoAuthorUserService(userRepo)
    const user = await userService.fetchUserByFirebaseUid(token.uid)

    const novelRepo = new CoAuthorNovelRepository()
    const novelService = new CoAuthorNovelService(novelRepo)

    const result = await novelService.updateNovelData(user.id, data.novelId, {
      ...data,
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

    const userRepo = new CoAuthorUserRepository(prisma)
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

function _validatePatch(data: unknown): ApiV1ErrorOut | null {
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
  ) {
    return {
      code: "INVALID_DATA",
      message: "入力値が不十分です。",
      columns: [{ name: "novelId", message: "小説IDは必須です" }],
    }
  }

  // 入力値チェック
  if (notExistAllItems(Object.keys(data), ["title", "summary", "novelType"])) {
    return {
      code: "INVALID_DATA",
      message: "編集項目が空です。",
      columns: [],
    }
  }

  if ("title" in data) {
    if (typeof data.title !== "string") {
      columns.push({
        name: "title",
        message: "タイトルは文字列で入力してください",
      })
    }
  }

  if ("summary" in data) {
    if (typeof data.summary !== "string") {
      columns.push({
        name: "summary",
        message: "内容は文字列で入力してください",
      })
    }
  }

  if ("novelType" in data) {
    if (typeof data.novelType !== "string") {
      columns.push({
        name: "novelType",
        message: "小説種類は文字列で入力してください",
      })
    } else if (data.novelType !== "0" && data.novelType !== "1") {
      columns.push({
        name: "novelType",
        message: "小説種類が不正です",
      })
    }
  }

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
