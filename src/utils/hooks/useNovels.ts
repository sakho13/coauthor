import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { useAuthStore } from "../stores/useAuthStore"
import { ApiV1BaseOut, ApiV1 } from "../types/CAApiIO"

export const apiV1Fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => {
    if (!res.ok) return res.json()
    return res.json()
  }) as Promise<ApiV1BaseOut<ApiV1["Novels"]["Get"]["Out"]>>

export function useGetNovels(immutable = false) {
  const { accessToken } = useAuthStore()

  const swr = immutable ? useSWRImmutable : useSWR
  const { data, error, isLoading } = swr(
    ["/api/v1/novels", accessToken],
    async ([url, accessToken]) =>
      accessToken
        ? apiV1Fetcher(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : null,
  )

  return {
    dataGetNovels: data,
    errorGetNovels: error,
    isLoadingGetNovels: isLoading,
  }
}
