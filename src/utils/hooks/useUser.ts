import useSWR from "swr"
import { ApiV1, ApiV1BaseOut } from "../types/CAApiIO"
import { useAuthStore } from "../stores/useAuthStore"

export const apiV1Fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => {
    if (!res.ok) return res.json()
    return res.json()
  }) as Promise<ApiV1BaseOut<ApiV1["User"]["Get"]["Out"]>>

export function useGetUser() {
  const { accessToken } = useAuthStore()

  const { data, error, isLoading } = useSWR(
    ["/api/v1/user", accessToken],
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
    dataGetUser: data,
    errorGetUser: error,
    isLoadingGetUser: isLoading,
  }
}
