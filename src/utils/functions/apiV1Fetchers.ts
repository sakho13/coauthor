import { ApiV1, ApiV1BaseOut } from "../types/CAApiIO"

type GetFetcherKey<T extends keyof ApiV1> = "Get" extends keyof ApiV1[T]
  ? "Out" extends keyof ApiV1[T]["Get"]
    ? ApiV1[T]["Get"]["Out"]
    : never
  : never

export const apiV1GetFetcher = <
  T extends keyof ApiV1,
  S extends GetFetcherKey<T>,
>(
  key: T,
  ...args: Parameters<typeof fetch>
) =>
  fetch(...args).then((res) => {
    if (!res.ok) return res.json()
    return res.json()
  }) as Promise<ApiV1BaseOut<S>>
