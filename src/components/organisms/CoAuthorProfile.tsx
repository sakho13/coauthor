import { useGetUser } from "@/utils/hooks/useUser"

export function CoAuthorProfile() {
  const { dataGetUser } = useGetUser()

  return (
    <div id='coauthor-profile'>
      <div>
        <p>{dataGetUser?.success ? dataGetUser.data.user.name : ""}</p>
      </div>
    </div>
  )
}
