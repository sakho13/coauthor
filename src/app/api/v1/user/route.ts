import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { CoAuthorUserService } from "@/utils/classes/services/CoAuthorUserService"
import { CoAuthorUserRepository } from "@/utils/classes/repositories/CoAuthorUserRepository"
import { ApiV1 } from "@/utils/types/CAApiIO"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/utils/prisma"

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
          id: user.id,
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
