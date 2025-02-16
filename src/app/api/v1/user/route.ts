import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { CoAuthorUserService } from "@/utils/classes/services/CoAuthorUserService"
import { CoAuthorUserRepository } from "@/utils/classes/repositories/CoAuthorUserRepository"
import {
  ApiV1,
  ApiV1ErrorOut,
  ApiV1ErrorOutColumn,
} from "@/utils/types/CAApiIO"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/utils/prisma"
import { notExistAllItems } from "@/utils/functions/notExistAllItems"

export async function GET(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["User"]["Get"]["Out"]>()

  const result = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const userRepository = new CoAuthorUserRepository(prisma)
    const caUser = new CoAuthorUserService(userRepository)

    const user = await caUser.fetchUserByFirebaseUid(token.uid)

    return {
      success: true,
      data: {
        user: {
          email: user.email,
          name: user.name,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
    }
  })

  return NextResponse.json(result.data, { status: result.status })
}

/**
 * ユーザデータの初期化
 * @description Firebaseとの連携用
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["User"]["Post"]["Out"]>()

  const result = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const userRepository = new CoAuthorUserRepository(prisma)
    const caUser = new CoAuthorUserService(userRepository)

    const { status: loginResult, user } =
      await caUser.registerAndLoginByFirebaseUid(token.uid, {
        email: token.email,
        username: token.name ?? "unknown",
      })

    return {
      success: true,
      data: {
        user: {
          email: user.email,
          name: user.name,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        status: loginResult,
      },
    }
  })

  return NextResponse.json(result.data, { status: result.status })
}

export async function PATCH(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["User"]["Patch"]["Out"]>()

  return await api.executeV2(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const data = await req.json()

    if (
      !api.parseValidateResult<ApiV1["User"]["Patch"]["In"]>(
        data,
        _validatePatch,
      )
    )
      throw new Error("Invalid data")

    const userRepository = new CoAuthorUserRepository(prisma)
    const userService = new CoAuthorUserService(userRepository)

    const user = await userService.fetchUserByFirebaseUid(token.uid)

    const updatedUser = await userService.updateUserData(user.id, {
      name: data.name,
    })

    return {
      success: true,
      data: {
        user: {
          email: updatedUser.email,
          name: updatedUser.name,
          createdAt: updatedUser.createdAt.toISOString(),
          updatedAt: updatedUser.updatedAt.toISOString(),
        },
      },
    }
  })
}

function _validatePatch(data: unknown): ApiV1ErrorOut | null {
  const columns: ApiV1ErrorOutColumn[] = []

  if (typeof data !== "object" || data === null) {
    return {
      code: "INVALID_DATA",
      message: "入力値が不適切です。",
      columns: [],
    }
  }

  // 入力値チェック
  if (notExistAllItems(Object.keys(data), ["name"])) {
    return {
      code: "INVALID_DATA",
      message: "編集項目が空です。",
      columns: [],
    }
  }

  if ("name" in data) {
    if (typeof data.name !== "string") {
      columns.push({
        name: "name",
        message: "名前は文字列で入力してください",
      })
    }
  }

  if (columns.length > 0) {
    return {
      code: "INVALID_DATA",
      message: "入力値が指定範囲外です。",
      columns,
    }
  }

  return null
}
