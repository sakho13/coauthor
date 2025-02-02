import { useGetNovels } from "@/utils/hooks/useNovels"
import { toast } from "sonner"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { DateUtility } from "@/utils/utilities/DateUtility"
import { Novel_Type } from "@/utils/types/CABaseTypes"
import Link from "next/link"
import { SquarePen } from "lucide-react"

export function CoAuthorNovelsList() {
  const { dataGetNovels, isLoadingGetNovels } = useGetNovels(true)

  const table = useReactTable({
    columns: [
      {
        header: "編集",
        cell: ({ row }) => (
          <div className='px-4'>
            <Link
              href={`/novel/${row.original.id}`}
              className='hover:text-primary'
            >
              <SquarePen />
            </Link>
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "タイトル",
        cell: ({ row }) => <p className='w-[300px]'>{row.getValue("title")}</p>,
      },
      {
        accessorKey: "type",
        header: "種類",
        cell: ({ row }) =>
          row.getValue("type") === Novel_Type[0] ? "連載" : "短編",
      },
      {
        accessorKey: "updatedAt",
        header: "更新日",
        cell: ({ row }) =>
          DateUtility.convertJstYYYYMMDDHHMM(row.getValue("updatedAt")),
      },
      {
        accessorKey: "createdAt",
        header: "作成日",
        cell: ({ row }) =>
          DateUtility.convertJstYYYYMMDDHHMM(row.getValue("createdAt")),
      },
    ],
    data: !!dataGetNovels?.success ? dataGetNovels.data.novels : [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (isLoadingGetNovels) {
    return <p>読み込み中...</p>
  }

  if (!dataGetNovels) {
    toast.warning("小説データ取得に失敗しました")
    return <p>データ取得に失敗しました。</p>
  }

  if (!dataGetNovels.success) {
    toast.error("小説データ取得に失敗しました", {
      description: `CODE: ${dataGetNovels.error.code}`,
    })
    return <p>データ取得に失敗しました。</p>
  }

  return (
    <div id='co-author-novels-list' className='overflow-x-auto'>
      <Table className='min-w-[600px]'>
        <TableHeader className='select-none'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
              <TableRow key={`novel-row-${row.id}`}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={`novel-cell-${row.id}-${cell.id}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  )
}
