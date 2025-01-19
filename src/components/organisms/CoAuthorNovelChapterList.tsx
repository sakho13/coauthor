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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

type Props = {
  novelId: string
}

export function CoAuthorNovelChapterList({ novelId }: Props) {
  const { dataGetNovelChapters, isLoadingGetNovelChapters } =
    useGetNovelChapters(novelId)
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
        <div className='border-b px-2 pb-1 mb-4 flex justify-between items-center'>
          <h2 className='text-lg'>{dataGetNovelChapters.data.novel.title}</h2>

          <Dialog>
            <DialogTrigger asChild>
              <Button>新規</Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>新規チャプター</DialogTitle>
              </DialogHeader>
              <div>ここに新規チャプターのフォームを実装</div>
            </DialogContent>
          </Dialog>
        </div>

        <div className='mx-4'>
          <SubParagraph>
            最終更新日:{" "}
            {DateUtility.convertToLocalDateTime(
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
                    router.push(`/novel/${novelId}/${row.original.id}`)
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
