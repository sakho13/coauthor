import useSWR from "swr"
import { useAuthStore } from "../stores/useAuthStore"
import { apiV1GetFetcher } from "../functions/apiV1Fetchers"
import { useApiV1 } from "./useApiV1"
import { toast } from "sonner"

export function useGetUser() {
  const { accessToken } = useAuthStore()

  const { data, error, isLoading, mutate } = useSWR(
    ["/api/v1/user", accessToken],
    async ([url, accessToken]) =>
      accessToken
        ? apiV1GetFetcher("User", url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : null,
  )

  return {
    dataGetUser: data,
    refreshGetUser: mutate,
    errorGetUser: error,
    isLoadingGetUser: isLoading,
  }
}

export function useEditUser() {
  const { accessToken } = useAuthStore()
  const { patchUser } = useApiV1()

  const editUser = async <T extends "name">(key: T, value: string) => {
    if (!accessToken) {
      toast.error("ログインしてください")
      return
    }

    const updateData = { [key]: value }

    const result = await patchUser(accessToken, { ...updateData })
    if (!result.success) {
      toast.error(result.error.message)
      return
    }

    toast.success("小説を編集しました")
    return result
  }

  return { editUser }
}
