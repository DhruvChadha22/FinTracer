"use client"

import * as React from "react"
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import UploadButton from "@/components/UploadButton";

import { useConfirm } from "@/hooks/useConfirm";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
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
} from "@/components/ui/table"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  onOpen: () => void;
  onDelete: (rows: Row<TData>[]) => void;
  onUpload?: (results: any) => void;
  disabled?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onOpen,
  onDelete,
  onUpload,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to perform a bulk-delete", 
  );

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: {
            pageSize: 5,
        },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div>
        <ConfirmDialog />
        <div className="flex items-center py-4 gap-4">
            <Input
                placeholder={`Filter ${filterKey}...`}
                value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn(filterKey)?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
            <div className="hidden md:flex md:items-center md:gap-x-2">
                <Button onClick={onOpen} size="sm">
                    <Plus className="size-4 mr-2" />
                    Add new
                </Button>
                {!!onUpload && <UploadButton onUpload={onUpload} />}
            </div>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button
                    disabled={disabled}
                    size="sm"
                    variant="outline"
                    className="ml-auto font-normal text-xs"
                    onClick={async () => {
                        const ok = await confirm();

                        if (ok) {
                            onDelete(table.getFilteredSelectedRowModel().rows);
                            table.resetRowSelection();
                        }
                    }}
                >
                    <Trash className="size-4 mr-2" />
                    <span className="font-semibold">
                        Delete ({table.getFilteredSelectedRowModel().rows.length})
                    </span>
                </Button>
            )}
        </div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 pt-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
    </div>
  )
}
