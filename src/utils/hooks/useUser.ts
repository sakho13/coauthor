import useSWR from "swr"
import { useAuthStore } from "../stores/useAuthStore"
import { apiV1GetFetcher } from "../functions/apiV1Fetchers"

export function useGetUser() {
  const { accessToken } = useAuthStore()

  const { data, error, isLoading } = useSWR(
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
    errorGetUser: error,
    isLoadingGetUser: isLoading,
  }
}
