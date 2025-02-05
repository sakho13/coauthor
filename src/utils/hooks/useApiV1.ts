import { toast } from "sonner"
import { ApiV1, ApiV1BaseOut } from "../types/CAApiIO"

export function useApiV1() {
  /**
   * POST /api/v1/user
   */
  async function postUser(accessToken: string) {
    const result = await fetch("/api/v1/user", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return _parseResponse<ApiV1["User"]["Post"]["Out"]>(result)
  }

  /**
   * POST /api/v1/novel
   */
  async function postNovel(
    accessToken: string,
    input: ApiV1["Novel"]["Post"]["In"],
  ) {
    const result = await fetch("/api/v1/novel", {
      method: "POST",
      body: JSON.stringify(input),
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return _parseResponse<ApiV1["Novel"]["Post"]["Out"]>(result)
  }

  return {
    postUser,
    postNovel,
  }
}

async function _parseResponse<T>(response: Response): Promise<ApiV1BaseOut<T>> {
  if (response.ok) {
    return (await response.json()) as ApiV1BaseOut<T>
  }
  toast.error(
    "システムに不具合が発生しております。しばらくしてからアクセスしてください。",
    {
      description: `CODE: ${response.status}`,
    },
  )
  return {
    success: false,
    error: {
      code: "API_ERROR",
      message: "APIエラーが発生しました",
      columns: [],
    },
  } satisfies ApiV1BaseOut<T>
}
