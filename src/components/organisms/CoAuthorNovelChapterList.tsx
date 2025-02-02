"use client"

import { useGetNovelChapters } from "@/utils/hooks/useNovelChapters"
import { SubParagraph } from "../atoms/SubParagraph"
import { DateUtility } from "@/utils/utilities/DateUtility"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { HeaderParagraph } from "../atoms/HeaderParagraph"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useApiV1 } from "@/utils/hooks/useApiV1"
import { toast } from "sonner"
import { useAuthStore } from "@/utils/stores/useAuthStore"
import { joinClassName } from "@/utils/functions/joinClassName"
import { CoAuthor_NovelChapter_AppendedDate } from "@/utils/types/CABaseTypes"

type Props = {
  novelId: string
}

export function CoAuthorNovelChapterList({ novelId }: Props) {
  const {
    dataGetNovelChapters,
    novelTitle,
    chapters,
    isLoadingGetNovelChapters,
    newChapterTitle,
    isDialogOpen,
    onChangeNewChapterTitle,
    createNewChapter,
    toggleDialog,
  } = useCoAuthorNovelChapterList(novelId)

  const router = useRouter()

  if (isLoadingGetNovelChapters) {
    return <p>読み込み中...</p>
  }

  if (!dataGetNovelChapters || !dataGetNovelChapters.success) {
    return <p>データ読み込みに失敗しました。</p>
  }

  return (
    <div id='coauthor-novel-chapter-list' className=''>
      <div
        id={`novel-title-${dataGetNovelChapters.data.novel.id}`}
        className='mb-4'
      >
        <HeaderParagraph>
          <h2 className='text-lg'>{novelTitle}</h2>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(st) => toggleDialog(st ? "open" : "close")}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus />
                新規
              </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>新規コンテンツを追加</DialogTitle>
              </DialogHeader>
              <div id='novel-chapter-form' className='grid gap-2'>
                <div>
                  <Label>タイトル</Label>
                  <Input
                    value={newChapterTitle}
                    onChange={(e) => onChangeNewChapterTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createNewChapter}>追加</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </HeaderParagraph>
      </div>

      <div
        id={`novel-chapters-${dataGetNovelChapters.data.novel.id}`}
        className='mx-4 grid grid-cols-2 gap-6'
      >
        <div className='overflow-y-auto overflow-x-clip border px-8'>
          {chapters.map((chapter, i) => (
            <div
              key={`novel-chapter-${dataGetNovelChapters.data.novel.id}-${chapter.id}`}
              className='w-full'
            >
              {i !== 0 && <div className='border-b' />}

              <div
                className={joinClassName(
                  "flex justify-between flex-col",
                  "py-4",
                  "w-full",
                )}
              >
                <div className='flex justify-between'>
                  <div className='flex truncate'>
                    <span className='bg-teal-100 h-fit select-none px-1 mr-2'>
                      ep{chapter.order}
                    </span>

                    <p className='w-full truncate'>{chapter.title}</p>
                  </div>
                  <Button
                    onClick={() =>
                      router.push(`/novel/${novelId}/c/${chapter.order}`)
                    }
                    variant='link'
                    className=''
                  >
                    編集
                  </Button>
                </div>

                <p className='text-sm text-gray-500'>
                  編集日時:{" "}
                  {DateUtility.convertJstYYYYMMDDHHMM(chapter.updatedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div id='' className=''>
          <div
            id='date-bar'
            className='px-4 mb-4 grid grid-cols-2 gap-4 border-b'
          >
            <SubParagraph>
              最終更新日時:{" "}
              {DateUtility.convertJstYYYYMMDDHHMM(
                String(dataGetNovelChapters.data.novel.updatedAt),
              )}
            </SubParagraph>
            <SubParagraph>
              作成日時:{" "}
              {DateUtility.convertJstYYYYMMDDHHMM(
                String(dataGetNovelChapters.data.novel.createdAt),
              )}
            </SubParagraph>
          </div>

          <div className=''>
            <div className='flex items-center'>
              <h1 className='font-bold'>概要</h1>
            </div>

            <div className='mx-4'>
              {dataGetNovelChapters.data.novel.summary || (
                <SubParagraph>未入力</SubParagraph>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function useCoAuthorNovelChapterList(novelId: string) {
  const {
    dataGetNovelChapters,
    isLoadingGetNovelChapters,
    refreshGetNovelChapters,
  } = useGetNovelChapters(novelId)

  const { accessToken } = useAuthStore()
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [title, setTitle] = useState<string>("")
  const [chapters, setChapters] = useState<
    Omit<CoAuthor_NovelChapter_AppendedDate, "content">[]
  >([])

  const { postChapter } = useApiV1()

  const onChangeNewChapterTitle = (value: string) => {
    setNewChapterTitle(value)
  }

  const createNewChapter = async () => {
    if (!accessToken) return

    if (newChapterTitle.length === 0) {
      toast.warning("タイトルが入力されていません")
      return
    }

    try {
      await postChapter(accessToken, {
        novelId,
        title: newChapterTitle,
      })
      toast.success("新しい章を追加しました")
      refreshGetNovelChapters()
      setNewChapterTitle("")
      _toggleDialog("close")
    } catch {
      toast.error("新規コンテンツの追加に失敗しました")
    }
  }

  const _toggleDialog = (state: "open" | "close") => {
    setIsDialogOpen(state === "open")
  }

  useEffect(() => {
    if (dataGetNovelChapters?.success) {
      setChapters(dataGetNovelChapters.data.chapters)
      setTitle(dataGetNovelChapters.data.novel.title)
    }
  }, [dataGetNovelChapters])

  return {
    dataGetNovelChapters,
    novelTitle: title,
    chapters,
    isLoadingGetNovelChapters,
    newChapterTitle,
    isDialogOpen,
    onChangeNewChapterTitle,
    createNewChapter,
    toggleDialog: _toggleDialog,
  }
}
