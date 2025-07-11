"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreVerticalIcon,
} from "lucide-react";

import { z } from "zod";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const batterySchema = z.object({
  vin: z.string(),
  b_battery_no: z.string().optional().nullable(),
  b_battery_type: z.string().optional().nullable(),
  b_work_hour: z.preprocess((v) => Number(v ?? 0), z.number()),
  b_last_conn: z.string().optional().nullable(),
  b_company: z.string().optional().nullable(),
  b_online: z.preprocess((v) => Number(v ?? 0), z.number()),
  b_release_date: z.string().optional().nullable(),
});

const columns: ColumnDef<z.infer<typeof batterySchema>>[] = [
  {
    accessorKey: "vin",
    header: "VIN",
  },
  {
    accessorKey: "b_battery_no",
    header: "Battery No",
  },
  {
    accessorKey: "b_battery_type",
    header: "Type",
  },
  {
    accessorKey: "b_work_hour",
    header: "Work Hour",
  },
  {
    accessorKey: "b_online",
    header: "Online",
  },
  {
    accessorKey: "b_company",
    header: "Company",
  },
  {
    accessorKey: "b_last_conn",
    header: "Last Connected",
    cell: ({ row }) => {
      const dt = row.original.b_last_conn
        ? new Date(row.original.b_last_conn)
        : null;
      return (
        <div>
          {dt && !isNaN(dt.getTime()) ? (
            <>
              {dt.toLocaleDateString()}{" "}
              <span className='text-xs text-muted-foreground'>
                {dt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          ) : (
            <span className='text-muted-foreground'>-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "b_release_date",
    header: "Release Date",
    cell: ({ row }) => {
      const dt = row.original.b_release_date
        ? new Date(row.original.b_release_date)
        : null;
      return (
        <div>
          {dt && !isNaN(dt.getTime()) ? (
            <>
              {dt.toLocaleDateString()}{" "}
              <span className='text-xs text-muted-foreground'>
                {dt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          ) : (
            <span className='text-muted-foreground'>-</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex size-8 text-muted-foreground data-[state=open]:bg-muted'
            size='icon'
          >
            <MoreVerticalIcon />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuItem>View Historical Data</DropdownMenuItem>
          <DropdownMenuItem>View Historical Fault</DropdownMenuItem>
          <DropdownMenuItem>Change Parameters</DropdownMenuItem>
          <DropdownMenuItem>Low SOC Analysis</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof batterySchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.vin, // Use vin as unique ID
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({ data }: { data: z.infer<typeof batterySchema>[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ vin }) => vin) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.vin,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className='flex w-full flex-col justify-start gap-6'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              <ColumnsIcon />
              <span className='hidden lg:inline'>Customize Columns</span>
              <span className='lg:hidden'>Columns</span>
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='overflow-hidden rounded-lg border'>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className='sticky top-0 z-10 bg-muted'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className='**:data-[slot=table-cell]:first:w-8'>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className='flex items-center justify-center px-4'>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className='w-20' id='rows-per-page'>
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
