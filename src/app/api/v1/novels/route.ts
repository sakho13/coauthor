import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { prisma } from "@/utils/prisma"
import { ApiV1 } from "@/utils/types/CAApiIO"
import { Novel_Type } from "@/utils/types/CABaseTypes"
import { NextRequest, NextResponse } from "next/server"

/**
 * 小説の一覧を取得する
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["Novels"]["Get"]["Out"]>()

  const { data, status } = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )

    const result = await prisma.novel.findMany({
      where: {
        author: {
          firebaseUid: token.uid,
        },
      },
    })

    return {
      success: true,
      data: {
        novels: result.map((novel) => ({
          id: novel.id,
          title: novel.title,
          summary: novel.summary,
          type: novel.type === 0 ? Novel_Type[0] : Novel_Type[1],
          createdAt: novel.createdAt.toISOString(),
          updatedAt: novel.updatedAt.toISOString(),
        })),
      },
    }
  })

  return NextResponse.json(data, { status })
}
