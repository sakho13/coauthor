import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { ApiV1 } from "@/utils/types/CAApiIO"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["NovelChapterContent"]["Post"]["Out"]>()

  const { data, status } = await api.execute(async () => {
    const token = await api.verifyAuthorizationHeader(
      api.parseAuthorizationHeader(req),
    )
    console.log(token)

    return {
      success: true,
      data: {
        novelId: "",
        chapterId: 1,
      },
    }
  })

  return NextResponse.json(data, { status })
}
