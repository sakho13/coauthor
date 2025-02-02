import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { useAuthStore } from "../stores/useAuthStore"
import { apiV1GetFetcher } from "../functions/apiV1Fetchers"

export function useGetNovels(immutable = false) {
  const { accessToken } = useAuthStore()

  const swr = immutable ? useSWRImmutable : useSWR
  const { data, error, isLoading } = swr(
    ["/api/v1/novels", accessToken],
    async ([url, accessToken]) =>
      accessToken
        ? apiV1GetFetcher("Novels", url, {
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
