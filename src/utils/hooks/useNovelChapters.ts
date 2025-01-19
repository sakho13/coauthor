import useSWR from "swr"
import { useAuthStore } from "../stores/useAuthStore"
import { ApiV1BaseOut, ApiV1 } from "../types/CAApiIO"

export const apiV1Fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => {
    if (!res.ok) return res.json()
    return res.json()
  }) as Promise<ApiV1BaseOut<ApiV1["NovelChapters"]["Get"]["Out"]>>

export function useGetNovelChapters(novelId: string) {
  const { accessToken } = useAuthStore()

  const { data, error, isLoading, mutate } = useSWR(
    ["/api/v1/novel/chapters", accessToken],
    async ([url, accessToken]) =>
      accessToken && novelId
        ? apiV1Fetcher(`${url}?novel_id=${novelId}`, {
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
