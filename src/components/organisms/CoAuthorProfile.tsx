"use client"

import { useGetUser } from "@/utils/hooks/useUser"
import { useEffect, useState } from "react"
import { EditableTextField } from "../molecules/EditableTextField"

export function CoAuthorProfile() {
  const { userInfo, onChangeName, onSaveName } = useCoAuthorProfile()

  return (
    <div id='coauthor-profile'>
      <div className='flex items-center gap-4'>
        <span>ユーザ名:</span>

        <EditableTextField
          value={userInfo.name}
          onChange={onChangeName}
          onEditSubmit={onSaveName}
          className='min-w-20'
        />
      </div>
    </div>
  )
}

function useCoAuthorProfile() {
  const { dataGetUser } = useGetUser()

  const [name, setName] = useState("")

  const onChangeName = (value: string) => {
    setName(value)
  }

  const onSaveName = async () => {}

  useEffect(() => {
    if (dataGetUser) {
      if (dataGetUser.success) {
        setName(dataGetUser.data.user.name)
      }
    }
  }, [dataGetUser])

  return {
    userInfo: {
      name,
    },
    onChangeName,
    onSaveName,
  }
}
