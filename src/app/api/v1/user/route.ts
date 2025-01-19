import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { CoAuthorUserService } from "@/utils/classes/services/CoAuthorUserService"
import { CoAuthorUserRepository } from "@/utils/classes/repositories/CoAuthorUserRepository"
import { ApiV1 } from "@/utils/types/CAApiIO"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["User"]["Get"]["Out"]>()

  const result = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const userRepository = new CoAuthorUserRepository()
    const caUser = new CoAuthorUserService(userRepository)

    const { user } = await caUser.registerAndLoginByFirebaseUid(token.uid, {
      email: token.email,
      username: token.name ?? "unknown",
    })

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
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
  const api = new CoAuthorApi<ApiV1["User"]["Get"]["Out"]>()

  const result = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const userRepository = new CoAuthorUserRepository()
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
          id: user.id,
          email: user.email,
          name: user.name,
        },
        status: loginResult,
      },
    }
  })

  return NextResponse.json(result.data, { status: result.status })
}
