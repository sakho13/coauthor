"use client"

import { useEditUser, useGetUser } from "@/utils/hooks/useUser"
import { useEffect, useState } from "react"
import { EditableTextField } from "../molecules/EditableTextField"
import { toast } from "sonner"

export function CoAuthorProfile() {
  const { userInfo, nameError, onChangeName, onSaveName } = useCoAuthorProfile()

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
      {nameError && <div className='text-red-500 text-sm'>{nameError}</div>}
    </div>
  )
}

function useCoAuthorProfile() {
  const { dataGetUser, refreshGetUser } = useGetUser()
  const { editUser } = useEditUser()

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState<string | null>(null)

  const onChangeName = (value: string) => {
    if (value.trim().length > 50) {
      setNameError("ユーザ名は50文字以内で入力してください")
      return
    }
    setNameError(null)
    setName(value.trim())
  }

  const onSaveName = async () => {
    if (name.trim().length > 50) {
      toast.warning("ユーザ名は50文字以内で入力してください")
      if (dataGetUser?.success) {
        setName(dataGetUser.data.user.name)
      }
      return
    }

    const result = await editUser("name", name)

    if (result) {
      await refreshGetUser()
    }
  }

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
    nameError,
    onChangeName,
    onSaveName,
  }
}
