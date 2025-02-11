import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { useAuthStore } from "../stores/useAuthStore"
import { apiV1GetFetcher } from "../functions/apiV1Fetchers"
import { useApiV1 } from "./useApiV1"
import { toast } from "sonner"

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

export function useCreateNovel() {
  const { accessToken } = useAuthStore()
  const { postNovel } = useApiV1()

  const createNovel = async () => {
    if (!accessToken) {
      toast.error("ログインしてください")
      return
    }

    const result = await postNovel(accessToken)
    if (!result.success) {
      toast.error(result.error.message)
      return
    }

    toast.success("小説を作成しました")
    return result
  }

  return {
    createNovel,
  }
}
