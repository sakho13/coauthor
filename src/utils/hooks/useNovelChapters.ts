import useSWR from "swr"
import { useAuthStore } from "../stores/useAuthStore"
import { apiV1GetFetcher } from "../functions/apiV1Fetchers"

export function useGetNovelChapters(novelId: string) {
  const { accessToken } = useAuthStore()

  const { data, error, isLoading, mutate } = useSWR(
    ["/api/v1/novel/chapters", accessToken],
    async ([url, accessToken]) =>
      accessToken && novelId
        ? apiV1GetFetcher("NovelChapters", `${url}?novel_id=${novelId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : null,
  )

  const refresh = () => mutate()

  return {
    dataGetNovelChapters: data,
    errorGetNovelChapters: error,
    isLoadingGetNovelChapters: isLoading,
    refreshGetNovelChapters: refresh,
  }
}
