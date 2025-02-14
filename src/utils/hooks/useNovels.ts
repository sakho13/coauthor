import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { useAuthStore } from "../stores/useAuthStore"
import { apiV1GetFetcher } from "../functions/apiV1Fetchers"
import { useApiV1 } from "./useApiV1"
import { toast } from "sonner"

export function useGetNovels(immutable = false) {
  const { accessToken } = useAuthStore()

  const swr = immutable ? useSWRImmutable : useSWR
  const { data, error, isLoading, mutate } = swr(
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
    refreshGetNovels: mutate,
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
      toast.error("システムエラー", { description: result.error.message })
      return
    }

    toast.success("小説を作成しました")
    return result
  }

  return {
    createNovel,
  }
}

export function useEditNovel() {
  const { accessToken } = useAuthStore()
  const { patchNovel } = useApiV1()

  const editNovel = async <T extends "title" | "summary" | "novelType">(
    novelId: string,
    key: T,
    value: string,
  ) => {
    if (!accessToken) {
      toast.error("ログインしてください")
      return
    }

    const updateData = { [key]: value }

    const result = await patchNovel(accessToken, { novelId, ...updateData })
    if (!result.success) {
      toast.error(result.error.message)
      return
    }

    toast.success("小説を編集しました")
    return result
  }

  return { editNovel }
}
