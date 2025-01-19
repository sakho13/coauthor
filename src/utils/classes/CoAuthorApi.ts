import { NextRequest, NextResponse } from "next/server"
import { verifyIdToken } from "../firebaseAdmin"
import { ApiV1BaseOut, ApiV1ErrorOut } from "../types/CAApiIO"
import { CoAuthorError } from "./CoAuthorError"

interface AuthorizationHeaderDecoded {
  uid: string
  email: string
  name: string
}

export class CoAuthorApi<T> {
  public async execute(
    mainLogic: () => Promise<ApiV1BaseOut<T>> | ApiV1BaseOut<T>,
  ): Promise<{ status: number; data: ApiV1BaseOut<T> }> {
    try {
      const result = await mainLogic()
      return {
        status: 200,
        data: result,
      }
    } catch (error) {
      if (error instanceof CoAuthorError) {
        return {
          status: 400,
          data: {
            success: false,
            error: {
              code: error.code,
              message: error.message,
              columns: error.columns,
            },
          },
        }
      }

      return {
        status: 400,
        data: {
          success: false,
          error: {
            code: "UnknownError",
            message: "サーバーエラーが発生しました。",
            columns: [],
          },
        },
      }
    }
  }

  public async executeV2(
    mainLogic: () => Promise<ApiV1BaseOut<T>> | ApiV1BaseOut<T>,
  ) {
    const result = await this.execute(mainLogic)
    return NextResponse.json(result.data, { status: result.status })
  }

  public parseValidateResult<I>(
    data: unknown,
    validate: (data: unknown) => ApiV1ErrorOut | null,
  ): data is I {
    const result = validate(data)
    if (result)
      throw new CoAuthorError({
        code: "InvalidData",
        message: "入力値が不適切です。",
        columns: result.columns,
      })

    return true
  }

  public parseAuthorizationHeader(req: NextRequest) {
    return req.headers.get("authorization")
  }

  public async verifyAuthorizationHeader(
    authorization: string | null | undefined,
  ): Promise<AuthorizationHeaderDecoded> {
    if (!authorization || typeof authorization !== "string")
      throw new CoAuthorError({
        code: "AuthFailed",
        message: "認証に失敗しました。認証情報が不十分です。",
      })

    if (!authorization.startsWith("Bearer "))
      throw new CoAuthorError({
        code: "AuthFailed",
        message: "認証に失敗しました。認証情報が不適格です。",
      })

    const accessToken = authorization.split(" ")[1]
    if (accessToken === undefined || accessToken === "")
      throw new CoAuthorError({
        code: "AuthFailed",
        message: "認証に失敗しました。認証情報が不十分です。",
      })

    try {
      const decoded = await this.verifyFirebaseIdToken(accessToken)
      return {
        uid: decoded.uid,
        email: decoded.email ?? "",
        name: decoded.name ?? "",
      }
    } catch (error) {
      throw new CoAuthorError(
        {
          code: "AuthFailed",
          message:
            "認証に失敗しました。有効期限が切れているか、不正な認証情報です。",
        },
        error,
      )
    }
  }

  /**
   * FirebaseのIDトークンを検証する
   * @param token FirebaseのIDトークン
   * @returns
   */
  private async verifyFirebaseIdToken(token: string) {
    return await verifyIdToken(token)
  }
}
