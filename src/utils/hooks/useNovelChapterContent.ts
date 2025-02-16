import useSWRImmutable from "swr/immutable"
import { useAuthStore } from "../stores/useAuthStore"
import { apiV1GetFetcher } from "../functions/apiV1Fetchers"

export function useGetNovelChapterContent(novelId: string, order: number) {
  const { accessToken } = useAuthStore()

  const { data, error, isLoading, mutate } = useSWRImmutable(
    ["/api/v1/novel/chapter/content", accessToken, novelId, order],
    async ([url, accessToken]) =>
      accessToken
        ? apiV1GetFetcher(
            "NovelChapterContent",
            `${url}?novel_id=${novelId}&order=${order}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
        : null,
  )

  return {
    dataGetNovelChapterContent: data,
    errorGetNovelChapterContent: error,
    isLoadingGetNovelChapterContent: isLoading,
    refreshGetNovelChapterContent: mutate,
  }
}
