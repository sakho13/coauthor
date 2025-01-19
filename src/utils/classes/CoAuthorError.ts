import { ApiV1ErrorOut } from "../types/CAApiIO"

export class CoAuthorError extends Error {
  private _err: ApiV1ErrorOut
  private _rawError: Error | null = null

  constructor(
    e: Omit<ApiV1ErrorOut, "columns"> | ApiV1ErrorOut,
    error?: unknown,
  ) {
    super(e.message)
    this._err = {
      code: e.code,
      message: e.message,
      columns: [],
    }
    if ("columns" in e) {
      this._err.columns = e.columns
    }

    if (error && error instanceof Error) {
      this._rawError = error
    }
  }

  get code() {
    return this._err.code
  }

  get message() {
    return this._err.message
  }

  get columns() {
    return this._err.columns
  }
}
