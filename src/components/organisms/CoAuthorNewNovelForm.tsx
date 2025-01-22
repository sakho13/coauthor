import { useAuthStore } from "@/utils/stores/useAuthStore"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { useState } from "react"
import { joinClassName } from "@/utils/functions/joinClassName"
import { useApiV1 } from "@/utils/hooks/useApiV1"

export function CoAuthorNewNovelForm() {
  const {
    isLoading,
    title,
    titleValidate,
    summary,
    summaryValidate,
    novelType,
    onChangeTitle,
    onChangeSummary,
    onChangeNovelType,
    createNovel,
  } = useCoAuthorNewNovelForm()

  return (
    <div>
      <div className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>タイトル*</Label>
          <Input
            id='title'
            type='text'
            required
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            className={titleValidate ? "border-red-500" : ""}
          />
          {titleValidate && <p className='text-red-500'>{titleValidate}</p>}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='content'>内容</Label>
          <textarea
            id='content'
            placeholder='最大500文字まで'
            className={joinClassName(
              "w-full h-32 p-2 border border-border rounded-md",
              summaryValidate ? "border-red-500" : "",
            )}
            value={summary}
            onChange={(e) => onChangeSummary(e.target.value)}
          />
          {summaryValidate && <p className='text-red-500'>{summaryValidate}</p>}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='type'>小説種類*</Label>
          <Select
            required
            value={novelType}
            onValueChange={(value) => onChangeNovelType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='小説の種類を選択してください' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>連載</SelectItem>
              {/* <SelectItem value='1'>短編</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        <Button className='w-full' disabled={isLoading} onClick={createNovel}>
          作成
        </Button>
      </div>
    </div>
  )
}

function useCoAuthorNewNovelForm() {
  const { accessToken } = useAuthStore()
  const { postNovel } = useApiV1()

  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [titleValidate, setTitleValidate] = useState<string | null>(null)
  const [summary, setSummary] = useState("")
  const [summaryValidate, setSummaryValidate] = useState<string | null>(null)
  const [novelType, setNovelType] = useState<string>("0")

  if (!accessToken) {
    toast.warning("ログインしてください")
    redirect("/login")
  }

  const createNovel = async () => {
    if (isLoading) return

    setIsLoading(true)

    const validateResultTitle = _validateTitle(title)
    const validateResultSummary = _validateSummary(summary)
    setTitleValidate(validateResultTitle)
    setSummaryValidate(validateResultSummary)

    if (validateResultTitle || validateResultSummary) {
      toast.error("入力内容を確認してください")
      return
    }

    const result = await postNovel(accessToken, {
      title,
      summary,
      novelType,
    })

    setIsLoading(false)
    if (!result.success) {
      toast.error("小説の作成に失敗しました。", {
        description: `時間をおいて再度お試しください。（CODE: ${result.error.code}）`,
      })
      return
    }

    toast.success("小説を作成しました", {
      description: `タイトル「${result.data.novel.title}」`,
    })
    redirect(`/novel/${result.data.novel.id}`)
  }

  const onChangeTitle = (value: string) => {
    setTitle(value)

    if (titleValidate) {
      setTitleValidate(_validateTitle(value))
    }
  }

  const onChangeSummary = (value: string) => {
    setSummary(value)

    if (summaryValidate) {
      setSummaryValidate(_validateSummary(value))
    }
  }

  const onChangeNovelType = (value: string) => setNovelType(value)

  const _validateTitle = (value: string) => {
    if (value.length < 1) {
      return "タイトルは必須です"
    }
    return null
  }

  const _validateSummary = (value: string) => {
    if (value.length > 500) {
      return "内容は500文字以内で入力してください"
    }
    return null
  }

  return {
    isLoading,
    title,
    titleValidate,
    summary,
    summaryValidate,
    novelType,

    onChangeTitle,
    onChangeSummary,
    onChangeNovelType,
    createNovel,
  }
}
