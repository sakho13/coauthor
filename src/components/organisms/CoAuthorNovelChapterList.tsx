"use client"

import { useGetNovelChapters } from "@/utils/hooks/useNovelChapters"
import { SubParagraph } from "../atoms/SubParagraph"
import { DateUtility } from "@/utils/utilities/DateUtility"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
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
import { useState } from "react"
import { useApiV1 } from "@/utils/hooks/useApiV1"
import { toast } from "sonner"
import { useAuthStore } from "@/utils/stores/useAuthStore"

type Props = {
  novelId: string
}

export function CoAuthorNovelChapterList({ novelId }: Props) {
  const {
    dataGetNovelChapters,
    isLoadingGetNovelChapters,
    newChapterTitle,
    isDialogOpen,
    onChangeNewChapterTitle,
    createNewChapter,
    toggleDialog,
  } = useCoAuthorNovelChapterList(novelId)

  const router = useRouter()

  const table = useReactTable({
    columns: [
      {
        accessorKey: "title",
        header: "タイトル",
        cell: ({ row }) => <p className='w-[300px]'>{row.getValue("title")}</p>,
      },
    ],
    data: dataGetNovelChapters?.success
      ? dataGetNovelChapters.data.chapters
      : [],
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoadingGetNovelChapters) {
    return <p>読み込み中...</p>
  }

  if (!dataGetNovelChapters || !dataGetNovelChapters.success) {
    return <p>データ読み込みに失敗しました。</p>
  }

  return (
    <div id='coauthor-novel-chapter-list' className=''>
      <div id={`novel-title-${dataGetNovelChapters.data.novel.id}`}>
        <HeaderParagraph>
          <h2 className='text-lg'>{dataGetNovelChapters.data.novel.title}</h2>

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

        <div className='mx-4'>
          <SubParagraph>
            最終更新日:{" "}
            {DateUtility.convertJstYYYYMMDDHHMM(
              String(dataGetNovelChapters.data.novel.updatedAt),
            )}
          </SubParagraph>
        </div>
      </div>

      <div
        id={`novel-chapters-${dataGetNovelChapters.data.novel.id}`}
        className='mx-4'
      >
        <Table className='min-w-[600px]'>
          <TableHeader className='select-none'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=''>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={`novel-row-${row.id}`}
                  className='cursor-pointer'
                  onClick={() => {
                    router.push(`/novel/${novelId}/c/${row.original.id}`)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={`novel-cell-${row.id}-${cell.id}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center'>
                  <p>執筆中の小説はありません。</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

  const { postChapter } = useApiV1()

  const onChangeNewChapterTitle = (value: string) => {
    setNewChapterTitle(value.trim())
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

  return {
    dataGetNovelChapters,
    isLoadingGetNovelChapters,
    newChapterTitle,
    isDialogOpen,
    onChangeNewChapterTitle,
    createNewChapter,
    toggleDialog: _toggleDialog,
  }
}
