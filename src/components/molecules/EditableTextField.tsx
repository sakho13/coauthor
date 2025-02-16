import { joinClassName } from "@/utils/functions/joinClassName"
import { Pen, Save } from "lucide-react"
import { useState } from "react"

type Props = {
  className?: string
  value: string
  onChange: (value: string) => void
  onEditSubmit: () => Promise<void>
}

/**
 * 編集可能なテキストコンポーネント
 *
 * テキスト末尾のペンアイコンをクリックすると、pタグがテキストフィールドに切り替わり編集が可能になります。
 * 編集が終わると、Enterを押すか、Saveボタンをクリックすることで編集内容が保存されます。
 */
export function EditableTextField({
  className,
  value,
  onChange,
  onEditSubmit,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div
      className={joinClassName(
        "flex items-center",
        "border-r border-b",
        "pl-2",
      )}
    >
      {isEditing ? (
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsEditing(false)
              onEditSubmit()
            }
          }}
          onBlur={() => {
            setIsEditing(false)
            onEditSubmit()
          }}
          className={`w-full`}
          autoFocus
        />
      ) : (
        <p className={className}>{value}</p>
      )}

      {isEditing ? (
        <Save
          onClick={() => {
            setIsEditing(false)
            onEditSubmit()
          }}
          className='cursor-pointer mx-2 hover:text-primary'
        />
      ) : (
        <Pen
          onClick={() => setIsEditing(true)}
          className='cursor-pointer w-4 mx-2 hover:text-primary'
        />
      )}
    </div>
  )
}
