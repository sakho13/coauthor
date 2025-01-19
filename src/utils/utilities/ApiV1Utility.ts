import { ApiV1BaseOut, ApiV1 } from "../types/CAApiIO"

export class ApiV1Utility {
  public static async postUser(accessToken: string) {
    const result = await fetch("/api/v1/user", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return this.parseResponse<ApiV1["User"]["Post"]["Out"]>(result)
  }

  public static async postNovel(
    accessToken: string,
    input: ApiV1["Novel"]["Post"]["In"],
  ) {
    const result = await fetch("/api/v1/novel", {
      method: "POST",
      body: JSON.stringify(input),
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return this.parseResponse<ApiV1["Novel"]["Post"]["Out"]>(result)
  }

  private static async parseResponse<T>(
    response: Response,
  ): Promise<ApiV1BaseOut<T>> {
    if (response.ok) {
      return (await response.json()) as ApiV1BaseOut<T>
    }
    return {
      success: false,
      error: {
        code: "API_ERROR",
        message: "APIエラーが発生しました",
        columns: [],
      },
    } satisfies ApiV1BaseOut<T>
  }
}
