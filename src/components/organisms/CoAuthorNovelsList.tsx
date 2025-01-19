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
import { useRouter } from "next/navigation"
import { DateUtility } from "@/utils/utilities/DateUtility"
import { Novel_Type } from "@/utils/types/CABaseTypes"

export function CoAuthorNovelsList() {
  const { dataGetNovels, isLoadingGetNovels } = useGetNovels(true)
  const router = useRouter()

  const table = useReactTable({
    columns: [
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
          DateUtility.convertToLocalDateTime(row.getValue("updatedAt")),
      },
      {
        accessorKey: "createdAt",
        header: "作成日",
        cell: ({ row }) =>
          DateUtility.convertToLocalDateTime(row.getValue("createdAt")),
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
    <div className=''>
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
                  router.push(`/novel/${row.original.id}`)
                }}
              >
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
