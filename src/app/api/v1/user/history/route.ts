import { CoAuthorApi } from "@/utils/classes/CoAuthorApi"
import { ApiV1 } from "@/utils/types/CAApiIO"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const api = new CoAuthorApi<ApiV1["UserHistory"]["Get"]["Out"]>()

  return await api.executeV2(async () => {
    const token = await api.verifyAuthorizationHeader(
      req.headers.get("authorization"),
    )
    console.log(token)

    return {
      success: true,
      data: {
        latestNovelUpdates: [],
      },
    }
  })
}
